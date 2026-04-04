import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  User, Package, Heart, Settings, LogOut, Download, CreditCard, MapPin,
  Bell, ShieldCheck, Eye, FileText, Truck, ChevronRight, Receipt,
  Mail, Phone, Calendar, X, Printer, Edit, Save, Palette, Sparkles,
  Clock, CalendarDays, Wand2, Loader2, PenTool
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import logoImg from "@/assets/logo.png";
import { useLanguage } from "@/contexts/LanguageContext";

// ---- Session ID for guest users ----
function getSessionId() {
  let id = localStorage.getItem("shaheb_session_id");
  if (!id) { id = crypto.randomUUID(); localStorage.setItem("shaheb_session_id", id); }
  return id;
}

// ---- Types ----
interface OrderItem { name: string; qty: number; price: number; image: string; isDigital?: boolean; }
interface Order { id: string; order_number: string; date: string; status: string; total: number; items: OrderItem[]; }

const statusColor: Record<string, string> = {
  "pending": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "processing": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "shipped": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  "delivered": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "cancelled": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

// ---- Invoice Modal ----
function InvoiceModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const subtotal = order.items.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;
  return (
    <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-background rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between mb-6">
            <div><img src={logoImg} alt="SHAHEB" className="h-7 w-auto mb-2" /><p className="text-[10px] text-muted-foreground">Premium Men's Fashion</p></div>
            <div className="text-right"><h2 className="text-lg font-bold">INVOICE</h2><p className="text-sm font-medium text-accent">{order.order_number}</p><p className="text-xs text-muted-foreground mt-1">{order.date}</p></div>
          </div>
          <table className="w-full text-sm mb-6">
            <thead><tr className="border-b border-border"><th className="text-left py-2 font-medium text-xs">Item</th><th className="text-center py-2 font-medium text-xs">Qty</th><th className="text-right py-2 font-medium text-xs">Price</th><th className="text-right py-2 font-medium text-xs">Total</th></tr></thead>
            <tbody>{order.items.map((item, i) => (<tr key={i} className="border-b border-border"><td className="py-3 text-sm">{item.name}</td><td className="py-3 text-center">{item.qty}</td><td className="py-3 text-right">₹{item.price.toLocaleString()}</td><td className="py-3 text-right font-medium">₹{(item.price * item.qty).toLocaleString()}</td></tr>))}</tbody>
          </table>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">GST (18%)</span><span>₹{tax.toLocaleString()}</span></div>
            <Separator />
            <div className="flex justify-between font-bold text-base"><span>Total</span><span className="text-accent">₹{total.toLocaleString()}</span></div>
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <Button className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 rounded-full gap-2" onClick={() => toast({ title: "Invoice downloaded!" })}><Download className="h-4 w-4" /> Download PDF</Button>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}

// ---- AI Style Recommendations Component ----
function AIStyleRecommendations() {
  const { t } = useLanguage();
  const [bodyType, setBodyType] = useState("");
  const [preferences, setPreferences] = useState("");
  const [occasion, setOccasion] = useState("");
  const [budget, setBudget] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const getRecommendations = async () => {
    if (!bodyType) { toast({ title: t("ai.selectBodyType") }); return; }
    setLoading(true);
    setResult("");
    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/style-recommendations`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ bodyType, preferences, occasion, budget }),
      });
      if (!resp.ok || !resp.body) {
        if (resp.status === 429) { toast({ title: "Too many requests", description: "Please try again in a moment.", variant: "destructive" }); setLoading(false); return; }
        if (resp.status === 402) { toast({ title: "AI credits exhausted", variant: "destructive" }); setLoading(false); return; }
        throw new Error("Failed");
      }
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx); buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try { const p = JSON.parse(json); const c = p.choices?.[0]?.delta?.content; if (c) { accumulated += c; setResult(accumulated); } } catch {}
        }
      }
    } catch (e) {
      toast({ title: "Failed to get recommendations", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center"><Sparkles className="h-5 w-5 text-accent" /></div>
        <div><h2 className="font-bold text-lg">{t("ai.title")}</h2><p className="text-xs text-muted-foreground">{t("ai.desc")}</p></div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium">{t("ai.bodyType")}</Label>
            <Select value={bodyType} onValueChange={setBodyType}>
              <SelectTrigger className="rounded-lg"><SelectValue placeholder={t("ai.selectBodyType")} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="slim">{t("ai.slim")}</SelectItem>
                <SelectItem value="athletic">{t("ai.athletic")}</SelectItem>
                <SelectItem value="average">{t("ai.average")}</SelectItem>
                <SelectItem value="broad">{t("ai.broad")}</SelectItem>
                <SelectItem value="tall-slim">{t("ai.tallSlim")}</SelectItem>
                <SelectItem value="plus">{t("ai.plus")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium">{t("ai.occasion")}</Label>
            <Select value={occasion} onValueChange={setOccasion}>
              <SelectTrigger className="rounded-lg"><SelectValue placeholder={t("ai.occasionPlaceholder")} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="casual">{t("ai.casual")}</SelectItem>
                <SelectItem value="formal">{t("ai.formal")}</SelectItem>
                <SelectItem value="wedding">{t("ai.wedding")}</SelectItem>
                <SelectItem value="party">{t("ai.party")}</SelectItem>
                <SelectItem value="date">{t("ai.dateNight")}</SelectItem>
                <SelectItem value="interview">{t("ai.interview")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium">{t("ai.budget")}</Label>
            <Select value={budget} onValueChange={setBudget}>
              <SelectTrigger className="rounded-lg"><SelectValue placeholder={t("ai.selectBudget")} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="under-2000">৳২,০০০ এর নিচে</SelectItem>
                <SelectItem value="2000-5000">৳২,০০০ – ৳৫,০০০</SelectItem>
                <SelectItem value="5000-10000">৳৫,০০০ – ৳১০,০০০</SelectItem>
                <SelectItem value="10000-plus">৳১০,০০০+</SelectItem>
                <SelectItem value="flexible">{t("ai.flexible")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium">{t("ai.preferences")}</Label>
            <Input placeholder={t("ai.prefPlaceholder")} value={preferences} onChange={e => setPreferences(e.target.value)} className="rounded-lg" />
          </div>
        </div>
        <Button onClick={getRecommendations} disabled={loading} className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
          {loading ? t("ai.generating") : t("ai.getRecommendations")}
        </Button>
      </div>

      {result && (
        <div ref={resultRef} className="bg-card border border-border rounded-xl p-6 prose prose-sm dark:prose-invert max-w-none">
          <div className="flex items-center gap-2 mb-4"><Sparkles className="h-4 w-4 text-accent" /><span className="font-semibold text-sm text-accent">{t("ai.recommendations")}</span></div>
          <div className="whitespace-pre-wrap text-sm leading-relaxed">{result}</div>
        </div>
      )}
    </div>
  );
}

// ---- Main Dashboard ----
const Dashboard = () => {
  const { t } = useLanguage();
  const [tab, setTab] = useState("overview");
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [savedDesigns, setSavedDesigns] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const sessionId = getSessionId();

  // Design form
  const [designForm, setDesignForm] = useState({ name: "", fabric: "", color: "", style: "", notes: "" });
  const [savingDesign, setSavingDesign] = useState(false);

  // Appointment form
  const [apptForm, setApptForm] = useState({ name: "", email: "", phone: "", appointment_type: "consultation", preferred_date: "", preferred_time: "", notes: "" });
  const [savingAppt, setSavingAppt] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchSavedDesigns();
    fetchAppointments();
  }, []);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    const { data: session } = await supabase.auth.getSession();
    if (session?.session?.user) {
      const { data } = await supabase.from("orders").select("*, order_items(*)").eq("user_id", session.session.user.id).order("created_at", { ascending: false });
      if (data) {
        setOrders(data.map((o: any) => ({
          id: o.id, order_number: o.order_number || o.id.slice(0, 8), date: new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
          status: o.status, total: o.total,
          items: (o.order_items || []).map((i: any) => ({ name: i.product_name, qty: i.quantity, price: i.price, image: i.product_image || "", isDigital: i.is_digital })),
        })));
      }
    }
    setLoadingOrders(false);
  };

  const fetchSavedDesigns = async () => {
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;
    let query = supabase.from("saved_designs" as any).select("*").order("created_at", { ascending: false });
    if (userId) query = query.eq("user_id", userId);
    else query = query.eq("session_id", sessionId);
    const { data } = await query;
    if (data) setSavedDesigns(data as any[]);
  };

  const fetchAppointments = async () => {
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;
    let query = supabase.from("appointments" as any).select("*").order("created_at", { ascending: false });
    if (userId) query = query.eq("user_id", userId);
    else query = query.eq("session_id", sessionId);
    const { data } = await query;
    if (data) setAppointments(data as any[]);
  };

  const handleSaveDesign = async () => {
    if (!designForm.name) { toast({ title: t("dash.designName") }); return; }
    setSavingDesign(true);
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;
    const { error } = await supabase.from("saved_designs" as any).insert({
      name: designForm.name, fabric: designForm.fabric, color: designForm.color, style: designForm.style, notes: designForm.notes,
      user_id: userId || null, session_id: userId ? null : sessionId,
    } as any);
    if (error) toast({ title: "Error saving design", variant: "destructive" });
    else { toast({ title: t("dash.designSaved") }); setDesignForm({ name: "", fabric: "", color: "", style: "", notes: "" }); fetchSavedDesigns(); }
    setSavingDesign(false);
  };

  const handleDeleteDesign = async (id: string) => {
    await supabase.from("saved_designs" as any).delete().eq("id", id);
    fetchSavedDesigns();
    toast({ title: t("dash.designRemoved") });
  };

  const handleBookAppointment = async () => {
    if (!apptForm.name || !apptForm.preferred_date || !apptForm.preferred_time) { toast({ title: t("dash.fillRequired") }); return; }
    setSavingAppt(true);
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;
    const { error } = await supabase.from("appointments" as any).insert({
      ...apptForm, user_id: userId || null, session_id: userId ? null : sessionId,
    } as any);
    if (error) toast({ title: "Error booking appointment", variant: "destructive" });
    else { toast({ title: t("dash.appointmentBooked") }); setApptForm({ name: "", email: "", phone: "", appointment_type: "consultation", preferred_date: "", preferred_time: "", notes: "" }); fetchAppointments(); }
    setSavingAppt(false);
  };

  const totalSpent = orders.reduce((s, o) => s + o.total, 0);

  const sidebarItems = [
    { id: "overview", icon: User, label: t("dash.overview") },
    { id: "orders", icon: Package, label: t("dash.myOrders") },
    { id: "designs", icon: PenTool, label: t("dash.savedDesigns") },
    { id: "appointments", icon: CalendarDays, label: t("dash.appointments") },
    { id: "ai-stylist", icon: Sparkles, label: t("dash.aiStylist") },
    { id: "wishlist", icon: Heart, label: t("dash.wishlist") },
    { id: "profile", icon: Edit, label: t("dash.editProfile") },
    { id: "settings", icon: Settings, label: t("dash.settings") },
  ];

  return (
    <Layout>
      <div className="container px-4 py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-14 w-14 border-2 border-accent"><AvatarFallback className="bg-accent text-accent-foreground text-lg font-bold">SH</AvatarFallback></Avatar>
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold">{t("dash.welcome")}</h1>
            <p className="text-sm text-muted-foreground">{t("dash.subtitle")}</p>
          </div>
          <Button variant="outline" className="rounded-full text-xs hidden md:flex gap-1.5" asChild>
            <Link to="/track-order"><Truck className="h-3.5 w-3.5" /> {t("dash.trackOrder")}</Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <nav className="bg-card border border-border rounded-xl p-3 space-y-0.5 sticky top-32">
              {sidebarItems.map(item => (
                <button key={item.id} onClick={() => setTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${tab === item.id ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-secondary"}`}>
                  <item.icon className="h-4 w-4" /> {item.label}
                </button>
              ))}
              <Separator className="my-2" />
              <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors">
                <LogOut className="h-4 w-4" /> {t("dash.signOut")}
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="md:col-span-3">

            {/* ---- OVERVIEW ---- */}
            {tab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: t("dash.totalOrders"), value: String(orders.length), icon: Package },
                    { label: t("dash.totalSpent"), value: `৳${totalSpent.toLocaleString()}`, icon: CreditCard },
                    { label: t("dash.savedDesigns"), value: `${savedDesigns.length}`, icon: PenTool },
                    { label: t("dash.appointments"), value: `${appointments.length}`, icon: CalendarDays },
                  ].map(s => (
                    <div key={s.label} className="bg-card border border-border rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center"><s.icon className="h-4 w-4 text-accent" /></div></div>
                      <p className="text-xl font-bold">{s.value}</p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>

                {orders.length > 0 && (
                  <div className="bg-card border border-border rounded-xl">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                      <h3 className="font-semibold text-sm">{t("dash.recentOrders")}</h3>
                      <Button variant="ghost" size="sm" className="text-xs text-accent" onClick={() => setTab("orders")}>{t("dash.viewAll")}</Button>
                    </div>
                    <div className="divide-y divide-border">
                      {orders.slice(0, 3).map(order => (
                        <div key={order.id} className="flex items-center justify-between px-5 py-3">
                          <div><p className="text-sm font-medium">{order.order_number}</p><p className="text-xs text-muted-foreground">{order.date} · {order.items.length} items</p></div>
                          <div className="flex items-center gap-2">
                            <Badge className={statusColor[order.status] || "bg-secondary"} variant="outline">{order.status}</Badge>
                            <span className="text-sm font-bold">৳{order.total.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button onClick={() => setTab("ai-stylist")} className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-xl p-5 text-left hover:border-accent/40 transition-colors">
                    <Sparkles className="h-6 w-6 text-accent mb-2" />
                    <h3 className="font-semibold text-sm">{t("dash.aiStyleAdvisor")}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{t("dash.aiStyleDesc")}</p>
                  </button>
                  <button onClick={() => setTab("designs")} className="bg-card border border-border rounded-xl p-5 text-left hover:border-accent/40 transition-colors">
                    <PenTool className="h-6 w-6 text-accent mb-2" />
                    <h3 className="font-semibold text-sm">{t("dash.savedDesigns")}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{t("dash.savedDesignsDesc")}</p>
                  </button>
                  <button onClick={() => setTab("appointments")} className="bg-card border border-border rounded-xl p-5 text-left hover:border-accent/40 transition-colors">
                    <CalendarDays className="h-6 w-6 text-accent mb-2" />
                    <h3 className="font-semibold text-sm">{t("dash.bookAppointment")}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{t("dash.bookAppointmentDesc")}</p>
                  </button>
                </div>
              </div>
            )}

            {/* ---- ORDERS ---- */}
            {tab === "orders" && (
              <div className="space-y-4">
                <h2 className="font-bold text-lg">My Orders</h2>
                {loadingOrders ? (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm"><Loader2 className="h-4 w-4 animate-spin" /> Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div className="bg-card border border-border rounded-xl p-8 text-center">
                    <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">No orders yet.</p>
                    <Button asChild className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90 rounded-full"><Link to="/products">Start Shopping</Link></Button>
                  </div>
                ) : orders.map(order => (
                  <div key={order.id} className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3 bg-secondary/50 border-b border-border">
                      <div className="flex items-center gap-4">
                        <div><p className="text-xs text-muted-foreground">Order</p><p className="text-sm font-semibold">{order.order_number}</p></div>
                        <div className="hidden sm:block"><p className="text-xs text-muted-foreground">Date</p><p className="text-sm">{order.date}</p></div>
                      </div>
                      <Badge className={statusColor[order.status] || "bg-secondary"} variant="outline">{order.status}</Badge>
                    </div>
                    <div className="p-5 space-y-3">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-14 h-16 rounded-lg overflow-hidden bg-secondary shrink-0">
                            {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.qty} · ₹{item.price.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between px-5 py-3 border-t border-border">
                      <p className="text-sm font-bold">Total: <span className="text-accent">₹{order.total.toLocaleString()}</span></p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="text-xs gap-1" onClick={() => setInvoiceOrder(order)}><Receipt className="h-3 w-3" /> Invoice</Button>
                        <Button size="sm" variant="ghost" className="text-xs gap-1" asChild><Link to={`/track-order?id=${order.order_number}`}><Truck className="h-3 w-3" /> Track</Link></Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ---- SAVED DESIGNS ---- */}
            {tab === "designs" && (
              <div className="space-y-6">
                <h2 className="font-bold text-lg">Saved Designs</h2>
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <h3 className="font-semibold text-sm flex items-center gap-2"><PenTool className="h-4 w-4 text-accent" /> Save a New Design Idea</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label className="text-xs">Design Name *</Label><Input placeholder="e.g. Wedding Sherwani" value={designForm.name} onChange={e => setDesignForm(f => ({ ...f, name: e.target.value }))} /></div>
                    <div className="space-y-2"><Label className="text-xs">Fabric</Label><Input placeholder="e.g. Silk, Linen, Cotton" value={designForm.fabric} onChange={e => setDesignForm(f => ({ ...f, fabric: e.target.value }))} /></div>
                    <div className="space-y-2"><Label className="text-xs">Color Palette</Label><Input placeholder="e.g. Navy & Gold" value={designForm.color} onChange={e => setDesignForm(f => ({ ...f, color: e.target.value }))} /></div>
                    <div className="space-y-2"><Label className="text-xs">Style</Label><Input placeholder="e.g. Modern Ethnic" value={designForm.style} onChange={e => setDesignForm(f => ({ ...f, style: e.target.value }))} /></div>
                  </div>
                  <div className="space-y-2"><Label className="text-xs">Notes</Label><Textarea placeholder="Describe your vision..." value={designForm.notes} onChange={e => setDesignForm(f => ({ ...f, notes: e.target.value }))} rows={2} /></div>
                  <Button onClick={handleSaveDesign} disabled={savingDesign} className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full gap-2">
                    {savingDesign ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Design
                  </Button>
                </div>

                {savedDesigns.length === 0 ? (
                  <div className="bg-card border border-border rounded-xl p-8 text-center">
                    <Palette className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">No saved designs yet. Create your first design idea above!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {savedDesigns.map((d: any) => (
                      <div key={d.id} className="bg-card border border-border rounded-xl p-5">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-sm">{d.name}</h3>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteDesign(d.id)}><X className="h-3.5 w-3.5" /></Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {d.fabric && <Badge variant="outline" className="text-[10px]">🧵 {d.fabric}</Badge>}
                          {d.color && <Badge variant="outline" className="text-[10px]">🎨 {d.color}</Badge>}
                          {d.style && <Badge variant="outline" className="text-[10px]">✨ {d.style}</Badge>}
                        </div>
                        {d.notes && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{d.notes}</p>}
                        <p className="text-[10px] text-muted-foreground mt-3">{new Date(d.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ---- APPOINTMENTS ---- */}
            {tab === "appointments" && (
              <div className="space-y-6">
                <h2 className="font-bold text-lg">Appointments</h2>
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <h3 className="font-semibold text-sm flex items-center gap-2"><CalendarDays className="h-4 w-4 text-accent" /> Book a Consultation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label className="text-xs">Your Name *</Label><Input placeholder="Full name" value={apptForm.name} onChange={e => setApptForm(f => ({ ...f, name: e.target.value }))} /></div>
                    <div className="space-y-2"><Label className="text-xs">Email</Label><Input type="email" placeholder="email@example.com" value={apptForm.email} onChange={e => setApptForm(f => ({ ...f, email: e.target.value }))} /></div>
                    <div className="space-y-2"><Label className="text-xs">Phone</Label><Input placeholder="+91 ..." value={apptForm.phone} onChange={e => setApptForm(f => ({ ...f, phone: e.target.value }))} /></div>
                    <div className="space-y-2">
                      <Label className="text-xs">Type</Label>
                      <Select value={apptForm.appointment_type} onValueChange={v => setApptForm(f => ({ ...f, appointment_type: v }))}>
                        <SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="consultation">Style Consultation</SelectItem>
                          <SelectItem value="fitting">Custom Fitting</SelectItem>
                          <SelectItem value="alteration">Alteration</SelectItem>
                          <SelectItem value="design">Custom Design</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2"><Label className="text-xs">Preferred Date *</Label><Input type="date" value={apptForm.preferred_date} onChange={e => setApptForm(f => ({ ...f, preferred_date: e.target.value }))} /></div>
                    <div className="space-y-2"><Label className="text-xs">Preferred Time *</Label>
                      <Select value={apptForm.preferred_time} onValueChange={v => setApptForm(f => ({ ...f, preferred_time: v }))}>
                        <SelectTrigger className="rounded-lg"><SelectValue placeholder="Select time" /></SelectTrigger>
                        <SelectContent>
                          {["10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2"><Label className="text-xs">Notes</Label><Textarea placeholder="Anything specific you'd like to discuss..." value={apptForm.notes} onChange={e => setApptForm(f => ({ ...f, notes: e.target.value }))} rows={2} /></div>
                  <Button onClick={handleBookAppointment} disabled={savingAppt} className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full gap-2">
                    {savingAppt ? <Loader2 className="h-4 w-4 animate-spin" /> : <Calendar className="h-4 w-4" />} Book Appointment
                  </Button>
                </div>

                {appointments.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">Your Appointments</h3>
                    {appointments.map((a: any) => (
                      <div key={a.id} className="bg-card border border-border rounded-xl p-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center"><Clock className="h-5 w-5 text-accent" /></div>
                          <div>
                            <p className="font-medium text-sm capitalize">{a.appointment_type.replace("-", " ")}</p>
                            <p className="text-xs text-muted-foreground">{new Date(a.preferred_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} at {a.preferred_time}</p>
                          </div>
                        </div>
                        <Badge className={a.status === "confirmed" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : a.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"} variant="outline">{a.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ---- AI STYLIST ---- */}
            {tab === "ai-stylist" && <AIStyleRecommendations />}

            {/* ---- WISHLIST ---- */}
            {tab === "wishlist" && (
              <div className="bg-card border border-border rounded-xl p-8 text-center">
                <Heart className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Wishlist feature coming soon.</p>
                <Button asChild className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90 rounded-full"><Link to="/products">Browse Products</Link></Button>
              </div>
            )}

            {/* ---- EDIT PROFILE ---- */}
            {tab === "profile" && (
              <div className="space-y-6">
                <h2 className="font-bold text-lg">Edit Profile</h2>
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-4 mb-2">
                    <Avatar className="h-16 w-16 border-2 border-accent"><AvatarFallback className="bg-accent text-accent-foreground text-xl font-bold">SH</AvatarFallback></Avatar>
                    <Button variant="outline" className="rounded-full text-xs">Change Photo</Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label className="text-xs">First Name</Label><Input placeholder="First name" /></div>
                    <div className="space-y-2"><Label className="text-xs">Last Name</Label><Input placeholder="Last name" /></div>
                  </div>
                  <div className="space-y-2"><Label className="text-xs">Email Address</Label><Input type="email" placeholder="email@example.com" /></div>
                  <div className="space-y-2"><Label className="text-xs">Phone Number</Label><Input placeholder="+91 ..." /></div>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full gap-1" onClick={() => toast({ title: "Profile updated!" })}><Save className="h-4 w-4" /> Save Changes</Button>
                </div>
              </div>
            )}

            {/* ---- SETTINGS ---- */}
            {tab === "settings" && (
              <div className="space-y-6">
                <h2 className="font-bold text-lg">Account Settings</h2>
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <h3 className="font-semibold text-sm flex items-center gap-2"><Bell className="h-4 w-4 text-accent" /> Notifications</h3>
                  {[
                    { label: "Order status updates", desc: "Get notified when your order ships or is delivered" },
                    { label: "Promotions & deals", desc: "Receive exclusive offers and discounts" },
                    { label: "New arrivals", desc: "Be the first to know about new products" },
                  ].map(pref => (
                    <div key={pref.label} className="flex items-center justify-between py-1">
                      <div><span className="text-sm">{pref.label}</span><p className="text-[10px] text-muted-foreground">{pref.desc}</p></div>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </div>
                <Separator />
                <Button variant="destructive" className="rounded-full text-xs gap-1"><LogOut className="h-3.5 w-3.5" /> Delete Account</Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {invoiceOrder && <InvoiceModal order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />}
      <Footer />
    </Layout>
  );
};

export default Dashboard;
