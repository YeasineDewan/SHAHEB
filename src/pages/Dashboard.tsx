import { useState } from "react";
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
import {
  User, Package, Heart, Settings, LogOut, Download, CreditCard, MapPin,
  Bell, ShieldCheck, Eye, FileText, Truck, ChevronRight, Receipt,
  Mail, Phone, Calendar, X, Printer, Edit, Save
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import logoImg from "@/assets/logo.png";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  image: string;
  isDigital?: boolean;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
}

const recentOrders: Order[] = [
  { id: "ORD-2026-001", date: "Mar 5, 2026", status: "In Transit", total: 10997, items: [
    { name: "Classic Oxford Shirt", qty: 2, price: 2499, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=100&h=120&fit=crop" },
    { name: "Leather Jacket", qty: 1, price: 5999, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=120&fit=crop" },
  ]},
  { id: "ORD-2026-002", date: "Mar 1, 2026", status: "Delivered", total: 499, items: [
    { name: "Style Guide eBook", qty: 1, price: 499, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=100&h=120&fit=crop", isDigital: true },
  ]},
  { id: "ORD-2026-003", date: "Feb 20, 2026", status: "Delivered", total: 3499, items: [
    { name: "Premium Kurta Set", qty: 1, price: 3499, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=100&h=120&fit=crop" },
  ]},
];

const wishlistItems = [
  { id: "3", name: "Leather Jacket", price: 5999, originalPrice: 7999, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=250&fit=crop", rating: 4.8 },
  { id: "4", name: "Premium Kurta Set", price: 3499, originalPrice: 4999, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&h=250&fit=crop", rating: 4.6 },
  { id: "6", name: "Formal Blazer", price: 6999, originalPrice: 9999, image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=200&h=250&fit=crop", rating: 4.7 },
];

const downloads = [
  { name: "Style Guide eBook", date: "Mar 1, 2026", size: "2.4 MB", format: "PDF" },
  { name: "Grooming Guide PDF", date: "Feb 15, 2026", size: "1.8 MB", format: "PDF" },
];

const statusColor: Record<string, string> = {
  "In Transit": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Processing: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

// Invoice popup
function InvoiceModal({ order, onClose }: { order: typeof recentOrders[0]; onClose: () => void }) {
  const subtotal = order.items.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  return (
    <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-background rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <img src={logoImg} alt="SHAHEB" className="h-7 w-auto mb-2" />
              <p className="text-[10px] text-muted-foreground">Premium Men's Fashion</p>
              <p className="text-[10px] text-muted-foreground">Mumbai, Maharashtra, India</p>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-bold">INVOICE</h2>
              <p className="text-sm font-medium text-accent">INV-{order.id.replace("ORD-", "")}</p>
              <p className="text-xs text-muted-foreground mt-1">{order.date}</p>
            </div>
          </div>

          <div className="bg-secondary/50 rounded-xl p-4 mb-6">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Bill To</p>
            <p className="font-semibold text-sm">John Smith</p>
            <p className="text-xs text-muted-foreground">123 Main Street, Andheri West, Mumbai 400058</p>
          </div>

          <table className="w-full text-sm mb-6">
            <thead><tr className="border-b border-border">
              <th className="text-left py-2 font-medium text-xs">Item</th>
              <th className="text-center py-2 font-medium text-xs">Qty</th>
              <th className="text-right py-2 font-medium text-xs">Price</th>
              <th className="text-right py-2 font-medium text-xs">Total</th>
            </tr></thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="py-3 text-sm">{item.name}</td>
                  <td className="py-3 text-center">{item.qty}</td>
                  <td className="py-3 text-right">₹{item.price.toLocaleString()}</td>
                  <td className="py-3 text-right font-medium">₹{(item.price * item.qty).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">GST (18%)</span><span>₹{tax.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-green-600">Free</span></div>
            <Separator />
            <div className="flex justify-between font-bold text-base"><span>Total</span><span className="text-accent">₹{total.toLocaleString()}</span></div>
          </div>

          <div className="mt-6 pt-4 border-t border-border text-center">
            <p className="text-[10px] text-muted-foreground">Thank you for shopping with SHAHEB! · support@shaheb.com</p>
          </div>
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <Button className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 rounded-full gap-2" onClick={() => toast({ title: "Invoice downloaded!" })}>
            <Download className="h-4 w-4" /> Download PDF
          </Button>
          <Button variant="outline" className="rounded-full gap-2" onClick={() => toast({ title: "Printing..." })}>
            <Printer className="h-4 w-4" /> Print
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}

const Dashboard = () => {
  const [tab, setTab] = useState("overview");
  const [invoiceOrder, setInvoiceOrder] = useState<typeof recentOrders[0] | null>(null);

  const sidebarItems = [
    { id: "overview", icon: User, label: "Overview" },
    { id: "orders", icon: Package, label: "My Orders" },
    { id: "invoices", icon: Receipt, label: "Invoices" },
    { id: "downloads", icon: Download, label: "Downloads" },
    { id: "wishlist", icon: Heart, label: "Wishlist" },
    { id: "addresses", icon: MapPin, label: "Addresses" },
    { id: "payments", icon: CreditCard, label: "Payment Methods" },
    { id: "profile", icon: Edit, label: "Edit Profile" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <Layout>
      <div className="container px-4 py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-14 w-14 border-2 border-accent">
            <AvatarFallback className="bg-accent text-accent-foreground text-lg font-bold">JS</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold">Welcome back, John!</h1>
            <p className="text-sm text-muted-foreground">john@example.com · Member since Mar 2026</p>
          </div>
          <Button variant="outline" className="rounded-full text-xs hidden md:flex gap-1.5" asChild>
            <Link to="/track-order"><Truck className="h-3.5 w-3.5" /> Track Order</Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar nav */}
          <div className="md:col-span-1">
            <nav className="bg-card border border-border rounded-xl p-3 space-y-0.5 sticky top-32">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    tab === item.id ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <item.icon className="h-4 w-4" /> {item.label}
                </button>
              ))}
              <Separator className="my-2" />
              <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors">
                <LogOut className="h-4 w-4" /> Sign Out
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
                    { label: "Total Orders", value: "12", icon: Package },
                    { label: "Total Spent", value: "₹45,890", icon: CreditCard },
                    { label: "Wishlist", value: "5 items", icon: Heart },
                    { label: "Downloads", value: "3 files", icon: Download },
                  ].map(s => (
                    <div key={s.label} className="bg-card border border-border rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                          <s.icon className="h-4 w-4 text-accent" />
                        </div>
                      </div>
                      <p className="text-xl font-bold">{s.value}</p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-card border border-border rounded-xl">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                    <h3 className="font-semibold text-sm">Recent Orders</h3>
                    <Button variant="ghost" size="sm" className="text-xs text-accent" onClick={() => setTab("orders")}>View All</Button>
                  </div>
                  <div className="divide-y divide-border">
                    {recentOrders.map(order => (
                      <div key={order.id} className="flex items-center justify-between px-5 py-3">
                        <div>
                          <p className="text-sm font-medium">{order.id}</p>
                          <p className="text-xs text-muted-foreground">{order.date} · {order.items.length} items</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={statusColor[order.status] || ""} variant="outline">{order.status}</Badge>
                          <span className="text-sm font-bold">₹{order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ---- ORDERS ---- */}
            {tab === "orders" && (
              <div className="space-y-4">
                <h2 className="font-bold text-lg">My Orders</h2>
                {recentOrders.map(order => (
                  <div key={order.id} className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3 bg-secondary/50 border-b border-border">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Order</p>
                          <p className="text-sm font-semibold">{order.id}</p>
                        </div>
                        <div className="hidden sm:block">
                          <p className="text-xs text-muted-foreground">Date</p>
                          <p className="text-sm">{order.date}</p>
                        </div>
                      </div>
                      <Badge className={statusColor[order.status] || ""} variant="outline">{order.status}</Badge>
                    </div>
                    <div className="p-5 space-y-3">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-14 h-16 rounded-lg overflow-hidden bg-secondary shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.qty} · ₹{item.price.toLocaleString()}</p>
                          </div>
                          {"isDigital" in item && (
                            <Button size="sm" variant="outline" className="rounded-full text-xs gap-1">
                              <Download className="h-3 w-3" /> Download
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between px-5 py-3 border-t border-border">
                      <p className="text-sm font-bold">Total: <span className="text-accent">₹{order.total.toLocaleString()}</span></p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="text-xs gap-1" onClick={() => setInvoiceOrder(order)}>
                          <Receipt className="h-3 w-3" /> Invoice
                        </Button>
                        <Button size="sm" variant="ghost" className="text-xs gap-1" asChild>
                          <Link to={`/track-order?id=${order.id}`}><Truck className="h-3 w-3" /> Track</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ---- INVOICES ---- */}
            {tab === "invoices" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-lg">My Invoices</h2>
                  <Button variant="outline" className="rounded-full text-xs gap-1"><Download className="h-3.5 w-3.5" /> Download All</Button>
                </div>
                {recentOrders.map(order => {
                  const subtotal = order.items.reduce((s, i) => s + i.price * i.qty, 0);
                  const tax = Math.round(subtotal * 0.18);
                  return (
                    <div key={order.id} className="bg-card border border-border rounded-xl flex items-center justify-between px-5 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">INV-{order.id.replace("ORD-", "")}</p>
                          <p className="text-xs text-muted-foreground">{order.date} · Tax: ₹{tax.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-sm">₹{(subtotal + tax).toLocaleString()}</span>
                        <Button size="sm" variant="ghost" className="text-xs" onClick={() => setInvoiceOrder(order)}>
                          <Eye className="h-3 w-3 mr-1" /> View
                        </Button>
                        <Button size="sm" variant="ghost" className="text-xs" onClick={() => toast({ title: "Invoice downloaded!" })}>
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ---- DOWNLOADS ---- */}
            {tab === "downloads" && (
              <div className="space-y-4">
                <h2 className="font-bold text-lg">My Downloads</h2>
                {downloads.map((d, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{d.name}</p>
                        <p className="text-xs text-muted-foreground">{d.date} · {d.size} · {d.format}</p>
                      </div>
                    </div>
                    <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs gap-1">
                      <Download className="h-3 w-3" /> Download
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* ---- WISHLIST ---- */}
            {tab === "wishlist" && (
              <div>
                <h2 className="font-bold text-lg mb-4">Wishlist ({wishlistItems.length})</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {wishlistItems.map(item => (
                    <Link key={item.id} to={`/products/${item.id}`} className="group block">
                      <div className="aspect-[3/4] rounded-xl overflow-hidden bg-secondary mb-2 relative">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <Button size="icon" variant="secondary" className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.preventDefault(); toast({ title: "Removed from wishlist" }); }}>
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <h3 className="text-sm font-medium line-clamp-1">{item.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-accent font-bold text-sm">₹{item.price.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground line-through">₹{item.originalPrice.toLocaleString()}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* ---- ADDRESSES ---- */}
            {tab === "addresses" && (
              <div className="space-y-4">
                <h2 className="font-bold text-lg">Saved Addresses</h2>
                {[
                  { label: "Default", name: "John Smith", address: "123 Main Street, Andheri West", city: "Mumbai, Maharashtra 400058", phone: "+91 98765 43210" },
                  { label: "Office", name: "John Smith", address: "456 Business Park, BKC", city: "Mumbai, Maharashtra 400051", phone: "+91 98765 43210" },
                ].map((addr, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge className="mb-2 text-[10px]">{addr.label}</Badge>
                        <p className="font-medium text-sm">{addr.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{addr.address}<br/>{addr.city}<br/>Phone: {addr.phone}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="text-xs"><Edit className="h-3 w-3 mr-1" /> Edit</Button>
                        <Button variant="ghost" size="sm" className="text-xs text-destructive">Delete</Button>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="rounded-full">+ Add New Address</Button>
              </div>
            )}

            {/* ---- PAYMENT METHODS ---- */}
            {tab === "payments" && (
              <div className="space-y-4">
                <h2 className="font-bold text-lg">Payment Methods</h2>
                {[
                  { type: "Visa", last4: "4242", expiry: "12/2028", isDefault: true },
                  { type: "UPI", last4: "john@okaxis", expiry: "-", isDefault: false },
                ].map((card, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{card.type} {card.type !== "UPI" ? `ending in ${card.last4}` : card.last4}</p>
                        {card.expiry !== "-" && <p className="text-xs text-muted-foreground">Expires {card.expiry}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {card.isDefault && <Badge>Default</Badge>}
                      <Button variant="ghost" size="sm" className="text-xs">Remove</Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="rounded-full">+ Add Payment Method</Button>
              </div>
            )}

            {/* ---- EDIT PROFILE ---- */}
            {tab === "profile" && (
              <div className="space-y-6">
                <h2 className="font-bold text-lg">Edit Profile</h2>
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-4 mb-2">
                    <Avatar className="h-16 w-16 border-2 border-accent">
                      <AvatarFallback className="bg-accent text-accent-foreground text-xl font-bold">JS</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" className="rounded-full text-xs">Change Photo</Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label className="text-xs">First Name</Label><Input defaultValue="John" /></div>
                    <div className="space-y-2"><Label className="text-xs">Last Name</Label><Input defaultValue="Smith" /></div>
                  </div>
                  <div className="space-y-2"><Label className="text-xs">Email Address</Label><Input defaultValue="john@example.com" type="email" /></div>
                  <div className="space-y-2"><Label className="text-xs">Phone Number</Label><Input defaultValue="+91 98765 43210" /></div>
                  <div className="space-y-2"><Label className="text-xs">Date of Birth</Label><Input type="date" defaultValue="1995-06-15" /></div>
                  <div className="space-y-2"><Label className="text-xs">Bio</Label><Input defaultValue="Fashion enthusiast & digital nomad" /></div>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full gap-1" onClick={() => toast({ title: "Profile updated!" })}>
                    <Save className="h-4 w-4" /> Save Changes
                  </Button>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <h3 className="font-semibold text-sm">Change Password</h3>
                  <div className="space-y-2"><Label className="text-xs">Current Password</Label><Input type="password" /></div>
                  <div className="space-y-2"><Label className="text-xs">New Password</Label><Input type="password" /></div>
                  <div className="space-y-2"><Label className="text-xs">Confirm New Password</Label><Input type="password" /></div>
                  <Button variant="outline" className="rounded-full">Update Password</Button>
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
                    { label: "Price drop alerts", desc: "Get alerts when wishlist items go on sale" },
                    { label: "Newsletter", desc: "Weekly style tips and fashion updates" },
                  ].map(pref => (
                    <div key={pref.label} className="flex items-center justify-between py-1">
                      <div>
                        <span className="text-sm">{pref.label}</span>
                        <p className="text-[10px] text-muted-foreground">{pref.desc}</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </div>

                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <h3 className="font-semibold text-sm flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-accent" /> Privacy & Security</h3>
                  <div className="flex items-center justify-between"><span className="text-sm">Two-factor authentication</span><Switch /></div>
                  <div className="flex items-center justify-between"><span className="text-sm">Show order history publicly</span><Switch /></div>
                  <div className="flex items-center justify-between"><span className="text-sm">Allow marketing emails</span><Switch defaultChecked /></div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <h3 className="font-semibold text-sm flex items-center gap-2"><Mail className="h-4 w-4 text-accent" /> Communication Preferences</h3>
                  <div className="flex items-center justify-between"><span className="text-sm">Email notifications</span><Switch defaultChecked /></div>
                  <div className="flex items-center justify-between"><span className="text-sm">SMS notifications</span><Switch defaultChecked /></div>
                  <div className="flex items-center justify-between"><span className="text-sm">WhatsApp updates</span><Switch /></div>
                </div>

                <Separator />
                <div className="flex gap-3">
                  <Button variant="outline" className="rounded-full text-xs gap-1"><Download className="h-3.5 w-3.5" /> Download My Data</Button>
                  <Button variant="destructive" className="rounded-full text-xs gap-1"><LogOut className="h-3.5 w-3.5" /> Delete Account</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {invoiceOrder && <InvoiceModal order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />}

      <Footer />
    </Layout>
  );
};

export default Dashboard;
