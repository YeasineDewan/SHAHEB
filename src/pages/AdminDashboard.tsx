import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, BarChart3, MessageSquare, Settings,
  Plus, Search, Eye, Edit, Trash2, DollarSign, TrendingUp, UserCheck, FileText,
  Globe, Image, Megaphone, Receipt, Download, Mail, Bell, ShieldCheck, Palette,
  Type, Link2, Monitor, Smartphone, Save, Upload, X, Check, ChevronRight,
  Calendar, Clock, MapPin, CreditCard, Printer, GripVertical, ExternalLink, Copy
} from "lucide-react";
import { ImageDropZone } from "@/components/ui/image-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const sidebarItems = [
  { id: "overview", icon: LayoutDashboard, label: "Dashboard" },
  { id: "products", icon: Package, label: "Products" },
  { id: "orders", icon: ShoppingCart, label: "Orders" },
  { id: "invoices", icon: Receipt, label: "Invoices" },
  { id: "users", icon: Users, label: "Customers" },
  { id: "coupons", icon: Tag, label: "Coupons" },
  { id: "analytics", icon: BarChart3, label: "Analytics" },
  { id: "support", icon: MessageSquare, label: "Support" },
  { id: "banners", icon: Image, label: "Banners" },
  { id: "seo", icon: Globe, label: "SEO" },
  { id: "website", icon: Monitor, label: "Website" },
  { id: "settings", icon: Settings, label: "Settings" },
];

type OrderWithItems = Tables<"orders"> & { order_items: Tables<"order_items">[] };

const mockBanners = [
  { id: 1, title: "Summer Collection 2026", location: "Hero Slider", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop", status: "Active", link: "/products?category=shirts" },
  { id: 2, title: "Ethnic Wear Sale", location: "Promo Banner", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=200&fit=crop", status: "Active", link: "/category/ethnic" },
  { id: 3, title: "Digital Products", location: "Category Banner", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=200&fit=crop", status: "Draft", link: "/category/digital" },
];

const orderStatusColor: Record<string, string> = {
  Processing: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Refunded: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const invoiceStatusColor: Record<string, string> = {
  Paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Refunded: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

// Invoice preview component
function InvoicePreview({ invoice, onClose }: { invoice: typeof mockInvoices[0]; onClose: () => void }) {
  const subtotal = invoice.amount - invoice.tax;
  return (
    <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-background rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 md:p-8" id="invoice-content">
          {/* Invoice Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <img src={logoImg} alt="SHAHEB" className="h-8 w-auto mb-2" />
              <p className="text-xs text-muted-foreground">Premium Men's Fashion</p>
              <p className="text-xs text-muted-foreground">Mumbai, Maharashtra, India</p>
              <p className="text-xs text-muted-foreground">GSTIN: 27AABCS1234H1Z5</p>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-bold">INVOICE</h2>
              <p className="text-sm font-medium text-accent">{invoice.id}</p>
              <p className="text-xs text-muted-foreground mt-1">Date: {invoice.date}</p>
              <Badge className={invoiceStatusColor[invoice.status]} variant="outline">{invoice.status}</Badge>
            </div>
          </div>

          {/* Bill To */}
          <div className="bg-secondary/50 rounded-xl p-4 mb-6">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Bill To</p>
            <p className="font-semibold text-sm">{invoice.customer}</p>
            <p className="text-xs text-muted-foreground">Order: {invoice.orderId}</p>
          </div>

          {/* Items */}
          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 font-medium text-xs">Item</th>
                <th className="text-center py-2 font-medium text-xs">Qty</th>
                <th className="text-right py-2 font-medium text-xs">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="py-3">Order Items</td>
                <td className="py-3 text-center">-</td>
                <td className="py-3 text-right">₹{subtotal.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          {/* Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">GST (18%)</span><span>₹{invoice.tax.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-green-600">Free</span></div>
            <Separator />
            <div className="flex justify-between font-bold text-base"><span>Total</span><span className="text-accent">₹{invoice.amount.toLocaleString()}</span></div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-border text-center">
            <p className="text-[10px] text-muted-foreground">Thank you for shopping with SHAHEB!</p>
            <p className="text-[10px] text-muted-foreground">support@shaheb.com · +91 98765 43210</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 pt-0">
          <Button className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 rounded-full gap-2" onClick={() => { toast({ title: "Invoice downloaded!" }); }}>
            <Download className="h-4 w-4" /> Download PDF
          </Button>
          <Button variant="outline" className="rounded-full gap-2" onClick={() => { toast({ title: "Printing..." }); }}>
            <Printer className="h-4 w-4" /> Print
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}

// Customer profile modal
function CustomerProfile({ user, onClose }: { user: typeof mockUsers[0]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-background rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-lg">Customer Profile</h2>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}><X className="h-4 w-4" /></Button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-lg">
              {user.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge variant={user.status === "Active" ? "default" : "destructive"} className="mt-1">{user.status}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { label: "Orders", value: user.orders.toString() },
              { label: "Total Spent", value: `₹${user.spent.toLocaleString()}` },
              { label: "Joined", value: user.joined },
              { label: "Last Login", value: user.lastLogin },
            ].map(s => (
              <div key={s.label} className="bg-secondary/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="font-semibold text-sm">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-muted-foreground" />{user.email}</div>
            <div className="flex items-center gap-2 text-sm"><Smartphone className="h-4 w-4 text-muted-foreground" />{user.phone}</div>
          </div>

          <Separator className="my-5" />

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 rounded-full text-xs">Send Email</Button>
            <Button variant={user.status === "Active" ? "destructive" : "default"} className="flex-1 rounded-full text-xs">
              {user.status === "Active" ? "Block User" : "Unblock User"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedInvoice, setSelectedInvoice] = useState<typeof mockInvoices[0] | null>(null);
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 border-r border-border bg-card flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-5 border-b border-border">
          <Link to="/">
            <img src={logoImg} alt="SHAHEB" className="h-7 w-auto mb-0.5" />
          </Link>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeTab === item.id ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-secondary"
              }`}
            >
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

      {/* Mobile sidebar toggle */}
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
                  { label: "Revenue", value: "₹4,52,890", change: "+12.5%", icon: DollarSign, color: "text-green-600" },
                  { label: "Orders", value: "156", change: "+8.2%", icon: ShoppingCart, color: "text-blue-600" },
                  { label: "Customers", value: "1,234", change: "+15.3%", icon: UserCheck, color: "text-purple-600" },
                  { label: "Products", value: "48", change: "+3", icon: Package, color: "text-accent" },
                ].map(stat => (
                  <div key={stat.label} className="bg-card border border-border rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                      <span className="text-[10px] font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">{stat.change}</span>
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
                    {mockOrders.slice(0, 5).map(order => (
                      <div key={order.id} className="flex items-center justify-between px-5 py-3">
                        <div>
                          <p className="text-sm font-medium">{order.id}</p>
                          <p className="text-xs text-muted-foreground">{order.customer}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={orderStatusColor[order.status]} variant="outline">{order.status}</Badge>
                          <span className="text-sm font-bold">₹{order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl">
                  <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Recent Invoices</h3>
                    <Button variant="ghost" size="sm" className="text-xs text-accent" onClick={() => setActiveTab("invoices")}>View All</Button>
                  </div>
                  <div className="divide-y divide-border">
                    {mockInvoices.slice(0, 4).map(inv => (
                      <div key={inv.id} className="flex items-center justify-between px-5 py-3">
                        <div>
                          <p className="text-sm font-medium">{inv.id}</p>
                          <p className="text-xs text-muted-foreground">{inv.customer}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={invoiceStatusColor[inv.status]} variant="outline">{inv.status}</Badge>
                          <span className="text-sm font-bold">₹{inv.amount.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sales chart */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-sm mb-4">Monthly Sales</h3>
                <div className="h-48 flex items-end justify-between gap-2">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-accent/20 rounded-t-sm relative" style={{ height: `${h}%` }}>
                        <div className="absolute inset-x-0 bottom-0 bg-accent rounded-t-sm transition-all" style={{ height: `${h * 0.7}%` }} />
                      </div>
                      <span className="text-[9px] text-muted-foreground">{["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================== PRODUCTS ======================== */}
          {activeTab === "products" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg">Products ({mockProducts.length})</h2>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs gap-1">
                  <Plus className="h-3.5 w-3.5" /> Add Product
                </Button>
              </div>
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockProducts.map(p => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{p.sku}</TableCell>
                        <TableCell className="text-muted-foreground">{p.category}</TableCell>
                        <TableCell>₹{p.price.toLocaleString()}</TableCell>
                        <TableCell>{p.stock === 0 ? <span className="text-destructive font-medium">Out of stock</span> : p.stock}</TableCell>
                        <TableCell><Badge variant={p.status === "Active" ? "default" : "secondary"}>{p.status}</Badge></TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* ======================== ORDERS ======================== */}
          {activeTab === "orders" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg">Orders ({mockOrders.length})</h2>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-36 h-9 rounded-full text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
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
                    {mockOrders.map(o => (
                      <TableRow key={o.id}>
                        <TableCell className="font-medium">{o.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{o.customer}</p>
                            <p className="text-[10px] text-muted-foreground">{o.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">{o.date}</TableCell>
                        <TableCell>{o.items}</TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px]">{o.payment}</Badge></TableCell>
                        <TableCell className="font-bold">₹{o.total.toLocaleString()}</TableCell>
                        <TableCell><Badge className={orderStatusColor[o.status]} variant="outline">{o.status}</Badge></TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedInvoice(mockInvoices.find(i => i.orderId === o.id) || null)}>
                              <Receipt className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* ======================== INVOICES ======================== */}
          {activeTab === "invoices" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg">Invoices ({mockInvoices.length})</h2>
                <Button variant="outline" className="rounded-full text-xs gap-1"><Download className="h-3.5 w-3.5" /> Export All</Button>
              </div>
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Tax</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockInvoices.map(inv => (
                      <TableRow key={inv.id}>
                        <TableCell className="font-mono font-medium text-xs">{inv.id}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{inv.orderId}</TableCell>
                        <TableCell>{inv.customer}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">{inv.date}</TableCell>
                        <TableCell className="text-xs">₹{inv.tax.toLocaleString()}</TableCell>
                        <TableCell className="font-bold">₹{inv.amount.toLocaleString()}</TableCell>
                        <TableCell><Badge className={invoiceStatusColor[inv.status]} variant="outline">{inv.status}</Badge></TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedInvoice(inv)}>
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast({ title: `${inv.id} downloaded!` })}>
                              <Download className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* ======================== CUSTOMERS ======================== */}
          {activeTab === "users" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg">Customers ({mockUsers.length})</h2>
                <Input placeholder="Search customers..." className="w-64 h-9 rounded-full text-xs" />
              </div>
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsers.map(u => (
                      <TableRow key={u.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">
                              {u.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{u.name}</p>
                              <p className="text-[10px] text-muted-foreground">{u.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{u.phone}</TableCell>
                        <TableCell>{u.orders}</TableCell>
                        <TableCell className="font-medium">₹{u.spent.toLocaleString()}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{u.joined}</TableCell>
                        <TableCell><Badge variant={u.status === "Active" ? "default" : "destructive"}>{u.status}</Badge></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="text-xs" onClick={() => setSelectedUser(u)}>
                            <Eye className="h-3 w-3 mr-1" /> View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* ======================== COUPONS ======================== */}
          {activeTab === "coupons" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg">Coupons</h2>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs gap-1"><Plus className="h-3.5 w-3.5" /> Create Coupon</Button>
              </div>
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Expiry</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockCoupons.map(c => (
                      <TableRow key={c.code}>
                        <TableCell className="font-mono font-bold">{c.code}</TableCell>
                        <TableCell className="text-muted-foreground">{c.type}</TableCell>
                        <TableCell>{c.value}</TableCell>
                        <TableCell>{c.used}/{c.limit}</TableCell>
                        <TableCell className="text-muted-foreground">{c.expiry}</TableCell>
                        <TableCell><Badge variant={c.active ? "default" : "secondary"}>{c.active ? "Active" : "Expired"}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* ======================== ANALYTICS ======================== */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <h2 className="font-bold text-lg">Analytics & Reports</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: "Today's Revenue", value: "₹12,450", sub: "+18% from yesterday" },
                  { title: "Monthly Revenue", value: "₹4,52,890", sub: "Mar 2026" },
                  { title: "Tax Collected", value: "₹81,520", sub: "GST 18%" },
                  { title: "Avg Order Value", value: "₹2,903", sub: "+5.2% this month" },
                ].map(s => (
                  <div key={s.title} className="bg-card border border-border rounded-xl p-5">
                    <p className="text-xs text-muted-foreground mb-1">{s.title}</p>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
                  </div>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="font-semibold text-sm mb-4">Sales by Category</h3>
                  <div className="space-y-3">
                    {[
                      { cat: "Shirts", pct: 35, amt: "₹1,58,500" },
                      { cat: "Jackets", pct: 25, amt: "₹1,13,200" },
                      { cat: "Ethnic Wear", pct: 20, amt: "₹90,580" },
                      { cat: "Digital", pct: 12, amt: "₹54,350" },
                      { cat: "Trousers", pct: 8, amt: "₹36,260" },
                    ].map(c => (
                      <div key={c.cat}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>{c.cat}</span>
                          <span className="text-muted-foreground text-xs">{c.amt} ({c.pct}%)</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-accent rounded-full" style={{ width: `${c.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="font-semibold text-sm mb-4">Payment Methods</h3>
                  <div className="space-y-3">
                    {[
                      { method: "Credit/Debit Card", pct: 45, orders: 70 },
                      { method: "UPI", pct: 30, orders: 47 },
                      { method: "Net Banking", pct: 15, orders: 23 },
                      { method: "COD", pct: 10, orders: 16 },
                    ].map(p => (
                      <div key={p.method}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>{p.method}</span>
                          <span className="text-muted-foreground text-xs">{p.orders} orders ({p.pct}%)</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-accent rounded-full" style={{ width: `${p.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================== SUPPORT ======================== */}
          {activeTab === "support" && (
            <div>
              <h2 className="font-bold text-lg mb-6">Support Tickets</h2>
              <div className="space-y-3">
                {[
                  { id: "TKT-001", subject: "Order not received", customer: "Arjun Mehta", status: "Open", date: "Mar 7", priority: "High" },
                  { id: "TKT-002", subject: "Refund request", customer: "Amit Patel", status: "In Progress", date: "Mar 6", priority: "Medium" },
                  { id: "TKT-003", subject: "Size exchange", customer: "Rahul Sharma", status: "Resolved", date: "Mar 5", priority: "Low" },
                ].map(t => (
                  <div key={t.id} className="bg-card border border-border rounded-xl flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium text-sm">{t.subject}</p>
                        <p className="text-xs text-muted-foreground">{t.id} · {t.customer} · {t.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">{t.priority}</Badge>
                      <Badge variant={t.status === "Open" ? "destructive" : t.status === "Resolved" ? "default" : "secondary"}>{t.status}</Badge>
                    </div>
                  </div>
                ))}
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
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-[10px]">{mockBanners.length} banners</Badge>
                </div>
              </div>

              {/* Existing Banners Grid */}
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
                        <ExternalLink className="h-3 w-3" />
                        <span className="truncate">{b.link}</span>
                        <Button variant="ghost" size="icon" className="h-5 w-5 ml-auto shrink-0"><Copy className="h-2.5 w-2.5" /></Button>
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

              {/* Add New Banner Form */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="bg-secondary/50 px-6 py-4 border-b border-border flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <Plus className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Add New Banner</h3>
                    <p className="text-[10px] text-muted-foreground">Upload an image and configure banner placement</p>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Image Upload */}
                  <div>
                    <Label className="text-xs font-medium mb-2 block">Banner Image *</Label>
                    <ImageDropZone
                      aspectRatio="aspect-[2.5/1]"
                      placeholder="Drag & drop your banner image here, or click to browse"
                      maxSizeMB={5}
                    />
                    <p className="text-[10px] text-muted-foreground mt-1.5">Recommended: 1920×768px · PNG or JPG · Max 5MB</p>
                  </div>

                  {/* Form Fields */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Banner Title *</Label>
                      <Input placeholder="e.g. Summer Collection 2026" className="h-10" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Subtitle / Description</Label>
                      <Input placeholder="e.g. Up to 50% off on all shirts" className="h-10" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Placement Location *</Label>
                      <Select defaultValue="hero">
                        <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hero">Hero Slider (Homepage)</SelectItem>
                          <SelectItem value="promo">Promo Banner (Mid-page)</SelectItem>
                          <SelectItem value="category">Category Banner</SelectItem>
                          <SelectItem value="sidebar">Sidebar Widget</SelectItem>
                          <SelectItem value="popup">Popup / Modal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Link URL *</Label>
                      <Input placeholder="/products?sale=true" className="h-10" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">CTA Button Text</Label>
                      <Input placeholder="e.g. Shop Now" className="h-10" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Display Order</Label>
                      <Input type="number" placeholder="1" defaultValue="1" className="h-10" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Start Date</Label>
                      <Input type="date" className="h-10" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">End Date</Label>
                      <Input type="date" className="h-10" />
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="bg-secondary/30 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium">Active</span>
                        <p className="text-[10px] text-muted-foreground">Banner will be visible on the storefront</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium">Open in New Tab</span>
                        <p className="text-[10px] text-muted-foreground">Link opens in a new browser tab</p>
                      </div>
                      <Switch />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium">Mobile Visible</span>
                        <p className="text-[10px] text-muted-foreground">Show this banner on mobile devices</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs gap-2 px-6" onClick={() => toast({ title: "Banner saved!", description: "Your banner has been created and is now active." })}>
                      <Save className="h-3.5 w-3.5" /> Save Banner
                    </Button>
                    <Button variant="outline" className="rounded-full text-xs gap-2">
                      <Eye className="h-3.5 w-3.5" /> Preview
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================== SEO & MARKETING ======================== */}
          {activeTab === "seo" && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="font-bold text-lg">SEO & Marketing</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Optimize your store for search engines, social sharing, and marketing pixels</p>
              </div>

              <Tabs defaultValue="general">
                <TabsList className="bg-transparent border-b rounded-none p-0 h-auto flex-wrap">
                  <TabsTrigger value="general" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-4 py-3 text-xs">General</TabsTrigger>
                  <TabsTrigger value="pages" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-4 py-3 text-xs">Page SEO</TabsTrigger>
                  <TabsTrigger value="social" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-4 py-3 text-xs">Social / OG</TabsTrigger>
                  <TabsTrigger value="pixels" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-4 py-3 text-xs">Pixels & Analytics</TabsTrigger>
                  <TabsTrigger value="sitemap" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-4 py-3 text-xs">Sitemap & Indexing</TabsTrigger>
                  <TabsTrigger value="schema" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-4 py-3 text-xs">Schema / JSON-LD</TabsTrigger>
                </TabsList>

                {/* ---- GENERAL ---- */}
                <TabsContent value="general" className="pt-6 space-y-4">
                  <div className="bg-card border border-border rounded-xl p-6 space-y-5">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center"><Globe className="h-4 w-4 text-accent" /></div>
                      <div>
                        <h3 className="font-semibold text-sm">Global Meta Tags</h3>
                        <p className="text-[10px] text-muted-foreground">Default meta tags applied site-wide unless overridden per page</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Site Title</Label>
                      <Input defaultValue="SHAHEB — Premium Men's Fashion & Digital Products" />
                      <p className="text-[10px] text-muted-foreground">56/60 characters — <span className="text-green-600 dark:text-green-400">Good</span></p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Meta Description</Label>
                      <Textarea defaultValue="Shop premium men's clothing, ethnic wear, jackets & digital style guides at SHAHEB. Free shipping on orders above ₹999. Genuine products guaranteed." className="h-20" />
                      <p className="text-[10px] text-muted-foreground">148/160 characters — <span className="text-green-600 dark:text-green-400">Good</span></p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Meta Keywords</Label>
                      <Input defaultValue="men's fashion, ethnic wear, kurta, shirts, jackets, style guide" />
                      <p className="text-[10px] text-muted-foreground">Comma separated — used by some search engines</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label className="text-xs">Canonical URL</Label><Input defaultValue="https://shaheb.com" /></div>
                      <div className="space-y-2"><Label className="text-xs">Language / Locale</Label>
                        <Select defaultValue="en_IN">
                          <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en_IN">English (India)</SelectItem>
                            <SelectItem value="en_US">English (US)</SelectItem>
                            <SelectItem value="hi_IN">Hindi (India)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Google Search Preview */}
                  <div className="bg-card border border-border rounded-xl p-6 space-y-3">
                    <h3 className="font-semibold text-sm flex items-center gap-2"><Eye className="h-4 w-4 text-accent" /> Google Search Preview</h3>
                    <div className="bg-background border border-border rounded-lg p-4 space-y-1">
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium truncate">SHAHEB — Premium Men's Fashion & Digital Products</p>
                      <p className="text-[11px] text-green-700 dark:text-green-500">https://shaheb.com</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">Shop premium men's clothing, ethnic wear, jackets & digital style guides at SHAHEB. Free shipping on orders above ₹999. Genuine products guaranteed.</p>
                    </div>
                  </div>

                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs gap-1" onClick={() => toast({ title: "SEO settings saved!" })}><Save className="h-3.5 w-3.5" /> Save SEO Settings</Button>
                </TabsContent>

                {/* ---- PAGE SEO ---- */}
                <TabsContent value="pages" className="pt-6 space-y-4">
                  <p className="text-xs text-muted-foreground">Override meta tags for individual pages. Leave blank to use global defaults.</p>
                  {[
                    { page: "Home", path: "/", title: "SHAHEB — Premium Men's Fashion", desc: "Shop premium men's clothing, ethnic wear, jackets & digital style guides.", index: true },
                    { page: "Products", path: "/products", title: "All Products — SHAHEB", desc: "Browse our complete collection of shirts, trousers, jackets & more.", index: true },
                    { page: "About", path: "/about", title: "About Us — SHAHEB", desc: "Learn about our story, mission and commitment to quality.", index: true },
                    { page: "Contact", path: "/contact", title: "Contact Us — SHAHEB", desc: "Get in touch with our support team.", index: true },
                    { page: "FAQ", path: "/faq", title: "FAQ — SHAHEB", desc: "Frequently asked questions about orders, returns and more.", index: true },
                    { page: "Cart", path: "/cart", title: "Shopping Cart — SHAHEB", desc: "", index: false },
                    { page: "Checkout", path: "/checkout", title: "Checkout — SHAHEB", desc: "", index: false },
                  ].map(p => (
                    <div key={p.page} className="bg-card border border-border rounded-xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm">{p.page}</h3>
                          <Badge variant="outline" className="text-[10px] font-mono">{p.path}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground">Index</span>
                          <Switch defaultChecked={p.index} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1"><Label className="text-[10px]">Title Tag</Label><Input defaultValue={p.title} className="h-9 text-xs" /></div>
                        <div className="space-y-1"><Label className="text-[10px]">Meta Description</Label><Input defaultValue={p.desc} className="h-9 text-xs" /></div>
                      </div>
                    </div>
                  ))}
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs gap-1" onClick={() => toast({ title: "Page SEO saved!" })}><Save className="h-3.5 w-3.5" /> Save All Pages</Button>
                </TabsContent>

                {/* ---- SOCIAL / OG ---- */}
                <TabsContent value="social" className="pt-6 space-y-4">
                  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center"><Globe className="h-4 w-4 text-blue-500" /></div>
                      <div>
                        <h3 className="font-semibold text-sm">Open Graph (Facebook / LinkedIn / WhatsApp)</h3>
                        <p className="text-[10px] text-muted-foreground">Controls how your links appear when shared on social platforms</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label className="text-xs">OG Title</Label><Input defaultValue="SHAHEB — Premium Men's Fashion" /></div>
                      <div className="space-y-2"><Label className="text-xs">OG Type</Label>
                        <Select defaultValue="website">
                          <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="website">website</SelectItem>
                            <SelectItem value="product">product</SelectItem>
                            <SelectItem value="article">article</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2"><Label className="text-xs">OG Description</Label><Textarea defaultValue="Shop premium men's fashion at SHAHEB. Shirts, ethnic wear, jackets & digital products." className="h-16" /></div>
                    <div className="space-y-2">
                      <Label className="text-xs">OG Image (1200×630px recommended)</Label>
                      <ImageDropZone aspectRatio="aspect-video" placeholder="Drop OG image here" maxSizeMB={2} />
                    </div>
                    <div className="space-y-2"><Label className="text-xs">OG URL</Label><Input defaultValue="https://shaheb.com" /></div>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center"><Type className="h-4 w-4 text-sky-500" /></div>
                      <div>
                        <h3 className="font-semibold text-sm">Twitter / X Card</h3>
                        <p className="text-[10px] text-muted-foreground">Optimize how links appear on Twitter/X</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label className="text-xs">Twitter Handle</Label><Input defaultValue="@shaheb_fashion" /></div>
                      <div className="space-y-2">
                        <Label className="text-xs">Card Type</Label>
                        <Select defaultValue="summary_large_image">
                          <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="summary">Summary</SelectItem>
                            <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                            <SelectItem value="player">Player</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2"><Label className="text-xs">Twitter Title (override)</Label><Input placeholder="Leave blank to use OG Title" className="h-9 text-xs" /></div>
                    <div className="space-y-2"><Label className="text-xs">Twitter Description (override)</Label><Input placeholder="Leave blank to use OG Description" className="h-9 text-xs" /></div>
                  </div>

                  {/* Social Share Preview */}
                  <div className="bg-card border border-border rounded-xl p-6 space-y-3">
                    <h3 className="font-semibold text-sm flex items-center gap-2"><Eye className="h-4 w-4 text-accent" /> Social Share Preview</h3>
                    <div className="bg-secondary/50 rounded-lg overflow-hidden max-w-sm">
                      <div className="aspect-video bg-secondary flex items-center justify-center text-muted-foreground text-xs">
                        <Image className="h-8 w-8" />
                      </div>
                      <div className="p-3 space-y-1">
                        <p className="text-[10px] text-muted-foreground uppercase">shaheb.com</p>
                        <p className="text-sm font-semibold line-clamp-1">SHAHEB — Premium Men's Fashion</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">Shop premium men's fashion at SHAHEB. Shirts, ethnic wear, jackets & digital products.</p>
                      </div>
                    </div>
                  </div>

                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs gap-1" onClick={() => toast({ title: "Social settings saved!" })}><Save className="h-3.5 w-3.5" /> Save Social</Button>
                </TabsContent>

                {/* ---- PIXELS & ANALYTICS ---- */}
                <TabsContent value="pixels" className="pt-6 space-y-4">
                  {/* Facebook / Meta Pixel */}
                  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-600 font-bold text-xs">f</div>
                        <div>
                          <h3 className="font-semibold text-sm">Facebook / Meta Pixel</h3>
                          <p className="text-[10px] text-muted-foreground">Track conversions, optimize ads & build audiences</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="space-y-2"><Label className="text-xs">Pixel ID *</Label><Input placeholder="e.g. 123456789012345" className="font-mono" /><p className="text-[10px] text-muted-foreground">Find this in Meta Events Manager → Data Sources → Your Pixel</p></div>
                    <div className="space-y-2"><Label className="text-xs">Conversions API Access Token</Label><Input placeholder="EAAxxxxxxxxx..." type="password" /><p className="text-[10px] text-muted-foreground">Optional — enables server-side tracking for better accuracy</p></div>
                    <div className="bg-secondary/30 rounded-lg p-4 space-y-3">
                      <p className="text-xs font-medium">Events to Track</p>
                      {["PageView", "ViewContent", "AddToCart", "InitiateCheckout", "Purchase", "Search", "AddToWishlist", "CompleteRegistration"].map(evt => (
                        <div key={evt} className="flex items-center justify-between">
                          <span className="text-xs font-mono">{evt}</span>
                          <Switch defaultChecked />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm">Advanced Matching</span>
                        <p className="text-[10px] text-muted-foreground">Send hashed customer data for better attribution</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>

                  {/* Google Analytics 4 */}
                  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 font-bold text-xs">G</div>
                        <div>
                          <h3 className="font-semibold text-sm">Google Analytics 4</h3>
                          <p className="text-[10px] text-muted-foreground">Track traffic, conversions & user behavior</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="space-y-2"><Label className="text-xs">Measurement ID *</Label><Input placeholder="G-XXXXXXXXXX" className="font-mono" /><p className="text-[10px] text-muted-foreground">Found in GA4 → Admin → Data Streams → Web</p></div>
                    <div className="flex items-center justify-between">
                      <div><span className="text-sm">Enhanced Ecommerce</span><p className="text-[10px] text-muted-foreground">Track product views, add-to-cart & purchases</p></div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div><span className="text-sm">Enhanced Link Attribution</span><p className="text-[10px] text-muted-foreground">Differentiate clicks on same-URL links</p></div>
                      <Switch />
                    </div>
                  </div>

                  {/* Google Tag Manager */}
                  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold text-xs">GTM</div>
                        <div>
                          <h3 className="font-semibold text-sm">Google Tag Manager</h3>
                          <p className="text-[10px] text-muted-foreground">Manage all marketing tags from one container</p>
                        </div>
                      </div>
                      <Switch />
                    </div>
                    <Separator />
                    <div className="space-y-2"><Label className="text-xs">Container ID</Label><Input placeholder="GTM-XXXXXXX" className="font-mono" /></div>
                  </div>

                  {/* Google Ads */}
                  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 font-bold text-xs">Ads</div>
                        <div>
                          <h3 className="font-semibold text-sm">Google Ads Conversion</h3>
                          <p className="text-[10px] text-muted-foreground">Track Google Ads conversions & remarketing</p>
                        </div>
                      </div>
                      <Switch />
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label className="text-xs">Conversion ID</Label><Input placeholder="AW-XXXXXXXXX" className="font-mono" /></div>
                      <div className="space-y-2"><Label className="text-xs">Conversion Label</Label><Input placeholder="xxxxxxxxx" className="font-mono" /></div>
                    </div>
                  </div>

                  {/* TikTok Pixel */}
                  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center font-bold text-xs">TT</div>
                        <div>
                          <h3 className="font-semibold text-sm">TikTok Pixel</h3>
                          <p className="text-[10px] text-muted-foreground">Track conversions from TikTok ads</p>
                        </div>
                      </div>
                      <Switch />
                    </div>
                    <Separator />
                    <div className="space-y-2"><Label className="text-xs">Pixel ID</Label><Input placeholder="CXXXXXXXXXXXXXXXXX" className="font-mono" /></div>
                  </div>

                  {/* Snapchat */}
                  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-400/10 flex items-center justify-center text-yellow-500 font-bold text-xs">S</div>
                        <div>
                          <h3 className="font-semibold text-sm">Snapchat Pixel</h3>
                          <p className="text-[10px] text-muted-foreground">Measure Snap ad performance</p>
                        </div>
                      </div>
                      <Switch />
                    </div>
                    <Separator />
                    <div className="space-y-2"><Label className="text-xs">Pixel ID</Label><Input placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" className="font-mono" /></div>
                  </div>

                  {/* Pinterest */}
                  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 font-bold text-xs">P</div>
                        <div>
                          <h3 className="font-semibold text-sm">Pinterest Tag</h3>
                          <p className="text-[10px] text-muted-foreground">Track conversions from Pinterest</p>
                        </div>
                      </div>
                      <Switch />
                    </div>
                    <Separator />
                    <div className="space-y-2"><Label className="text-xs">Tag ID</Label><Input placeholder="1234567890123" className="font-mono" /></div>
                  </div>

                  {/* Custom Scripts */}
                  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center"><FileText className="h-4 w-4 text-accent" /></div>
                      <div>
                        <h3 className="font-semibold text-sm">Custom Scripts</h3>
                        <p className="text-[10px] text-muted-foreground">Add custom tracking code or third-party scripts</p>
                      </div>
                    </div>
                    <div className="space-y-2"><Label className="text-xs">Head Scripts (before &lt;/head&gt;)</Label><Textarea placeholder="<!-- Paste your scripts here -->" className="font-mono text-xs h-24" /></div>
                    <div className="space-y-2"><Label className="text-xs">Body Scripts (before &lt;/body&gt;)</Label><Textarea placeholder="<!-- Paste your scripts here -->" className="font-mono text-xs h-24" /></div>
                  </div>

                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs gap-1" onClick={() => toast({ title: "Pixels & analytics saved!" })}><Save className="h-3.5 w-3.5" /> Save Pixels & Analytics</Button>
                </TabsContent>

                {/* ---- SITEMAP & INDEXING ---- */}
                <TabsContent value="sitemap" className="pt-6 space-y-4">
                  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center"><Globe className="h-4 w-4 text-accent" /></div>
                      <div>
                        <h3 className="font-semibold text-sm">Robots.txt</h3>
                        <p className="text-[10px] text-muted-foreground">Control which pages search engines can crawl</p>
                      </div>
                    </div>
                    <Textarea defaultValue={"User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /dashboard\nDisallow: /cart\nDisallow: /checkout\nSitemap: https://shaheb.com/sitemap.xml"} className="font-mono text-xs h-32" />
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <h3 className="font-semibold text-sm">XML Sitemap</h3>
                    <div className="flex items-center justify-between">
                      <div><span className="text-sm">Auto-generate Sitemap</span><p className="text-[10px] text-muted-foreground">Automatically update when products/pages change</p></div>
                      <Switch defaultChecked />
                    </div>
                    <div className="space-y-2"><Label className="text-xs">Sitemap URL</Label><Input defaultValue="https://shaheb.com/sitemap.xml" readOnly className="bg-secondary/50 font-mono text-xs" /></div>
                    {["Include Product Pages", "Include Category Pages", "Include Blog / Articles"].map((item, i) => (
                      <div key={item} className="flex items-center justify-between">
                        <span className="text-sm">{item}</span>
                        <Switch defaultChecked={i < 2} />
                      </div>
                    ))}
                    <Button variant="outline" className="rounded-full text-xs gap-1"><Download className="h-3.5 w-3.5" /> Download Sitemap</Button>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <h3 className="font-semibold text-sm">Search Engine Verification</h3>
                    <div className="space-y-3">
                      <div className="space-y-2"><Label className="text-xs">Google Search Console</Label><Input placeholder="google-site-verification=..." className="font-mono text-xs" /><p className="text-[10px] text-muted-foreground">Search Console → Settings → Ownership → HTML tag</p></div>
                      <div className="space-y-2"><Label className="text-xs">Bing Webmaster Tools</Label><Input placeholder="msvalidate.01=..." className="font-mono text-xs" /></div>
                      <div className="space-y-2"><Label className="text-xs">Yandex Webmaster</Label><Input placeholder="yandex-verification=..." className="font-mono text-xs" /></div>
                      <div className="space-y-2"><Label className="text-xs">Pinterest Domain Claim</Label><Input placeholder="p:domain_verify content=..." className="font-mono text-xs" /></div>
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <h3 className="font-semibold text-sm">Crawl Settings</h3>
                    {[
                      { name: "Canonical Tags", desc: "Auto-add canonical URLs to prevent duplicate content", on: true },
                      { name: "Hreflang Tags", desc: "Multi-language support for international SEO", on: false },
                      { name: "Noindex Paginated Pages", desc: "Prevent /products?page=2 from being indexed", on: true },
                    ].map(s => (
                      <div key={s.name} className="flex items-center justify-between">
                        <div><span className="text-sm">{s.name}</span><p className="text-[10px] text-muted-foreground">{s.desc}</p></div>
                        <Switch defaultChecked={s.on} />
                      </div>
                    ))}
                  </div>

                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs gap-1" onClick={() => toast({ title: "Indexing settings saved!" })}><Save className="h-3.5 w-3.5" /> Save Indexing Settings</Button>
                </TabsContent>

                {/* ---- SCHEMA / JSON-LD ---- */}
                <TabsContent value="schema" className="pt-6 space-y-4">
                  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center"><FileText className="h-4 w-4 text-accent" /></div>
                      <div>
                        <h3 className="font-semibold text-sm">Structured Data (JSON-LD)</h3>
                        <p className="text-[10px] text-muted-foreground">Rich snippets help your pages stand out in search results</p>
                      </div>
                    </div>
                    {[
                      { name: "Organization Schema", desc: "Company name, logo, social profiles, contact info", on: true },
                      { name: "WebSite Schema", desc: "Enables sitelinks search box in Google", on: true },
                      { name: "Product Schema", desc: "Price, availability, reviews for product pages", on: true },
                      { name: "BreadcrumbList Schema", desc: "Breadcrumb navigation in search results", on: true },
                      { name: "FAQ Schema", desc: "FAQ rich snippets with expandable answers", on: true },
                      { name: "LocalBusiness Schema", desc: "Physical store address, hours, phone", on: false },
                      { name: "Review / AggregateRating", desc: "Star ratings visible in search results", on: true },
                      { name: "Offer / PriceRange", desc: "Price range for product listings", on: true },
                      { name: "Article Schema", desc: "For blog posts and articles", on: false },
                    ].map(s => (
                      <div key={s.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div><span className="text-sm font-medium">{s.name}</span><p className="text-[10px] text-muted-foreground">{s.desc}</p></div>
                        <Switch defaultChecked={s.on} />
                      </div>
                    ))}
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <h3 className="font-semibold text-sm">Organization Details (for schema)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label className="text-xs">Legal Name</Label><Input defaultValue="SHAHEB Fashion Pvt. Ltd." /></div>
                      <div className="space-y-2"><Label className="text-xs">Founded Year</Label><Input defaultValue="2024" type="number" /></div>
                    </div>
                    <div className="space-y-2"><Label className="text-xs">Logo URL</Label><Input defaultValue="https://shaheb.com/logo.png" className="font-mono text-xs" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label className="text-xs">Contact Email</Label><Input defaultValue="support@shaheb.com" /></div>
                      <div className="space-y-2"><Label className="text-xs">Contact Phone</Label><Input defaultValue="+91 98765 43210" /></div>
                    </div>
                    <div className="space-y-2"><Label className="text-xs">Address</Label><Input defaultValue="123 Fashion Street, Andheri West, Mumbai, MH 400058" /></div>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6 space-y-3">
                    <h3 className="font-semibold text-sm">JSON-LD Preview</h3>
                    <pre className="bg-secondary/50 rounded-lg p-4 text-[10px] font-mono text-muted-foreground overflow-x-auto">{`{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "SHAHEB",
  "url": "https://shaheb.com",
  "logo": "https://shaheb.com/logo.png",
  "sameAs": [
    "https://instagram.com/shaheb",
    "https://x.com/shaheb",
    "https://facebook.com/shaheb"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-98765-43210",
    "contactType": "customer service"
  }
}`}</pre>
                  </div>

                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs gap-1" onClick={() => toast({ title: "Schema settings saved!" })}><Save className="h-3.5 w-3.5" /> Save Schema</Button>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* ======================== WEBSITE SETTINGS ======================== */}
          {activeTab === "website" && (
            <div className="space-y-6 max-w-3xl">
              <h2 className="font-bold text-lg">Website Settings</h2>

              <Tabs defaultValue="general">
                <TabsList className="bg-transparent border-b rounded-none p-0 h-auto">
                  <TabsTrigger value="general" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-4 py-3 text-xs">General</TabsTrigger>
                  <TabsTrigger value="appearance" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-4 py-3 text-xs">Appearance</TabsTrigger>
                  <TabsTrigger value="homepage" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-4 py-3 text-xs">Homepage</TabsTrigger>
                  <TabsTrigger value="navigation" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-4 py-3 text-xs">Navigation</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="pt-6 space-y-4">
                  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <h3 className="font-semibold text-sm">Store Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label className="text-xs">Store Name</Label><Input defaultValue="SHAHEB" /></div>
                      <div className="space-y-2"><Label className="text-xs">Store Email</Label><Input defaultValue="support@shaheb.com" /></div>
                      <div className="space-y-2"><Label className="text-xs">Store Phone</Label><Input defaultValue="+91 98765 43210" /></div>
                      <div className="space-y-2"><Label className="text-xs">Currency</Label>
                        <Select defaultValue="inr">
                          <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="inr">INR (₹)</SelectItem>
                            <SelectItem value="usd">USD ($)</SelectItem>
                            <SelectItem value="eur">EUR (€)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2"><Label className="text-xs">Store Address</Label><Textarea defaultValue="123 Fashion Street, Andheri West, Mumbai, Maharashtra 400058" className="h-16" /></div>
                    <div className="space-y-2"><Label className="text-xs">GSTIN</Label><Input defaultValue="27AABCS1234H1Z5" /></div>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <h3 className="font-semibold text-sm">Social Links</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label className="text-xs">Instagram</Label><Input defaultValue="https://instagram.com/shaheb" /></div>
                      <div className="space-y-2"><Label className="text-xs">Twitter / X</Label><Input defaultValue="https://x.com/shaheb" /></div>
                      <div className="space-y-2"><Label className="text-xs">Facebook</Label><Input defaultValue="https://facebook.com/shaheb" /></div>
                      <div className="space-y-2"><Label className="text-xs">YouTube</Label><Input defaultValue="https://youtube.com/@shaheb" /></div>
                    </div>
                  </div>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs gap-1" onClick={() => toast({ title: "Settings saved!" })}><Save className="h-3.5 w-3.5" /> Save Changes</Button>
                </TabsContent>

                <TabsContent value="appearance" className="pt-6 space-y-4">
                  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <h3 className="font-semibold text-sm">Branding</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs">Logo</Label>
                        <ImageDropZone aspectRatio="aspect-[3/1]" placeholder="Drop your logo here" maxSizeMB={2} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Favicon</Label>
                        <ImageDropZone aspectRatio="aspect-square" placeholder="Drop favicon" maxSizeMB={1} />
                      </div>
                    </div>
                    <div className="space-y-2"><Label className="text-xs">Footer Copyright Text</Label><Input defaultValue="© 2026 SHAHEB. All rights reserved." /></div>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <h3 className="font-semibold text-sm">Theme & Colors</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2"><Label className="text-xs">Primary Color</Label><Input defaultValue="#1C1915" type="text" /></div>
                      <div className="space-y-2"><Label className="text-xs">Accent Color</Label><Input defaultValue="#D4A024" type="text" /></div>
                      <div className="space-y-2"><Label className="text-xs">Background</Label><Input defaultValue="#FAF9F7" type="text" /></div>
                    </div>
                    <div className="flex items-center justify-between"><span className="text-sm">Dark Mode Support</span><Switch defaultChecked /></div>
                    <div className="flex items-center justify-between"><span className="text-sm">Animations</span><Switch defaultChecked /></div>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <h3 className="font-semibold text-sm">Typography</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs">Display Font</Label>
                        <Select defaultValue="playfair">
                          <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="playfair">Playfair Display</SelectItem>
                            <SelectItem value="cormorant">Cormorant Garamond</SelectItem>
                            <SelectItem value="lora">Lora</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Body Font</Label>
                        <Select defaultValue="dm-sans">
                          <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dm-sans">DM Sans</SelectItem>
                            <SelectItem value="inter">Inter</SelectItem>
                            <SelectItem value="outfit">Outfit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs gap-1" onClick={() => toast({ title: "Appearance saved!" })}><Save className="h-3.5 w-3.5" /> Save Appearance</Button>
                </TabsContent>

                <TabsContent value="homepage" className="pt-6 space-y-4">
                  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <h3 className="font-semibold text-sm">Homepage Sections</h3>
                    <p className="text-xs text-muted-foreground">Toggle and reorder sections displayed on the homepage.</p>
                    {[
                      { name: "Hero Slider", enabled: true },
                      { name: "Trust Badges", enabled: true },
                      { name: "Categories Grid", enabled: true },
                      { name: "Featured Products", enabled: true },
                      { name: "Promo Banners", enabled: true },
                      { name: "Video Carousel", enabled: true },
                      { name: "Trending Section", enabled: true },
                      { name: "Brands Marquee", enabled: true },
                      { name: "Testimonials", enabled: true },
                      { name: "Newsletter", enabled: true },
                      { name: "FAQ Section", enabled: true },
                    ].map(s => (
                      <div key={s.name} className="flex items-center justify-between py-1.5">
                        <span className="text-sm">{s.name}</span>
                        <Switch defaultChecked={s.enabled} />
                      </div>
                    ))}
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <h3 className="font-semibold text-sm">Announcement Bar</h3>
                    <div className="space-y-2"><Label className="text-xs">Messages (one per line)</Label>
                      <Textarea defaultValue={"Free Shipping on Orders Above ₹999\n🔥 Summer Collection 2026 — Now Live!\nUse Code SHAHEB20 for 20% Off First Order"} className="h-24 font-mono text-xs" />
                    </div>
                    <div className="flex items-center justify-between"><span className="text-sm">Auto-rotate</span><Switch defaultChecked /></div>
                    <div className="space-y-2"><Label className="text-xs">Rotation Speed (ms)</Label><Input defaultValue="3500" type="number" /></div>
                  </div>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs gap-1" onClick={() => toast({ title: "Homepage saved!" })}><Save className="h-3.5 w-3.5" /> Save Homepage</Button>
                </TabsContent>

                <TabsContent value="navigation" className="pt-6 space-y-4">
                  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <h3 className="font-semibold text-sm">Header Navigation Links</h3>
                    {["Home → /", "Products → /products", "About → /about", "Contact → /contact", "FAQ → /faq"].map(link => (
                      <div key={link} className="flex items-center justify-between py-1 border-b border-border last:border-0">
                        <span className="text-sm font-mono">{link}</span>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="rounded-full text-xs gap-1"><Plus className="h-3 w-3" /> Add Link</Button>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <h3 className="font-semibold text-sm">Category Bar</h3>
                    {["Shirts → /category/shirts", "Trousers → /category/trousers", "Ethnic Wear → /category/ethnic", "Jackets & Blazers → /category/jackets", "Accessories → /category/accessories", "Digital Products → /category/digital"].map(link => (
                      <div key={link} className="flex items-center justify-between py-1 border-b border-border last:border-0">
                        <span className="text-sm font-mono">{link}</span>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="rounded-full text-xs gap-1"><Plus className="h-3 w-3" /> Add Category</Button>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <h3 className="font-semibold text-sm">Footer Links</h3>
                    <p className="text-xs text-muted-foreground">Manage footer navigation columns and links.</p>
                    {["Shop", "Help", "Contact"].map(col => (
                      <div key={col} className="border border-border rounded-lg p-3">
                        <p className="font-medium text-xs mb-2">{col}</p>
                        <Button variant="outline" size="sm" className="rounded-full text-[10px] gap-1"><Edit className="h-3 w-3" /> Edit Links</Button>
                      </div>
                    ))}
                  </div>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs gap-1" onClick={() => toast({ title: "Navigation saved!" })}><Save className="h-3.5 w-3.5" /> Save Navigation</Button>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* ======================== SETTINGS ======================== */}
          {activeTab === "settings" && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="font-bold text-lg">Store Settings</h2>

              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-sm">Tax Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label className="text-xs">GST %</Label><Input defaultValue="18" type="number" /></div>
                  <div className="space-y-2"><Label className="text-xs">VAT %</Label><Input defaultValue="0" type="number" /></div>
                </div>
                <div className="flex items-center justify-between"><span className="text-sm">Show tax in product prices</span><Switch defaultChecked /></div>
                <div className="flex items-center justify-between"><span className="text-sm">Show tax breakdown at checkout</span><Switch defaultChecked /></div>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs gap-1"><Save className="h-3.5 w-3.5" /> Save Tax</Button>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-sm">Shipping Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label className="text-xs">Free Shipping Threshold</Label><Input defaultValue="999" type="number" /></div>
                  <div className="space-y-2"><Label className="text-xs">Express Shipping Fee</Label><Input defaultValue="149" type="number" /></div>
                </div>
                <div className="space-y-2"><Label className="text-xs">Standard Delivery Days</Label><Input defaultValue="5-7" /></div>
                <div className="flex items-center justify-between"><span className="text-sm">Enable international shipping</span><Switch /></div>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs gap-1"><Save className="h-3.5 w-3.5" /> Save Shipping</Button>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-sm">Payment Gateway</h3>
                <div className="space-y-2">
                  <Label className="text-xs">Gateway Provider</Label>
                  <Select defaultValue="razorpay">
                    <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stripe">Stripe</SelectItem>
                      <SelectItem value="razorpay">Razorpay</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label className="text-xs">API Key</Label><Input placeholder="rzp_live_..." type="password" /></div>
                <div className="space-y-2"><Label className="text-xs">Secret Key</Label><Input placeholder="..." type="password" /></div>
                <div className="flex items-center justify-between"><span className="text-sm">Enable COD</span><Switch defaultChecked /></div>
                <div className="flex items-center justify-between"><span className="text-sm">Enable UPI</span><Switch defaultChecked /></div>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs gap-1"><Save className="h-3.5 w-3.5" /> Save Payment</Button>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-sm">Invoice Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label className="text-xs">Invoice Prefix</Label><Input defaultValue="INV-2026-" /></div>
                  <div className="space-y-2"><Label className="text-xs">Company GSTIN</Label><Input defaultValue="27AABCS1234H1Z5" /></div>
                </div>
                <div className="space-y-2"><Label className="text-xs">Invoice Footer Note</Label><Textarea defaultValue="Thank you for shopping with SHAHEB!" className="h-16" /></div>
                <div className="flex items-center justify-between"><span className="text-sm">Auto-generate invoices</span><Switch defaultChecked /></div>
                <div className="flex items-center justify-between"><span className="text-sm">Email invoice on order</span><Switch defaultChecked /></div>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs gap-1"><Save className="h-3.5 w-3.5" /> Save Invoice Settings</Button>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-sm">Email Notifications</h3>
                {["Order confirmation email", "Shipping update email", "Delivery confirmation", "Failed payment alert", "New user welcome email", "Invoice email", "Return/refund confirmation"].map(n => (
                  <div key={n} className="flex items-center justify-between">
                    <span className="text-sm">{n}</span>
                    <Switch defaultChecked />
                  </div>
                ))}
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs gap-1"><Save className="h-3.5 w-3.5" /> Save Notifications</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Preview Modal */}
      {selectedInvoice && <InvoicePreview invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />}

      {/* Customer Profile Modal */}
      {selectedUser && <CustomerProfile user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
  );
};

export default AdminDashboard;
