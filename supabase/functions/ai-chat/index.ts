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
      return new Response(JSON.stringify({ error: "Chat is currently disabled" }), {
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

    const systemPrompt = `${config.system_prompt || "You are a helpful assistant."}

--- KNOWLEDGE BASE ---
Use the following information to answer customer questions accurately:

${knowledgeContext}

--- INSTRUCTIONS ---
- Answer based on the knowledge base when relevant
- Be concise and friendly
- Use markdown formatting for readability
- If you don't know something, suggest contacting support
- Never make up order statuses or tracking information`;

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
          ...messages.slice(-20), // Last 20 messages for context window
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "I'm a bit busy right now. Please try again in a moment!" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // We need to both stream to client AND capture full response for DB storage
    // Use TransformStream to intercept the response
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
          
          // Parse SSE to capture content
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
        
        // Save assistant response to DB
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
