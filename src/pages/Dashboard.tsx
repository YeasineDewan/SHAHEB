import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User, Package, Heart, Settings, LogOut, Download, CreditCard, MapPin,
  Bell, ShieldCheck, Eye, FileText, Truck, ChevronRight
} from "lucide-react";

const recentOrders = [
  { id: "ORD-2026-001", date: "Mar 5", status: "In Transit", total: 10997, items: 3 },
  { id: "ORD-2026-002", date: "Mar 1", status: "Delivered", total: 499, items: 1 },
  { id: "ORD-2026-003", date: "Feb 20", status: "Delivered", total: 3499, items: 1 },
];

const wishlistItems = [
  { id: "3", name: "Leather Jacket", price: 5999, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=250&fit=crop" },
  { id: "4", name: "Premium Kurta Set", price: 3499, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&h=250&fit=crop" },
];

const downloads = [
  { name: "Style Guide eBook", date: "Mar 1, 2026", size: "2.4 MB" },
];

const statusColor: Record<string, string> = {
  "In Transit": "bg-accent/10 text-accent border-accent/20",
  Delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Processing: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

const Dashboard = () => {
  const [tab, setTab] = useState("overview");

  return (
    <Layout>
      <div className="container px-4 py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-14 w-14 border-2 border-accent">
            <AvatarFallback className="bg-accent text-accent-foreground text-lg font-bold">JS</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Welcome back, John!</h1>
            <p className="text-sm text-muted-foreground">john@example.com · Member since Mar 2026</p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar nav */}
          <div className="md:col-span-1">
            <nav className="bg-card border border-border rounded-xl p-3 space-y-1 sticky top-32">
              {[
                { id: "overview", icon: User, label: "Overview" },
                { id: "orders", icon: Package, label: "My Orders" },
                { id: "downloads", icon: Download, label: "Downloads" },
                { id: "wishlist", icon: Heart, label: "Wishlist" },
                { id: "addresses", icon: MapPin, label: "Addresses" },
                { id: "payments", icon: CreditCard, label: "Payment Methods" },
                { id: "settings", icon: Settings, label: "Settings" },
              ].map((item) => (
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
            {tab === "overview" && (
              <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Total Orders", value: "12" },
                    { label: "Total Spent", value: "₹45,890" },
                    { label: "Wishlist", value: "5 items" },
                    { label: "Downloads", value: "3 files" },
                  ].map(s => (
                    <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold">{s.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Recent orders */}
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
                          <p className="text-xs text-muted-foreground">{order.date} · {order.items} items</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={statusColor[order.status] || ""} variant="outline">{order.status}</Badge>
                          <span className="text-sm font-bold">₹{order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === "orders" && (
              <div className="space-y-3">
                <h2 className="font-bold text-lg mb-4">My Orders</h2>
                {recentOrders.map(order => (
                  <div key={order.id} className="bg-card border border-border rounded-xl flex items-center justify-between px-5 py-4">
                    <div>
                      <p className="font-semibold text-sm">{order.id}</p>
                      <p className="text-xs text-muted-foreground">{order.date} · {order.items} items · ₹{order.total.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={statusColor[order.status] || ""} variant="outline">{order.status}</Badge>
                      <Button size="sm" variant="ghost" className="text-xs" asChild>
                        <Link to={`/track-order?id=${order.id}`}><Truck className="h-3 w-3 mr-1" /> Track</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "downloads" && (
              <div className="space-y-3">
                <h2 className="font-bold text-lg mb-4">My Downloads</h2>
                {downloads.map((d, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl flex items-center justify-between px-5 py-4">
                    <div>
                      <p className="font-medium text-sm">{d.name}</p>
                      <p className="text-xs text-muted-foreground">{d.date} · {d.size}</p>
                    </div>
                    <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs">
                      <Download className="h-3 w-3 mr-1" /> Download
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {tab === "wishlist" && (
              <div>
                <h2 className="font-bold text-lg mb-4">Wishlist</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {wishlistItems.map(item => (
                    <Link key={item.id} to={`/products/${item.id}`} className="group block">
                      <div className="aspect-[3/4] rounded-xl overflow-hidden bg-secondary mb-2">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <h3 className="text-sm font-medium">{item.name}</h3>
                      <p className="text-accent font-bold text-sm">₹{item.price.toLocaleString()}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {tab === "addresses" && (
              <div className="space-y-4">
                <h2 className="font-bold text-lg mb-4">Saved Addresses</h2>
                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge className="mb-2 text-[10px]">Default</Badge>
                      <p className="font-medium text-sm">John Smith</p>
                      <p className="text-xs text-muted-foreground mt-1">123 Main Street, Andheri West<br/>Mumbai, Maharashtra 400058<br/>Phone: +91 98765 43210</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs">Edit</Button>
                  </div>
                </div>
                <Button variant="outline" className="rounded-full">+ Add New Address</Button>
              </div>
            )}

            {tab === "payments" && (
              <div className="space-y-4">
                <h2 className="font-bold text-lg mb-4">Payment Methods</h2>
                <div className="bg-card border border-border rounded-xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">Visa ending in 4242</p>
                      <p className="text-xs text-muted-foreground">Expires 12/2028</p>
                    </div>
                  </div>
                  <Badge>Default</Badge>
                </div>
                <Button variant="outline" className="rounded-full">+ Add Payment Method</Button>
              </div>
            )}

            {tab === "settings" && (
              <div className="space-y-6">
                <h2 className="font-bold text-lg mb-4">Account Settings</h2>
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <h3 className="font-semibold text-sm">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label className="text-xs">First Name</Label><Input defaultValue="John" /></div>
                    <div className="space-y-2"><Label className="text-xs">Last Name</Label><Input defaultValue="Smith" /></div>
                  </div>
                  <div className="space-y-2"><Label className="text-xs">Email</Label><Input defaultValue="john@example.com" /></div>
                  <div className="space-y-2"><Label className="text-xs">Phone</Label><Input defaultValue="+91 98765 43210" /></div>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full">Save Changes</Button>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <h3 className="font-semibold text-sm">Change Password</h3>
                  <div className="space-y-2"><Label className="text-xs">Current Password</Label><Input type="password" /></div>
                  <div className="space-y-2"><Label className="text-xs">New Password</Label><Input type="password" /></div>
                  <div className="space-y-2"><Label className="text-xs">Confirm New Password</Label><Input type="password" /></div>
                  <Button variant="outline" className="rounded-full">Update Password</Button>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  <div className="space-y-3">
                    {["Order updates", "Promotions & deals", "New arrivals", "Price drop alerts"].map(pref => (
                      <label key={pref} className="flex items-center justify-between">
                        <span className="text-sm">{pref}</span>
                        <input type="checkbox" defaultChecked className="accent-accent h-4 w-4" />
                      </label>
                    ))}
                  </div>
                </div>

                <Button variant="destructive" className="rounded-full gap-2"><LogOut className="h-4 w-4" /> Delete Account</Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default Dashboard;
