import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import {
  LayoutDashboard, Package, ShoppingCart, Tag, Settings,
  Plus, Eye, Edit, Trash2, DollarSign,
  Globe, Image, Monitor, Save, Upload, X, Bell,
  Receipt, Download, ExternalLink, Video, MessageCircle
} from "lucide-react";
import { AdminChatbotPanel } from "@/components/admin/AdminChatbotPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import logoImg from "@/assets/logo.png";

type OrderWithItems = Tables<"orders"> & { order_items: Tables<"order_items">[] };

interface ProductFormData {
  name: string;
  category: string;
  price: string;
  originalPrice: string;
  stock: string;
  description: string;
  slug: string;
  sizes: string;
  colors: string;
  videoUrl: string;
  imageFiles: File[];
  imageUrls: string[]; // existing uploaded URLs
}

const createEmptyProductForm = (): ProductFormData => ({
  name: "", category: "", price: "", originalPrice: "", stock: "",
  description: "", slug: "", sizes: "", colors: "", videoUrl: "",
  imageFiles: [], imageUrls: [],
});

const emptyCoupon = { code: "", discount_type: "percentage", discount_value: "", min_order_amount: "", max_uses: "", expires_at: "" };

const sidebarItems = [
  { id: "overview", icon: LayoutDashboard, label: "Dashboard" },
  { id: "products", icon: Package, label: "Products" },
  { id: "orders", icon: ShoppingCart, label: "Orders" },
  { id: "coupons", icon: Tag, label: "Coupons" },
  { id: "chatbot", icon: MessageCircle, label: "AI Chatbot" },
  { id: "banners", icon: Image, label: "Banners" },
  { id: "seo", icon: Globe, label: "SEO" },
  { id: "website", icon: Monitor, label: "Website" },
  { id: "settings", icon: Settings, label: "Settings" },
];

const mockBanners = [
  { id: 1, title: "Summer Collection 2026", location: "Hero Slider", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop", status: "Active", link: "/products?category=shirts" },
  { id: 2, title: "Ethnic Wear Sale", location: "Promo Banner", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=200&fit=crop", status: "Active", link: "/category/ethnic" },
  { id: 3, title: "Digital Products", location: "Category Banner", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=200&fit=crop", status: "Draft", link: "/category/digital" },
];

const orderStatusColor: Record<string, string> = {
  processing: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  pending: "bg-muted text-muted-foreground",
};

// Invoice preview component
function InvoicePreview({ invoice, onClose }: { invoice: { id: string; orderId: string; customer: string; amount: number; tax: number; date: string; status: string }; onClose: () => void }) {
  const subtotal = invoice.amount - invoice.tax;
  return (
    <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-background rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <img src={logoImg} alt="SHAHEB" className="h-8 w-auto mb-2" />
              <p className="text-xs text-muted-foreground">Premium Men's Fashion</p>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-bold">INVOICE</h2>
              <p className="text-sm font-medium text-accent">{invoice.id}</p>
              <p className="text-xs text-muted-foreground mt-1">Date: {invoice.date}</p>
              <Badge variant="outline">{invoice.status}</Badge>
            </div>
          </div>
          <div className="bg-secondary/50 rounded-xl p-4 mb-6">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Bill To</p>
            <p className="font-semibold text-sm">{invoice.customer}</p>
            <p className="text-xs text-muted-foreground">Order: {invoice.orderId}</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">GST (18%)</span><span>₹{invoice.tax.toLocaleString()}</span></div>
            <Separator />
            <div className="flex justify-between font-bold text-base"><span>Total</span><span className="text-accent">₹{invoice.amount.toLocaleString()}</span></div>
          </div>
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <Button className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 rounded-full gap-2" onClick={() => toast({ title: "Invoice downloaded!" })}>
            <Download className="h-4 w-4" /> Download PDF
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}

// Image Upload Component
function ProductImageUploader({
  imageFiles, imageUrls, onFilesChange, onRemoveFile, onRemoveUrl
}: {
  imageFiles: File[];
  imageUrls: string[];
  onFilesChange: (files: File[]) => void;
  onRemoveFile: (idx: number) => void;
  onRemoveUrl: (idx: number) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const totalImages = imageUrls.length + imageFiles.length;

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const allowed = 5 - totalImages;
    if (allowed <= 0) { toast({ title: "Max 5 images", variant: "destructive" }); return; }
    const newFiles = Array.from(files).slice(0, allowed).filter(f => f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024);
    if (newFiles.length < files.length) toast({ title: "Some files skipped", description: "Max 5MB per image, images only." });
    onFilesChange([...imageFiles, ...newFiles]);
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs">Product Images (max 5)</Label>
      <div className="flex flex-wrap gap-3">
        {imageUrls.map((url, i) => (
          <div key={`url-${i}`} className="relative w-20 h-24 rounded-lg overflow-hidden border border-border group">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button onClick={() => onRemoveUrl(i)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        {imageFiles.map((file, i) => (
          <div key={`file-${i}`} className="relative w-20 h-24 rounded-lg overflow-hidden border border-border group">
            <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
            <button onClick={() => onRemoveFile(i)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        {totalImages < 5 && (
          <button
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add("border-accent"); }}
            onDragLeave={e => e.currentTarget.classList.remove("border-accent")}
            onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove("border-accent"); handleFiles(e.dataTransfer.files); }}
            className="w-20 h-24 rounded-lg border-2 border-dashed border-border hover:border-accent transition-colors flex flex-col items-center justify-center gap-1 text-muted-foreground"
          >
            <Upload className="h-4 w-4" />
            <span className="text-[10px]">Upload</span>
          </button>
        )}
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
      <p className="text-[10px] text-muted-foreground">{totalImages}/5 images · Drag & drop or click to upload · Max 5MB each</p>
    </div>
  );
}

// Upload images to storage and return URLs
async function uploadProductImages(files: File[]): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) { console.error("Upload error:", error); continue; }
    const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(path);
    urls.push(publicUrl);
  }
  return urls;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const navigate = useNavigate();

  const [products, setProducts] = useState<Tables<"products">[]>([]);
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [coupons, setCoupons] = useState<Tables<"coupons">[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Product form
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState<ProductFormData>(createEmptyProductForm());
  const [savingProduct, setSavingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Coupon form
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState(emptyCoupon);
  const [savingCoupon, setSavingCoupon] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: roleData } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
        if (roleData) setIsAdmin(true);
      }

      // Fetch data (products are public, orders/coupons need admin)
      const [prodRes, ordRes, coupRes] = await Promise.all([
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false }),
        supabase.from("coupons").select("*").order("created_at", { ascending: false }),
      ]);

      if (prodRes.data) setProducts(prodRes.data);
      if (ordRes.data) setOrders(ordRes.data as OrderWithItems[]);
      if (coupRes.data) setCoupons(coupRes.data);
      setLoading(false);
    };
    init();
  }, []);

  const handleDeleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    setProducts(prev => prev.filter(p => p.id !== id));
    toast({ title: "Product deleted" });
  };

  const handleToggleProduct = async (id: string, currentActive: boolean) => {
    const { error } = await supabase.from("products").update({ is_active: !currentActive }).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: !currentActive } : p));
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    toast({ title: `Order updated to ${status}` });
  };

  const handleToggleCoupon = async (id: string, currentActive: boolean) => {
    const { error } = await supabase.from("coupons").update({ is_active: !currentActive }).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, is_active: !currentActive } : c));
    toast({ title: currentActive ? "Coupon deactivated" : "Coupon activated" });
  };

  const handleDeleteCoupon = async (id: string) => {
    const { error } = await supabase.from("coupons").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    setCoupons(prev => prev.filter(c => c.id !== id));
    toast({ title: "Coupon deleted" });
  };

  const handleSaveProduct = async () => {
    if (!productForm.name.trim() || !productForm.category.trim() || !productForm.price || !productForm.slug.trim()) {
      toast({ title: "Missing fields", description: "Name, category, price and slug are required.", variant: "destructive" }); return;
    }
    setSavingProduct(true);

    // Upload new image files
    let uploadedUrls: string[] = [];
    if (productForm.imageFiles.length > 0) {
      uploadedUrls = await uploadProductImages(productForm.imageFiles);
    }
    const allImages = [...productForm.imageUrls, ...uploadedUrls];

    const productData = {
      name: productForm.name.trim(),
      category: productForm.category.trim(),
      price: parseInt(productForm.price),
      original_price: productForm.originalPrice ? parseInt(productForm.originalPrice) : null,
      stock: productForm.stock ? parseInt(productForm.stock) : 0,
      description: productForm.description.trim() || null,
      slug: productForm.slug.trim().toLowerCase().replace(/\s+/g, "-"),
      images: allImages,
      sizes: productForm.sizes ? productForm.sizes.split(",").map(s => s.trim()).filter(Boolean) : [],
      colors: productForm.colors ? productForm.colors.split(",").map(s => s.trim()).filter(Boolean) : [],
      video_url: productForm.videoUrl.trim() || null,
    };

    if (editingProductId) {
      // Update existing
      const { data, error } = await supabase.from("products").update(productData).eq("id", editingProductId).select().single();
      setSavingProduct(false);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      if (data) setProducts(prev => prev.map(p => p.id === editingProductId ? data : p));
      toast({ title: "Product updated!" });
    } else {
      // Create new
      const { data, error } = await supabase.from("products").insert(productData).select().single();
      setSavingProduct(false);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      if (data) setProducts(prev => [data, ...prev]);
      toast({ title: "Product created!" });
    }

    setProductForm(createEmptyProductForm());
    setShowProductForm(false);
    setEditingProductId(null);
  };

  const handleEditProduct = (p: Tables<"products">) => {
    setEditingProductId(p.id);
    setProductForm({
      name: p.name,
      category: p.category,
      price: p.price.toString(),
      originalPrice: p.original_price?.toString() || "",
      stock: (p.stock ?? 0).toString(),
      description: p.description || "",
      slug: p.slug,
      sizes: (p.sizes || []).join(", "),
      colors: (p.colors || []).join(", "),
      videoUrl: (p as any).video_url || "",
      imageFiles: [],
      imageUrls: p.images || [],
    });
    setShowProductForm(true);
  };

  const handleCreateCoupon = async () => {
    if (!couponForm.code.trim() || !couponForm.discount_value) {
      toast({ title: "Missing fields", description: "Code and discount value are required.", variant: "destructive" }); return;
    }
    setSavingCoupon(true);
    const { data, error } = await supabase.from("coupons").insert({
      code: couponForm.code.trim().toUpperCase(),
      discount_type: couponForm.discount_type,
      discount_value: parseInt(couponForm.discount_value),
      min_order_amount: couponForm.min_order_amount ? parseInt(couponForm.min_order_amount) : null,
      max_uses: couponForm.max_uses ? parseInt(couponForm.max_uses) : null,
      expires_at: couponForm.expires_at || null,
    }).select().single();
    setSavingCoupon(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    if (data) setCoupons(prev => [data, ...prev]);
    setCouponForm(emptyCoupon);
    setShowCouponForm(false);
    toast({ title: "Coupon created!" });
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 border-r border-border bg-card flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-5 border-b border-border">
          <Link to="/"><img src={logoImg} alt="SHAHEB" className="h-7 w-auto mb-0.5" /></Link>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {sidebarItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeTab === item.id ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-secondary"
              }`}>
              <item.icon className="h-4 w-4" /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <Button variant="ghost" className="w-full justify-start text-sm text-muted-foreground" asChild>
            <Link to="/">← Back to Store</Link>
          </Button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-background border-b border-border h-14 flex items-center px-4 gap-3">
        <Button variant="ghost" size="icon" onClick={() => setMobileSidebar(!mobileSidebar)}>
          {mobileSidebar ? <X className="h-5 w-5" /> : <LayoutDashboard className="h-5 w-5" />}
        </Button>
        <span className="font-semibold text-sm capitalize">{activeTab === "overview" ? "Dashboard" : activeTab}</span>
      </div>
      {mobileSidebar && (
        <div className="md:hidden fixed inset-0 z-30">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setMobileSidebar(false)} />
          <aside className="relative w-64 h-full bg-card border-r border-border overflow-y-auto">
            <div className="p-5 border-b border-border">
              <img src={logoImg} alt="SHAHEB" className="h-7 w-auto mb-0.5" />
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Admin Panel</p>
            </div>
            <nav className="p-3 space-y-0.5">
              {sidebarItems.map(item => (
                <button key={item.id} onClick={() => { setActiveTab(item.id); setMobileSidebar(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    activeTab === item.id ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-secondary"
                  }`}>
                  <item.icon className="h-4 w-4" /> {item.label}
                </button>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border h-14 hidden md:flex items-center justify-between px-6">
          <h2 className="font-semibold capitalize">{activeTab === "overview" ? "Dashboard" : activeTab}</h2>
          <div className="flex items-center gap-3">
            <Input placeholder="Search..." className="w-48 h-9 rounded-full text-xs" />
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </Button>
            <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">A</div>
          </div>
        </header>

        <div className="p-4 md:p-6 mt-14 md:mt-0">

          {/* ======================== OVERVIEW ======================== */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-green-600" },
                  { label: "Orders", value: orders.length.toString(), icon: ShoppingCart, color: "text-blue-600" },
                  { label: "Products", value: products.length.toString(), icon: Package, color: "text-accent" },
                  { label: "Coupons", value: coupons.length.toString(), icon: Tag, color: "text-purple-600" },
                ].map(stat => (
                  <div key={stat.label} className="bg-card border border-border rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-xl">
                  <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Recent Orders</h3>
                    <Button variant="ghost" size="sm" className="text-xs text-accent" onClick={() => setActiveTab("orders")}>View All</Button>
                  </div>
                  <div className="divide-y divide-border">
                    {orders.slice(0, 5).map(order => (
                      <div key={order.id} className="flex items-center justify-between px-5 py-3">
                        <div>
                          <p className="text-sm font-medium">{order.order_number || order.id.slice(0, 8)}</p>
                          <p className="text-xs text-muted-foreground">{order.shipping_name || "Customer"}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={orderStatusColor[order.status] || orderStatusColor.pending} variant="outline">
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                          <span className="text-sm font-bold">₹{order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && !loading && <p className="text-sm text-muted-foreground text-center py-6">No orders yet</p>}
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl">
                  <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Low Stock Products</h3>
                    <Button variant="ghost" size="sm" className="text-xs text-accent" onClick={() => setActiveTab("products")}>View All</Button>
                  </div>
                  <div className="divide-y divide-border">
                    {products.filter(p => (p.stock ?? 0) < 10).slice(0, 5).map(p => (
                      <div key={p.id} className="flex items-center justify-between px-5 py-3">
                        <div>
                          <p className="text-sm font-medium">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.category}</p>
                        </div>
                        <Badge variant={(p.stock ?? 0) === 0 ? "destructive" : "secondary"}>
                          {(p.stock ?? 0) === 0 ? "Out of stock" : `${p.stock} left`}
                        </Badge>
                      </div>
                    ))}
                    {products.filter(p => (p.stock ?? 0) < 10).length === 0 && !loading && (
                      <p className="text-sm text-muted-foreground text-center py-6">All products in stock</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================== PRODUCTS ======================== */}
          {activeTab === "products" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg">Products ({products.length})</h2>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs gap-1" onClick={() => {
                  setEditingProductId(null);
                  setProductForm(createEmptyProductForm());
                  setShowProductForm(!showProductForm);
                }}>
                  <Plus className="h-3.5 w-3.5" /> Add Product
                </Button>
              </div>

              {/* Product Form (Create / Edit) */}
              {showProductForm && (
                <div className="bg-card border border-border rounded-xl p-6 mb-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">{editingProductId ? "Edit Product" : "New Product"}</h3>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setShowProductForm(false); setEditingProductId(null); }}><X className="h-4 w-4" /></Button>
                  </div>

                  {/* Image Upload */}
                  <ProductImageUploader
                    imageFiles={productForm.imageFiles}
                    imageUrls={productForm.imageUrls}
                    onFilesChange={(files) => setProductForm(f => ({ ...f, imageFiles: files }))}
                    onRemoveFile={(idx) => setProductForm(f => ({ ...f, imageFiles: f.imageFiles.filter((_, i) => i !== idx) }))}
                    onRemoveUrl={(idx) => setProductForm(f => ({ ...f, imageUrls: f.imageUrls.filter((_, i) => i !== idx) }))}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Name *</Label>
                      <Input placeholder="Classic Oxford Shirt" value={productForm.name} onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Slug *</Label>
                      <Input placeholder="classic-oxford-shirt" value={productForm.slug} onChange={e => setProductForm(f => ({ ...f, slug: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Category *</Label>
                      <Input placeholder="shirts" value={productForm.category} onChange={e => setProductForm(f => ({ ...f, category: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Price (₹) *</Label>
                      <Input type="number" placeholder="2499" value={productForm.price} onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Original Price (₹)</Label>
                      <Input type="number" placeholder="3499" value={productForm.originalPrice} onChange={e => setProductForm(f => ({ ...f, originalPrice: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Stock</Label>
                      <Input type="number" placeholder="50" value={productForm.stock} onChange={e => setProductForm(f => ({ ...f, stock: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Sizes (comma separated)</Label>
                      <Input placeholder="S, M, L, XL" value={productForm.sizes} onChange={e => setProductForm(f => ({ ...f, sizes: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Colors (comma separated)</Label>
                      <Input placeholder="White, Blue, Black" value={productForm.colors} onChange={e => setProductForm(f => ({ ...f, colors: e.target.value }))} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-xs flex items-center gap-1"><Video className="h-3 w-3" /> Video URL (YouTube / Vimeo)</Label>
                      <Input placeholder="https://youtube.com/watch?v=..." value={productForm.videoUrl} onChange={e => setProductForm(f => ({ ...f, videoUrl: e.target.value }))} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-xs">Description</Label>
                      <Textarea placeholder="Product description..." value={productForm.description} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} className="h-20" />
                    </div>
                  </div>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs gap-1" onClick={handleSaveProduct} disabled={savingProduct}>
                    <Save className="h-3.5 w-3.5" /> {savingProduct ? "Saving..." : editingProductId ? "Update Product" : "Save Product"}
                  </Button>
                </div>
              )}

              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map(p => (
                      <TableRow key={p.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {p.images && p.images[0] ? (
                              <img src={p.images[0]} alt={p.name} className="w-10 h-12 rounded-lg object-cover" />
                            ) : (
                              <div className="w-10 h-12 rounded-lg bg-secondary flex items-center justify-center"><Package className="h-4 w-4 text-muted-foreground" /></div>
                            )}
                            <div>
                              <span className="font-medium text-sm">{p.name}</span>
                              {(p as any).video_url && <Video className="h-3 w-3 text-muted-foreground inline ml-1.5" />}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{p.category}</TableCell>
                        <TableCell>₹{p.price.toLocaleString()}</TableCell>
                        <TableCell>{(p.stock ?? 0) === 0 ? <span className="text-destructive font-medium">Out of stock</span> : p.stock}</TableCell>
                        <TableCell><Badge variant={p.is_active ? "default" : "secondary"}>{p.is_active ? "Active" : "Inactive"}</Badge></TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditProduct(p)}>
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggleProduct(p.id, !!p.is_active)}>
                              {p.is_active ? <Eye className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteProduct(p.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {products.length === 0 && !loading && (
                      <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No products found</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* ======================== ORDERS ======================== */}
          {activeTab === "orders" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg">Orders ({orders.length})</h2>
              </div>
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map(o => (
                      <TableRow key={o.id}>
                        <TableCell className="font-medium">{o.order_number || o.id.slice(0, 8)}</TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{o.shipping_name || "—"}</p>
                            <p className="text-[10px] text-muted-foreground">{o.shipping_phone || ""}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {new Date(o.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                        </TableCell>
                        <TableCell>{o.order_items.length}</TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px]">{o.payment_method || "—"}</Badge></TableCell>
                        <TableCell className="font-bold">₹{o.total.toLocaleString()}</TableCell>
                        <TableCell>
                          <Select value={o.status} onValueChange={(val) => handleUpdateOrderStatus(o.id, val)}>
                            <SelectTrigger className="h-7 w-28 text-xs rounded-full"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                            const tax = Math.round(o.total * 0.18 / 1.18);
                            setSelectedInvoice({
                              id: `INV-${(o.order_number || o.id.slice(0, 8))}`,
                              orderId: o.order_number || o.id.slice(0, 8),
                              customer: o.shipping_name || "Customer",
                              amount: o.total, tax,
                              date: new Date(o.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }),
                              status: o.payment_status === "paid" ? "Paid" : "Pending",
                            });
                          }}>
                            <Receipt className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {orders.length === 0 && !loading && (
                      <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No orders yet</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* ======================== COUPONS ======================== */}
          {activeTab === "coupons" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg">Coupons ({coupons.length})</h2>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs gap-1" onClick={() => setShowCouponForm(!showCouponForm)}>
                  <Plus className="h-3.5 w-3.5" /> Create Coupon
                </Button>
              </div>
              {showCouponForm && (
                <div className="bg-card border border-border rounded-xl p-6 mb-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">New Coupon</h3>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowCouponForm(false)}><X className="h-4 w-4" /></Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Code *</Label>
                      <Input placeholder="SUMMER20" value={couponForm.code} onChange={e => setCouponForm(f => ({ ...f, code: e.target.value }))} className="font-mono uppercase" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Discount Type</Label>
                      <Select value={couponForm.discount_type} onValueChange={val => setCouponForm(f => ({ ...f, discount_type: val }))}>
                        <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage (%)</SelectItem>
                          <SelectItem value="flat">Flat (₹)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Discount Value *</Label>
                      <Input type="number" placeholder={couponForm.discount_type === "percentage" ? "20" : "500"} value={couponForm.discount_value} onChange={e => setCouponForm(f => ({ ...f, discount_value: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Min Order Amount (₹)</Label>
                      <Input type="number" placeholder="999" value={couponForm.min_order_amount} onChange={e => setCouponForm(f => ({ ...f, min_order_amount: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Max Uses</Label>
                      <Input type="number" placeholder="500" value={couponForm.max_uses} onChange={e => setCouponForm(f => ({ ...f, max_uses: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Expiry Date</Label>
                      <Input type="datetime-local" value={couponForm.expires_at} onChange={e => setCouponForm(f => ({ ...f, expires_at: e.target.value }))} />
                    </div>
                  </div>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs gap-1" onClick={handleCreateCoupon} disabled={savingCoupon}>
                    <Save className="h-3.5 w-3.5" /> {savingCoupon ? "Saving..." : "Save Coupon"}
                  </Button>
                </div>
              )}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Min Order</TableHead>
                      <TableHead>Expiry</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coupons.map(c => (
                      <TableRow key={c.id}>
                        <TableCell className="font-mono font-bold">{c.code}</TableCell>
                        <TableCell className="text-muted-foreground capitalize">{c.discount_type}</TableCell>
                        <TableCell>{c.discount_type === "percentage" ? `${c.discount_value}%` : `₹${c.discount_value}`}</TableCell>
                        <TableCell>{c.used_count ?? 0}/{c.max_uses ?? "∞"}</TableCell>
                        <TableCell>{c.min_order_amount ? `₹${c.min_order_amount}` : "—"}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {c.expires_at ? new Date(c.expires_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "No expiry"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={c.is_active ? "default" : "secondary"} className="cursor-pointer" onClick={() => handleToggleCoupon(c.id, !!c.is_active)}>
                            {c.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteCoupon(c.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {coupons.length === 0 && !loading && (
                      <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No coupons yet</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* ======================== BANNERS ======================== */}
          {activeTab === "banners" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-lg">Banner Management</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Manage hero sliders, promo banners and category images</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {mockBanners.map(b => (
                  <div key={b.id} className="bg-card border border-border rounded-xl overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="aspect-[2/1] bg-secondary relative overflow-hidden">
                      <img src={b.image} alt={b.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                      <Badge className="absolute top-3 right-3" variant={b.status === "Active" ? "default" : "secondary"}>{b.status}</Badge>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="font-semibold text-sm text-background">{b.title}</h3>
                        <p className="text-[10px] text-background/70 mt-0.5">{b.location}</p>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <ExternalLink className="h-3 w-3" /><span className="truncate">{b.link}</span>
                      </div>
                      <Separator />
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 text-xs rounded-full gap-1"><Edit className="h-3 w-3" /> Edit</Button>
                        <Button variant="outline" size="sm" className="text-xs rounded-full gap-1 text-destructive hover:text-destructive"><Trash2 className="h-3 w-3" /> Delete</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================== SEO ======================== */}
          {activeTab === "seo" && (
            <div className="space-y-6 max-w-3xl">
              <h2 className="font-bold text-lg">SEO & Marketing</h2>
              <div className="bg-card border border-border rounded-xl p-6 space-y-5">
                <div className="space-y-2"><Label className="text-xs">Site Title</Label><Input defaultValue="SHAHEB — Premium Men's Fashion & Digital Products" /></div>
                <div className="space-y-2"><Label className="text-xs">Meta Description</Label><Textarea defaultValue="Shop premium men's clothing at SHAHEB." className="h-20" /></div>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs gap-1" onClick={() => toast({ title: "SEO settings saved!" })}><Save className="h-3.5 w-3.5" /> Save</Button>
              </div>
            </div>
          )}

          {/* ======================== WEBSITE ======================== */}
          {activeTab === "website" && (
            <div className="space-y-6 max-w-3xl">
              <h2 className="font-bold text-lg">Website Settings</h2>
              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label className="text-xs">Store Name</Label><Input defaultValue="SHAHEB" /></div>
                  <div className="space-y-2"><Label className="text-xs">Store Email</Label><Input defaultValue="support@shaheb.com" /></div>
                </div>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs gap-1" onClick={() => toast({ title: "Settings saved!" })}><Save className="h-3.5 w-3.5" /> Save</Button>
              </div>
            </div>
          )}

          {/* ======================== SETTINGS ======================== */}
          {activeTab === "settings" && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="font-bold text-lg">Store Settings</h2>
              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-sm">Shipping</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label className="text-xs">Free Shipping Threshold</Label><Input defaultValue="999" type="number" /></div>
                  <div className="space-y-2"><Label className="text-xs">Express Fee</Label><Input defaultValue="149" type="number" /></div>
                </div>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs gap-1"><Save className="h-3.5 w-3.5" /> Save</Button>
              </div>
            </div>
          )}

        </div>
      </div>

      {selectedInvoice && <InvoicePreview invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />}
    </div>
  );
};

export default AdminDashboard;
