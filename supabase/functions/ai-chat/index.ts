import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, conversation_id, session_id } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch admin-configured system prompt
    const { data: configRows } = await supabase
      .from("ai_chat_config")
      .select("key, value")
      .in("key", ["system_prompt", "is_enabled", "bot_name"]);

    const config: Record<string, string> = {};
    (configRows || []).forEach((r: any) => { config[r.key] = r.value; });

    if (config.is_enabled === "false") {
      return new Response(JSON.stringify({ error: "চ্যাট বর্তমানে বন্ধ আছে" }), {
        status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch knowledge base for context
    const { data: knowledgeRows } = await supabase
      .from("ai_knowledge_base")
      .select("title, content, category")
      .eq("is_active", true);

    const knowledgeContext = (knowledgeRows || [])
      .map((k: any) => `## ${k.title} (${k.category})\n${k.content}`)
      .join("\n\n");

    // Fetch product catalog for recommendations
    const { data: productRows } = await supabase
      .from("products")
      .select("name, slug, price, original_price, category, images, description")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(50);

    const productCatalog = (productRows || [])
      .map((p: any) => `- ${p.name} | slug:${p.slug} | ৳${p.price} | category:${p.category} | image:${p.images?.[0] || ''} | ${p.description?.slice(0, 80) || ''}`)
      .join("\n");

    const systemPrompt = `${config.system_prompt || "আপনি SHAHEB এর একজন সহায়ক সহকারী। সবসময় বাংলায় উত্তর দিন।"}

--- জ্ঞানভান্ডার ---
নিচের তথ্য ব্যবহার করে গ্রাহকদের প্রশ্নের সঠিক উত্তর দিন:

${knowledgeContext}

--- পণ্য তালিকা ---
গ্রাহককে পণ্য সুপারিশ করতে, নিচের ফরম্যাটে পণ্য দেখান:
[product:SLUG_NAME]

উদাহরণ: "এই শার্টটি আপনার জন্য দারুণ হবে: [product:classic-oxford-shirt]"

উপলব্ধ পণ্য:
${productCatalog}

--- নির্দেশনা ---
- সবসময় বাংলায় উত্তর দিন
- জ্ঞানভান্ডারের তথ্য অনুযায়ী উত্তর দিন
- সংক্ষিপ্ত ও বন্ধুত্বপূর্ণ থাকুন
- পণ্য সুপারিশ করার সময় অবশ্যই [product:slug] ফরম্যাট ব্যবহার করুন
- প্রাসঙ্গিক হলে একাধিক পণ্য সুপারিশ করুন
- মার্কডাউন ফরম্যাটিং ব্যবহার করুন
- অর্ডার স্ট্যাটাস বা ট্র্যাকিং তথ্য বানিয়ে বলবেন না
- না জানলে সাপোর্টে যোগাযোগ করতে বলুন`;

    // Save user message to DB if conversation exists
    if (conversation_id && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === "user") {
        await supabase.from("chat_messages").insert({
          conversation_id,
          role: "user",
          content: lastMsg.content,
        });
      }
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.slice(-20),
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "এই মুহূর্তে ব্যস্ত আছি। দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন!" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "সেবা সাময়িকভাবে অনুপলব্ধ। দয়া করে পরে আবার চেষ্টা করুন।" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI সেবা অনুপলব্ধ" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let fullContent = "";

    (async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value, { stream: true });
          const lines = text.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ") && line.slice(6).trim() !== "[DONE]") {
              try {
                const parsed = JSON.parse(line.slice(6));
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) fullContent += content;
              } catch {}
            }
          }
          await writer.write(value);
        }
        if (conversation_id && fullContent) {
          await supabase.from("chat_messages").insert({
            conversation_id,
            role: "assistant",
            content: fullContent,
          });
          await supabase.from("chat_conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversation_id);
        }
      } catch (e) {
        console.error("Stream processing error:", e);
      } finally {
        await writer.close();
      }
    })();

    return new Response(readable, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
