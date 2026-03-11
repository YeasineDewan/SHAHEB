import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Loader2, Minimize2, Sparkles, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";

type Msg = { role: "user" | "assistant"; content: string };
interface ProductData {
  id: string; name: string; slug: string; price: number;
  original_price: number | null; images: string[] | null; category: string;
}

function getSessionId() {
  let id = localStorage.getItem("shaheb_session_id");
  if (!id) { id = crypto.randomUUID(); localStorage.setItem("shaheb_session_id", id); }
  return id;
}

function ProductCard({ product }: { product: ProductData }) {
  const { addItem } = useCart();
  const discount = product.original_price ? Math.round((1 - product.price / product.original_price) * 100) : 0;
  const image = product.images?.[0] || "/placeholder.svg";

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      product_id: product.id, name: product.name, price: product.price,
      original_price: product.original_price, image, size: "", color: "",
      quantity: 1, is_digital: false, slug: product.slug,
    });
    toast({ title: "কার্টে যোগ হয়েছে!", description: product.name });
  };

  return (
    <div className="flex gap-2.5 bg-card border border-border rounded-xl p-2.5 my-2 hover:shadow-sm transition-shadow">
      <Link to={`/products/${product.slug}`} className="w-16 h-20 rounded-lg overflow-hidden bg-secondary shrink-0">
        <img src={image} alt={product.name} className="w-full h-full object-cover" />
      </Link>
      <div className="flex-1 min-w-0">
        <Link to={`/products/${product.slug}`} className="text-xs font-semibold line-clamp-1 hover:text-accent transition-colors">{product.name}</Link>
        <p className="text-[10px] text-muted-foreground capitalize mt-0.5">{product.category}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-accent font-bold text-xs">৳{product.price.toLocaleString()}</span>
          {product.original_price && <span className="text-[10px] text-muted-foreground line-through">৳{product.original_price.toLocaleString()}</span>}
          {discount > 0 && <span className="text-[9px] bg-destructive text-destructive-foreground px-1 py-0.5 rounded">-{discount}%</span>}
        </div>
        <Button size="sm" className="h-6 text-[10px] rounded-full bg-accent text-accent-foreground hover:bg-accent/90 mt-1.5 px-3" onClick={handleAdd}>
          <ShoppingBag className="h-3 w-3 mr-1" /> কার্টে যোগ করুন
        </Button>
      </div>
    </div>
  );
}

function ChatMessageContent({ content, products }: { content: string; products: ProductData[] }) {
  // Split content by [product:slug] pattern
  const parts = content.split(/\[product:([^\]]+)\]/g);

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:my-1 [&>ul]:my-1 [&>h2]:text-sm [&>h3]:text-sm">
      {parts.map((part, i) => {
        if (i % 2 === 1) {
          const product = products.find(p => p.slug === part.trim());
          if (product) return <ProductCard key={i} product={product} />;
          return null;
        }
        if (!part.trim()) return null;
        return <ReactMarkdown key={i}>{part}</ReactMarkdown>;
      })}
    </div>
  );
}

export function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState("আসসালামু আলাইকুম! আমি আপনাকে কিভাবে সাহায্য করতে পারি?");
  const [botName, setBotName] = useState("SHAHEB সহকারী");
  const [enabled, setEnabled] = useState(true);
  const [products, setProducts] = useState<ProductData[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load config + products
  useEffect(() => {
    const load = async () => {
      const [configRes, prodRes] = await Promise.all([
        supabase.from("ai_chat_config" as any).select("key, value"),
        supabase.from("products").select("id, name, slug, price, original_price, images, category").eq("is_active", true).limit(50),
      ]);
      if (configRes.data) {
        const cfg: Record<string, string> = {};
        (configRes.data as any[]).forEach(r => { cfg[r.key] = r.value; });
        if (cfg.welcome_message) setWelcomeMessage(cfg.welcome_message);
        if (cfg.bot_name) setBotName(cfg.bot_name);
        if (cfg.is_enabled === "false") setEnabled(false);
      }
      if (prodRes.data) setProducts(prodRes.data);
    };
    load();
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  const ensureConversation = async () => {
    if (conversationId) return conversationId;
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id || null;
    const sessionId = userId ? null : getSessionId();
    const { data, error } = await supabase.from("chat_conversations" as any).insert({
      user_id: userId, session_id: sessionId,
    } as any).select("id").single();
    if (data) { setConversationId((data as any).id); return (data as any).id; }
    return null;
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const userMsg: Msg = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    const convId = await ensureConversation();
    let assistantSoFar = "";

    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const allMessages = [...messages, userMsg];
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: allMessages.map(m => ({ role: m.role, content: m.content })),
          conversation_id: convId,
          session_id: getSessionId(),
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "কিছু ভুল হয়েছে" }));
        upsertAssistant(err.error || "দুঃখিত, প্রক্রিয়া করতে পারিনি। আবার চেষ্টা করুন।");
        setLoading(false);
        return;
      }

      if (!resp.body) { upsertAssistant("দুঃখিত, কিছু ভুল হয়েছে।"); setLoading(false); return; }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const p = JSON.parse(json);
            const c = p.choices?.[0]?.delta?.content;
            if (c) upsertAssistant(c);
          } catch {}
        }
      }
    } catch {
      upsertAssistant("দুঃখিত, সংযোগে সমস্যা হচ্ছে। পরে আবার চেষ্টা করুন।");
    }
    setLoading(false);
  };

  if (!enabled) return null;

  const quickQuestions = [
    "আপনাদের শিপিং নীতি কী?",
    "আমার অর্ডার কিভাবে ট্র্যাক করব?",
    "কোন সাইজগুলো পাওয়া যায়?",
    "রিটার্ন কি সম্ভব?",
  ];

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 w-14 h-14 rounded-full bg-accent text-accent-foreground shadow-lg shadow-accent/30 flex items-center justify-center hover:scale-105 transition-transform"
          >
            <MessageCircle className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }} transition={{ duration: 0.2 }}
            className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] md:w-[400px] h-[500px] md:h-[560px] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-accent text-accent-foreground px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-accent-foreground/10 flex items-center justify-center">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{botName}</p>
                  <p className="text-[10px] opacity-80">AI চালিত</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-accent-foreground hover:bg-accent-foreground/10" onClick={() => setOpen(false)}>
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-accent-foreground hover:bg-accent-foreground/10" onClick={() => setOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="h-3.5 w-3.5 text-accent" />
                </div>
                <div className="bg-secondary rounded-2xl rounded-tl-md px-3.5 py-2.5 max-w-[85%]">
                  <p className="text-sm">{welcomeMessage}</p>
                </div>
              </div>

              {messages.length === 0 && (
                <div className="flex flex-wrap gap-1.5 pl-9">
                  {quickQuestions.map(q => (
                    <button key={q} onClick={() => { setInput(q); setTimeout(() => { setInput(q); }, 0); }}
                      className="text-[11px] px-3 py-1.5 rounded-full border border-border bg-card hover:border-accent/50 hover:bg-accent/5 transition-colors text-muted-foreground">
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={cn("flex gap-2", msg.role === "user" && "justify-end")}>
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="h-3.5 w-3.5 text-accent" />
                    </div>
                  )}
                  <div className={cn(
                    "rounded-2xl px-3.5 py-2.5 max-w-[85%] text-sm",
                    msg.role === "user" ? "bg-accent text-accent-foreground rounded-tr-md" : "bg-secondary rounded-tl-md"
                  )}>
                    {msg.role === "assistant" ? (
                      <ChatMessageContent content={msg.content} products={products} />
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {loading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <Sparkles className="h-3.5 w-3.5 text-accent" />
                  </div>
                  <div className="bg-secondary rounded-2xl rounded-tl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border shrink-0">
              <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                <Input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                  placeholder="আপনার বার্তা লিখুন..." className="rounded-full text-sm h-10" disabled={loading} />
                <Button type="submit" size="icon" disabled={!input.trim() || loading}
                  className="h-10 w-10 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 shrink-0">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
              <p className="text-[9px] text-muted-foreground text-center mt-1.5">AI চালিত · উত্তর সবসময় সঠিক নাও হতে পারে</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
