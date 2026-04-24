import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Download, FileText, Eye, ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Tables } from "@/integrations/supabase/types";

type Order = Tables<"orders"> & { order_items: Tables<"order_items">[] };

const statusColor: Record<string, string> = {
  delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  processing: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  pending: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};

const Orders = () => {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  const getStatusLabel = (status: string) => {
    const statusMap = {
      pending: t("orders.status.pending"),
      processing: t("orders.status.processing"),
      shipped: t("orders.status.shipped"),
      delivered: t("orders.status.delivered"),
      cancelled: t("orders.status.cancelled"),
    };

    return statusMap[status as keyof typeof statusMap] || status;
  };

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }
      setUser(user);

      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) setOrders(data as Order[]);
      setLoading(false);
    };
    init();
  }, [navigate]);

  return (
    <Layout>
      <div className="container px-4 py-8 md:py-12 max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">{t("orders.title")}</h1>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="bg-card border border-border rounded-xl p-5 space-y-3">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-5 w-1/4" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h2 className="text-xl font-bold mb-2">{t("orders.empty")}</h2>
            <p className="text-muted-foreground mb-6">{t("orders.emptyDesc")}</p>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full" asChild>
              <Link to="/products">{t("general.browseProducts")}</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 bg-secondary/50 border-b border-border">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">{t("general.order")}</p>
                      <p className="text-sm font-semibold">{order.order_number || order.id.slice(0, 8)}</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-xs text-muted-foreground">{t("general.date")}</p>
                      <p className="text-sm">{new Date(order.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}</p>
                    </div>
                  </div>
                  <Badge className={statusColor[order.status] || statusColor.pending}>
                    {getStatusLabel(order.status)}
                  </Badge>
                </div>

                <div className="p-5 space-y-3">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-14 h-16 rounded-lg overflow-hidden bg-secondary shrink-0">
                        {item.product_image ? (
                          <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{item.product_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {t("general.qty")}: {item.quantity}
                          {item.size && ` · ${item.size}`}
                          {item.color && ` · ${item.color}`}
                          {" · "}৳{item.price.toLocaleString()}
                        </p>
                      </div>
                      {item.is_digital && (
                        <Button size="sm" variant="outline" className="rounded-full text-xs gap-1">
                          <Download className="h-3 w-3" /> {t("general.download")}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between px-5 py-3 border-t border-border">
                  <p className="text-sm font-bold">{t("general.total")}: <span className="text-accent">৳{order.total.toLocaleString()}</span></p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="text-xs gap-1" asChild>
                      <Link to="/track-order"><Eye className="h-3 w-3" /> {t("general.track")}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </Layout>
  );
};

export default Orders;
