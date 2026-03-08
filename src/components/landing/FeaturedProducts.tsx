import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockProducts = [
  { id: "1", name: "Classic Oxford Shirt", price: 2499, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop", category: "Shirts" },
  { id: "2", name: "Slim Fit Chinos", price: 1999, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop", category: "Trousers" },
  { id: "3", name: "Leather Jacket", price: 5999, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop", category: "Jackets" },
  { id: "4", name: "Premium Kurta Set", price: 3499, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop", category: "Ethnic" },
  { id: "5", name: "Style Guide eBook", price: 499, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop", category: "Digital" },
  { id: "6", name: "Formal Blazer", price: 6999, image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400&h=500&fit=crop", category: "Blazers" },
];

export function FeaturedProducts() {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-accent mb-2">Curated For You</p>
            <h2 className="text-3xl md:text-4xl font-bold">Featured Products</h2>
          </div>
          <Link to="/products" className="hidden md:block text-sm font-medium text-accent hover:underline">
            View All →
          </Link>
        </div>

        {/* Mobile: horizontal scroll, Desktop: grid */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-3 lg:grid-cols-3 md:overflow-visible md:pb-0 md:gap-6 scrollbar-hide">
          {mockProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="min-w-[260px] md:min-w-0 snap-start"
            >
              <Link to={`/products/${product.id}`} className="group block">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-secondary mb-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Button
                    size="icon"
                    className="absolute bottom-3 right-3 rounded-full bg-accent text-accent-foreground opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0"
                  >
                    <ShoppingBag className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{product.category}</p>
                <h3 className="font-medium text-foreground">{product.name}</h3>
                <p className="text-accent font-semibold mt-1">₹{product.price.toLocaleString()}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" className="rounded-full" asChild>
            <Link to="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
