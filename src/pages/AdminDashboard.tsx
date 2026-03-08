import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, BarChart3, MessageSquare, Settings,
  Plus, Search, Eye, Edit, Trash2, ChevronDown, DollarSign, TrendingUp, UserCheck, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";

const sidebarItems = [
  { id: "overview", icon: LayoutDashboard, label: "Dashboard" },
  { id: "products", icon: Package, label: "Products" },
  { id: "orders", icon: ShoppingCart, label: "Orders" },
  { id: "users", icon: Users, label: "Users" },
  { id: "coupons", icon: Tag, label: "Coupons" },
  { id: "analytics", icon: BarChart3, label: "Analytics" },
  { id: "support", icon: MessageSquare, label: "Support" },
  { id: "settings", icon: Settings, label: "Settings" },
];

const mockProducts = [
  { id: 1, name: "Classic Oxford Shirt", price: 2499, stock: 45, status: "Active", category: "Shirts" },
  { id: 2, name: "Leather Jacket", price: 5999, stock: 12, status: "Active", category: "Jackets" },
  { id: 3, name: "Premium Kurta Set", price: 3499, stock: 0, status: "Inactive", category: "Ethnic" },
  { id: 4, name: "Style Guide eBook", price: 499, stock: 999, status: "Active", category: "Digital" },
  { id: 5, name: "Slim Fit Chinos", price: 1999, stock: 67, status: "Active", category: "Trousers" },
];

const mockOrders = [
  { id: "ORD-001", customer: "Arjun Mehta", total: 10997, status: "Shipped", date: "Mar 5" },
  { id: "ORD-002", customer: "Rahul Sharma", total: 499, status: "Processing", date: "Mar 4" },
  { id: "ORD-003", customer: "Vikram Singh", total: 6999, status: "Delivered", date: "Mar 3" },
  { id: "ORD-004", customer: "Amit Patel", total: 3499, status: "Refunded", date: "Mar 2" },
];

const mockUsers = [
  { id: 1, name: "Arjun Mehta", email: "arjun@email.com", orders: 8, spent: 45890, status: "Active" },
  { id: 2, name: "Rahul Sharma", email: "rahul@email.com", orders: 3, spent: 12499, status: "Active" },
  { id: 3, name: "Vikram Singh", email: "vikram@email.com", orders: 1, spent: 6999, status: "Blocked" },
];

const mockCoupons = [
  { code: "SHAHEB20", type: "Percentage", value: "20%", used: 134, limit: 500, expiry: "Apr 30, 2026", active: true },
  { code: "FLAT500", type: "Flat", value: "₹500", used: 89, limit: 200, expiry: "Mar 31, 2026", active: true },
  { code: "WELCOME10", type: "Percentage", value: "10%", used: 500, limit: 500, expiry: "Expired", active: false },
];

const orderStatusColor: Record<string, string> = {
  Processing: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Refunded: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 border-r border-border bg-card flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-5 border-b border-border">
          <Link to="/" className="font-display text-lg font-bold tracking-[0.25em]">SHAHEB</Link>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Admin Panel</p>
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

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border h-14 flex items-center justify-between px-6">
          <h2 className="font-semibold capitalize">{activeTab === "overview" ? "Dashboard" : activeTab}</h2>
          <div className="flex items-center gap-3">
            <Input placeholder="Search..." className="w-48 h-9 rounded-full text-xs" />
            <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">A</div>
          </div>
        </header>

        <div className="p-6">
          {/* Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Revenue", value: "₹4,52,890", change: "+12.5%", icon: DollarSign },
                  { label: "Orders", value: "156", change: "+8.2%", icon: ShoppingCart },
                  { label: "Customers", value: "1,234", change: "+15.3%", icon: UserCheck },
                  { label: "Products", value: "48", change: "+3", icon: Package },
                ].map(stat => (
                  <div key={stat.label} className="bg-card border border-border rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <stat.icon className="h-5 w-5 text-muted-foreground" />
                      <span className="text-[10px] font-medium text-green-600">{stat.change}</span>
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
                    {mockOrders.slice(0, 4).map(order => (
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
                  <div className="px-5 py-3 border-b border-border">
                    <h3 className="font-semibold text-sm">Top Products</h3>
                  </div>
                  <div className="divide-y divide-border">
                    {mockProducts.slice(0, 4).map(p => (
                      <div key={p.id} className="flex items-center justify-between px-5 py-3">
                        <div>
                          <p className="text-sm font-medium">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.category}</p>
                        </div>
                        <span className="font-bold text-sm">₹{p.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products */}
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
                        <TableCell className="text-muted-foreground">{p.category}</TableCell>
                        <TableCell>₹{p.price.toLocaleString()}</TableCell>
                        <TableCell>{p.stock === 0 ? <span className="text-destructive">Out of stock</span> : p.stock}</TableCell>
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

          {/* Orders */}
          {activeTab === "orders" && (
            <div>
              <h2 className="font-bold text-lg mb-6">Orders</h2>
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockOrders.map(o => (
                      <TableRow key={o.id}>
                        <TableCell className="font-medium">{o.id}</TableCell>
                        <TableCell>{o.customer}</TableCell>
                        <TableCell className="text-muted-foreground">{o.date}</TableCell>
                        <TableCell>₹{o.total.toLocaleString()}</TableCell>
                        <TableCell><Badge className={orderStatusColor[o.status]} variant="outline">{o.status}</Badge></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="text-xs"><Eye className="h-3 w-3 mr-1" /> View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Users */}
          {activeTab === "users" && (
            <div>
              <h2 className="font-bold text-lg mb-6">Users ({mockUsers.length})</h2>
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsers.map(u => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell className="text-muted-foreground">{u.email}</TableCell>
                        <TableCell>{u.orders}</TableCell>
                        <TableCell>₹{u.spent.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={u.status === "Active" ? "default" : "destructive"}>{u.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="text-xs">
                            {u.status === "Active" ? "Block" : "Unblock"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Coupons */}
          {activeTab === "coupons" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg">Coupons</h2>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs gap-1">
                  <Plus className="h-3.5 w-3.5" /> Create Coupon
                </Button>
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

          {/* Analytics */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <h2 className="font-bold text-lg">Analytics & Reports</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { title: "Today's Revenue", value: "₹12,450", sub: "+18% from yesterday" },
                  { title: "Monthly Revenue", value: "₹4,52,890", sub: "Mar 2026" },
                  { title: "Tax Collected", value: "₹81,520", sub: "GST 18%" },
                ].map(s => (
                  <div key={s.title} className="bg-card border border-border rounded-xl p-5">
                    <p className="text-xs text-muted-foreground mb-1">{s.title}</p>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
                  </div>
                ))}
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-sm mb-4">Sales Overview</h3>
                <div className="h-48 flex items-end justify-between gap-2">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-accent/20 rounded-t-sm relative" style={{ height: `${h}%` }}>
                        <div className="absolute inset-x-0 bottom-0 bg-accent rounded-t-sm" style={{ height: `${h * 0.7}%` }} />
                      </div>
                      <span className="text-[9px] text-muted-foreground">{["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Support */}
          {activeTab === "support" && (
            <div>
              <h2 className="font-bold text-lg mb-6">Support Tickets</h2>
              <div className="space-y-3">
                {[
                  { id: "TKT-001", subject: "Order not received", customer: "Arjun Mehta", status: "Open", date: "Mar 7" },
                  { id: "TKT-002", subject: "Refund request", customer: "Amit Patel", status: "In Progress", date: "Mar 6" },
                  { id: "TKT-003", subject: "Size exchange", customer: "Rahul Sharma", status: "Resolved", date: "Mar 5" },
                ].map(t => (
                  <div key={t.id} className="bg-card border border-border rounded-xl flex items-center justify-between px-5 py-4">
                    <div>
                      <p className="font-medium text-sm">{t.subject}</p>
                      <p className="text-xs text-muted-foreground">{t.id} · {t.customer} · {t.date}</p>
                    </div>
                    <Badge variant={t.status === "Open" ? "destructive" : t.status === "Resolved" ? "default" : "secondary"}>{t.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="font-bold text-lg">Store Settings</h2>
              
              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-sm">Branding</h3>
                <div className="space-y-2"><label className="text-xs font-medium">Store Name</label><Input defaultValue="SHAHEB" /></div>
                <div className="space-y-2"><label className="text-xs font-medium">Footer Text</label><Input defaultValue="© 2026 SHAHEB. All rights reserved." /></div>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs">Save Branding</Button>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-sm">Tax Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><label className="text-xs font-medium">GST %</label><Input defaultValue="18" type="number" /></div>
                  <div className="space-y-2"><label className="text-xs font-medium">VAT %</label><Input defaultValue="0" type="number" /></div>
                </div>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs">Save Tax Settings</Button>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-sm">Payment Gateway</h3>
                <p className="text-xs text-muted-foreground">Configure your payment gateway API keys.</p>
                <div className="space-y-2"><label className="text-xs font-medium">Gateway</label>
                  <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                    <option>Stripe</option>
                    <option>Razorpay</option>
                    <option>PayPal</option>
                  </select>
                </div>
                <div className="space-y-2"><label className="text-xs font-medium">API Key</label><Input placeholder="pk_live_..." type="password" /></div>
                <div className="space-y-2"><label className="text-xs font-medium">Secret Key</label><Input placeholder="sk_live_..." type="password" /></div>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs">Save Payment Settings</Button>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-sm">Email Notifications</h3>
                {["Order confirmation", "Shipping update", "Failed payment alert", "New user welcome"].map(n => (
                  <label key={n} className="flex items-center justify-between">
                    <span className="text-sm">{n}</span>
                    <input type="checkbox" defaultChecked className="accent-accent h-4 w-4" />
                  </label>
                ))}
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs">Save Notifications</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
