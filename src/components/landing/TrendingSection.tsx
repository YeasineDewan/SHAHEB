import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, Clock, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const trending = [
  { id: "t1", name: "স্লিম ফিট নেভি ব্লেজার", price: 6999, originalPrice: 9999, image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=300&h=400&fit=crop", badge: "বেস্টসেলার" },
  { id: "t2", name: "কটন লিনেন শার্ট", price: 1799, originalPrice: 2499, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&h=400&fit=crop", badge: "ট্রেন্ডিং" },
  { id: "t3", name: "ডিজাইনার কুর্তা", price: 2999, originalPrice: 4499, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=400&fit=crop", badge: "হট" },
  { id: "t4", name: "কার্গো জগার্স", price: 1499, originalPrice: 2199, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&h=400&fit=crop", badge: "নতুন" },
];

const badgeIcons: Record<string, typeof TrendingUp> = { "বেস্টসেলার": TrendingUp, "ট্রেন্ডিং": TrendingUp, "হট": Flame, "নতুন": Clock };

export function TrendingSection() {
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-accent mb-2">🔥 মিস করবেন না</p>
            <h2 className="text-3xl md:text-4xl font-bold">এখন ট্রেন্ডিং</h2>
          </div>
          <Link to="/products?sort=popular" className="hidden md:block text-sm font-medium text-accent hover:underline">সব ট্রেন্ডিং দেখুন →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {trending.map((product, i) => {
            const Icon = badgeIcons[product.badge] || TrendingUp;
            const discount = Math.round((1 - product.price / product.originalPrice) * 100);
            return (
              <motion.div key={product.id} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}>
                <Link to={`/products/${product.id}`} className="group block">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-muted mb-3">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground text-[10px] gap-1"><Icon className="h-3 w-3" /> {product.badge}</Badge>
                    <Badge variant="destructive" className="absolute top-2 right-2 text-[10px]">-{discount}%</Badge>
                  </div>
                  <h3 className="font-medium text-sm text-foreground line-clamp-1">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-accent font-bold">৳{product.price.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground line-through">৳{product.originalPrice.toLocaleString()}</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" className="rounded-full" asChild>
            <Link to="/products?sort=popular">সব ট্রেন্ডিং দেখুন</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
