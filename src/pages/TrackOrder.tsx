import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin, CheckCircle2, Truck, CircleDot, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const TrackOrder = () => {
  const { t } = useLanguage();
  const [orderId, setOrderId] = useState("ORD-2026-001");
  const [tracked, setTracked] = useState(true);

  const trackingSteps = [
    { label: t("track.orderPlaced"), date: "Mar 5, 2026 · 10:30 AM", done: true, icon: Package },
    { label: t("track.paymentConfirmed"), date: "Mar 5, 2026 · 10:32 AM", done: true, icon: CheckCircle2 },
    { label: t("track.shipped"), date: "Mar 6, 2026 · 2:15 PM", done: true, icon: Truck },
    { label: t("track.outForDelivery"), date: "Mar 8, 2026 · 9:00 AM", done: true, icon: MapPin },
    { label: t("track.delivered"), date: `${t("track.expected")}: Mar 8, 2026`, done: false, icon: CircleDot },
  ];

  return (
    <Layout>
      <div className="container px-4 py-8 md:py-12 max-w-2xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{t("track.title")}</h1>
        <p className="text-muted-foreground text-sm mb-8">{t("track.desc")}</p>

        <div className="flex gap-2 mb-8">
          <Input
            placeholder={t("track.placeholder")}
            value={orderId}
            onChange={e => setOrderId(e.target.value)}
            className="rounded-full"
          />
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-6" onClick={() => setTracked(true)}>
            <Search className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">{t("track.button")}</span>
          </Button>
        </div>

        {tracked && (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-secondary/50 border-b border-border">
              <div>
                <p className="text-xs text-muted-foreground">{t("track.orderId")}</p>
                <p className="font-bold">ORD-2026-001</p>
              </div>
              <Badge className="bg-accent/10 text-accent border-accent/20">{t("track.inTransit")}</Badge>
            </div>

            <div className="px-6 py-4 border-b border-border">
              <div className="flex gap-3">
                {["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=80&h=100&fit=crop",
                  "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=80&h=100&fit=crop"].map((img, i) => (
                  <div key={i} className="w-14 h-16 rounded-lg overflow-hidden bg-secondary">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">2 {t("general.items")}</p>
                  <p className="text-xs text-muted-foreground">Classic Oxford Shirt × 2, Leather Jacket × 1</p>
                  <p className="text-sm font-bold text-accent mt-1">৳10,997</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-6">
              <div className="space-y-0">
                {trackingSteps.map((step, i) => {
                  const Icon = step.icon;
                  const isLast = i === trackingSteps.length - 1;
                  return (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          step.done ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"
                        }`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        {!isLast && (
                          <div className={`w-0.5 h-10 ${step.done ? "bg-accent" : "bg-border"}`} />
                        )}
                      </div>
                      <div className={`pb-8 ${isLast ? "pb-0" : ""}`}>
                        <p className={`font-medium text-sm ${step.done ? "" : "text-muted-foreground"}`}>{step.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{step.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border bg-secondary/30">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t("track.shippingAddress")}</p>
                  <p className="font-medium text-sm">John Smith</p>
                  <p className="text-xs text-muted-foreground">গুলশান-২, ঢাকা ১২১২</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t("track.carrier")}</p>
                  <p className="font-medium text-sm">Pathao Courier</p>
                  <p className="text-xs text-muted-foreground">AWB: PT9876543210</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </Layout>
  );
};

export default TrackOrder;
