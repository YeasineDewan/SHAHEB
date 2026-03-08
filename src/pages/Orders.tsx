import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Download, FileText, Eye } from "lucide-react";

const orders = [
  { id: "ORD-2026-001", date: "2026-03-05", status: "Delivered", total: 10997, items: [
    { name: "Classic Oxford Shirt", qty: 2, price: 2499, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=100&h=120&fit=crop" },
    { name: "Leather Jacket", qty: 1, price: 5999, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=120&fit=crop" },
  ]},
  { id: "ORD-2026-002", date: "2026-03-01", status: "Processing", total: 499, items: [
    { name: "Style Guide eBook", qty: 1, price: 499, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=100&h=120&fit=crop", isDigital: true },
  ]},
];

const statusColor: Record<string, string> = {
  Delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Processing: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

const Orders = () => {
  return (
    <Layout>
      <div className="container px-4 py-8 md:py-12 max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">My Orders</h1>

        <div className="space-y-4">
          {orders.map(order => (
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
                <Badge className={statusColor[order.status] || ""}>{order.status}</Badge>
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
                  <Button size="sm" variant="ghost" className="text-xs gap-1"><FileText className="h-3 w-3" /> Invoice</Button>
                  <Button size="sm" variant="ghost" className="text-xs gap-1"><Eye className="h-3 w-3" /> Track</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default Orders;
