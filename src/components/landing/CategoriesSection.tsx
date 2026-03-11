import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const categories = [
  { name: "শার্ট", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=400&fit=crop", count: 120, slug: "shirts" },
  { name: "এথনিক পোশাক", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=400&fit=crop", count: 85, slug: "ethnic" },
  { name: "জ্যাকেট ও ব্লেজার", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop", count: 64, slug: "jackets" },
  { name: "ট্রাউজার্স", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=400&fit=crop", count: 95, slug: "trousers" },
  { name: "এক্সেসরিজ", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop", count: 150, slug: "accessories" },
  { name: "ডিজিটাল কন্টেন্ট", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=400&fit=crop", count: 30, slug: "digital" },
];

export function CategoriesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-accent mb-2">ক্যাটেগরি অনুযায়ী</p>
          <h2 className="text-3xl md:text-4xl font-bold">পণ্যের ধরন</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
          {categories.map((cat, i) => (
            <motion.div key={cat.slug} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}>
              <Link to={`/products?category=${cat.slug}`} className="group relative block rounded-xl overflow-hidden aspect-[3/2] md:aspect-[4/3]">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <h3 className="text-primary-foreground font-bold text-lg md:text-xl mb-1 dark:text-foreground">{cat.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-primary-foreground/70 text-xs dark:text-foreground/70">{cat.count}টি পণ্য</span>
                    <ArrowRight className="h-4 w-4 text-primary-foreground/70 group-hover:translate-x-1 transition-transform dark:text-foreground/70" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
