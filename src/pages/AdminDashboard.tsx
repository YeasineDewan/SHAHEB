import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, BarChart3, MessageSquare, Settings,
  Plus, Search, Eye, Edit, Trash2, DollarSign, TrendingUp, UserCheck, FileText,
  Globe, Image, Megaphone, Receipt, Download, Mail, Bell, ShieldCheck, Palette,
  Type, Link2, Monitor, Smartphone, Save, Upload, X, Check, ChevronRight,
  Calendar, Clock, MapPin, CreditCard, Printer
} from "lucide-react";
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

const mockProducts = [
  { id: 1, name: "Classic Oxford Shirt", price: 2499, stock: 45, status: "Active", category: "Shirts", sku: "SHB-OXF-001" },
  { id: 2, name: "Leather Jacket", price: 5999, stock: 12, status: "Active", category: "Jackets", sku: "SHB-LJK-002" },
  { id: 3, name: "Premium Kurta Set", price: 3499, stock: 0, status: "Inactive", category: "Ethnic", sku: "SHB-KRT-003" },
  { id: 4, name: "Style Guide eBook", price: 499, stock: 999, status: "Active", category: "Digital", sku: "SHB-DIG-004" },
  { id: 5, name: "Slim Fit Chinos", price: 1999, stock: 67, status: "Active", category: "Trousers", sku: "SHB-CHN-005" },
];

const mockOrders = [
  { id: "ORD-001", customer: "Arjun Mehta", email: "arjun@email.com", total: 10997, status: "Shipped", date: "Mar 5, 2026", items: 3, payment: "Card" },
  { id: "ORD-002", customer: "Rahul Sharma", email: "rahul@email.com", total: 499, status: "Processing", date: "Mar 4, 2026", items: 1, payment: "UPI" },
  { id: "ORD-003", customer: "Vikram Singh", email: "vikram@email.com", total: 6999, status: "Delivered", date: "Mar 3, 2026", items: 1, payment: "Card" },
  { id: "ORD-004", customer: "Amit Patel", email: "amit@email.com", total: 3499, status: "Refunded", date: "Mar 2, 2026", items: 1, payment: "COD" },
  { id: "ORD-005", customer: "Suresh Nair", email: "suresh@email.com", total: 2499, status: "Delivered", date: "Mar 1, 2026", items: 2, payment: "UPI" },
];

const mockInvoices = [
  { id: "INV-2026-001", orderId: "ORD-001", customer: "Arjun Mehta", amount: 10997, tax: 1679, date: "Mar 5, 2026", status: "Paid" },
  { id: "INV-2026-002", orderId: "ORD-002", customer: "Rahul Sharma", amount: 499, tax: 76, date: "Mar 4, 2026", status: "Paid" },
  { id: "INV-2026-003", orderId: "ORD-003", customer: "Vikram Singh", amount: 6999, tax: 1069, date: "Mar 3, 2026", status: "Paid" },
  { id: "INV-2026-004", orderId: "ORD-004", customer: "Amit Patel", amount: 3499, tax: 534, date: "Mar 2, 2026", status: "Refunded" },
];

const mockUsers = [
  { id: 1, name: "Arjun Mehta", email: "arjun@email.com", phone: "+91 98765 43210", orders: 8, spent: 45890, status: "Active", joined: "Jan 15, 2026", lastLogin: "Mar 8, 2026" },
  { id: 2, name: "Rahul Sharma", email: "rahul@email.com", phone: "+91 91234 56780", orders: 3, spent: 12499, status: "Active", joined: "Feb 1, 2026", lastLogin: "Mar 7, 2026" },
  { id: 3, name: "Vikram Singh", email: "vikram@email.com", phone: "+91 87654 32100", orders: 1, spent: 6999, status: "Blocked", joined: "Feb 20, 2026", lastLogin: "Mar 3, 2026" },
  { id: 4, name: "Amit Patel", email: "amit@email.com", phone: "+91 76543 21090", orders: 5, spent: 22450, status: "Active", joined: "Dec 10, 2025", lastLogin: "Mar 6, 2026" },
];

const mockCoupons = [
  { code: "SHAHEB20", type: "Percentage", value: "20%", used: 134, limit: 500, expiry: "Apr 30, 2026", active: true },
  { code: "FLAT500", type: "Flat", value: "₹500", used: 89, limit: 200, expiry: "Mar 31, 2026", active: true },
  { code: "WELCOME10", type: "Percentage", value: "10%", used: 500, limit: 500, expiry: "Expired", active: false },
];

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
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg">Banner Management</h2>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs gap-1"><Plus className="h-3.5 w-3.5" /> Add Banner</Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {mockBanners.map(b => (
                  <div key={b.id} className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="aspect-[2/1] bg-secondary relative">
                      <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                      <Badge className="absolute top-3 right-3" variant={b.status === "Active" ? "default" : "secondary"}>{b.status}</Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm mb-1">{b.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3">Location: {b.location} · Link: {b.link}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="text-xs rounded-full"><Edit className="h-3 w-3 mr-1" /> Edit</Button>
                        <Button variant="ghost" size="sm" className="text-xs text-destructive"><Trash2 className="h-3 w-3 mr-1" /> Delete</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-sm mb-4">Add New Banner</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label className="text-xs">Banner Title</Label><Input placeholder="Summer Sale 2026" /></div>
                  <div className="space-y-2">
                    <Label className="text-xs">Location</Label>
                    <Select defaultValue="hero">
                      <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hero">Hero Slider</SelectItem>
                        <SelectItem value="promo">Promo Banner</SelectItem>
                        <SelectItem value="category">Category Banner</SelectItem>
                        <SelectItem value="sidebar">Sidebar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label className="text-xs">Link URL</Label><Input placeholder="/products?sale=true" /></div>
                  <div className="space-y-2"><Label className="text-xs">Image URL</Label><Input placeholder="https://..." /></div>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs gap-1"><Upload className="h-3.5 w-3.5" /> Upload & Save</Button>
                </div>
              </div>
            </div>
          )}

          {/* ======================== SEO ======================== */}
          {activeTab === "seo" && (
            <div className="space-y-6 max-w-3xl">
              <h2 className="font-bold text-lg">SEO Settings</h2>

              <Tabs defaultValue="general">
                <TabsList className="bg-transparent border-b rounded-none p-0 h-auto">
                  <TabsTrigger value="general" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-4 py-3 text-xs">General</TabsTrigger>
                  <TabsTrigger value="pages" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-4 py-3 text-xs">Page SEO</TabsTrigger>
                  <TabsTrigger value="social" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-4 py-3 text-xs">Social Media</TabsTrigger>
                  <TabsTrigger value="advanced" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-4 py-3 text-xs">Advanced</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="pt-6 space-y-4">
                  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <h3 className="font-semibold text-sm">Global Meta Tags</h3>
                    <div className="space-y-2"><Label className="text-xs">Site Title</Label><Input defaultValue="SHAHEB — Premium Men's Fashion & Digital Products" /><p className="text-[10px] text-muted-foreground">56/60 characters</p></div>
                    <div className="space-y-2"><Label className="text-xs">Meta Description</Label><Textarea defaultValue="Shop premium men's clothing, ethnic wear, jackets & digital style guides at SHAHEB. Free shipping on orders above ₹999. Genuine products guaranteed." className="h-20" /><p className="text-[10px] text-muted-foreground">148/160 characters</p></div>
                    <div className="space-y-2"><Label className="text-xs">Meta Keywords</Label><Input defaultValue="men's fashion, ethnic wear, kurta, shirts, jackets, style guide" /></div>
                    <div className="space-y-2"><Label className="text-xs">Canonical URL</Label><Input defaultValue="https://shaheb.com" /></div>
                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs gap-1"><Save className="h-3.5 w-3.5" /> Save SEO Settings</Button>
                  </div>
                </TabsContent>

                <TabsContent value="pages" className="pt-6 space-y-4">
                  {[
                    { page: "Home", title: "SHAHEB — Premium Men's Fashion", desc: "Shop premium men's clothing..." },
                    { page: "Products", title: "All Products — SHAHEB", desc: "Browse our collection..." },
                    { page: "About", title: "About Us — SHAHEB", desc: "Learn about our story..." },
                    { page: "Contact", title: "Contact Us — SHAHEB", desc: "Get in touch with us..." },
                  ].map(p => (
                    <div key={p.page} className="bg-card border border-border rounded-xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-sm">{p.page} Page</h3>
                        <Badge variant="outline" className="text-[10px]">/{p.page.toLowerCase()}</Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="space-y-1"><Label className="text-[10px]">Title</Label><Input defaultValue={p.title} className="h-9 text-xs" /></div>
                        <div className="space-y-1"><Label className="text-[10px]">Description</Label><Input defaultValue={p.desc} className="h-9 text-xs" /></div>
                      </div>
                    </div>
                  ))}
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs gap-1"><Save className="h-3.5 w-3.5" /> Save All</Button>
                </TabsContent>

                <TabsContent value="social" className="pt-6 space-y-4">
                  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <h3 className="font-semibold text-sm">Open Graph (Facebook/LinkedIn)</h3>
                    <div className="space-y-2"><Label className="text-xs">OG Title</Label><Input defaultValue="SHAHEB — Premium Men's Fashion" /></div>
                    <div className="space-y-2"><Label className="text-xs">OG Description</Label><Textarea defaultValue="Shop premium men's fashion at SHAHEB" className="h-16" /></div>
                    <div className="space-y-2"><Label className="text-xs">OG Image URL</Label><Input placeholder="https://shaheb.com/og-image.jpg" /></div>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <h3 className="font-semibold text-sm">Twitter Card</h3>
                    <div className="space-y-2"><Label className="text-xs">Twitter Handle</Label><Input defaultValue="@shaheb_fashion" /></div>
                    <div className="space-y-2">
                      <Label className="text-xs">Card Type</Label>
                      <Select defaultValue="summary_large_image">
                        <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="summary">Summary</SelectItem>
                          <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs gap-1"><Save className="h-3.5 w-3.5" /> Save Social</Button>
                </TabsContent>

                <TabsContent value="advanced" className="pt-6 space-y-4">
                  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <h3 className="font-semibold text-sm">Structured Data (JSON-LD)</h3>
                    <div className="flex items-center justify-between"><span className="text-sm">Organization Schema</span><Switch defaultChecked /></div>
                    <div className="flex items-center justify-between"><span className="text-sm">Product Schema</span><Switch defaultChecked /></div>
                    <div className="flex items-center justify-between"><span className="text-sm">Breadcrumb Schema</span><Switch defaultChecked /></div>
                    <div className="flex items-center justify-between"><span className="text-sm">FAQ Schema</span><Switch defaultChecked /></div>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <h3 className="font-semibold text-sm">Indexing</h3>
                    <div className="space-y-2"><Label className="text-xs">Robots.txt</Label><Textarea defaultValue={"User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /dashboard\nSitemap: https://shaheb.com/sitemap.xml"} className="font-mono text-xs h-24" /></div>
                    <div className="space-y-2"><Label className="text-xs">Google Verification Code</Label><Input placeholder="google-site-verification=..." /></div>
                  </div>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs gap-1"><Save className="h-3.5 w-3.5" /> Save Advanced</Button>
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
                      <div className="space-y-2"><Label className="text-xs">Logo URL</Label><Input defaultValue="/assets/logo.png" /></div>
                      <div className="space-y-2"><Label className="text-xs">Favicon URL</Label><Input defaultValue="/favicon.ico" /></div>
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
