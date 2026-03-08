import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PromoBanners() {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4">
        <div className="grid md:grid-cols-12 gap-4 md:gap-6">
          {/* Large left banner */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-7 relative rounded-2xl overflow-hidden aspect-[4/3] md:aspect-auto md:min-h-[420px] group"
          >
            <img
              src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=900&h=600&fit=crop"
              alt="Premium Collection"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <span className="inline-block bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                Up to 40% Off
              </span>
              <h3 className="text-primary-foreground text-2xl md:text-3xl font-bold mb-2 dark:text-foreground">Premium Formal Collection</h3>
              <p className="text-primary-foreground/80 text-sm mb-4 max-w-sm dark:text-foreground/80">
                Tailored blazers, crisp shirts & premium trousers for the modern gentleman.
              </p>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full" asChild>
                <Link to="/products?category=formal">
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Right side stacked banners */}
          <div className="md:col-span-5 flex flex-col gap-4 md:gap-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative rounded-2xl overflow-hidden aspect-[16/9] md:flex-1 group"
            >
              <img
                src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=300&fit=crop"
                alt="Ethnic Wear"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <span className="text-xs text-accent font-bold uppercase tracking-wider">New Arrivals</span>
                <h4 className="text-primary-foreground text-xl font-bold mt-1 dark:text-foreground">Festive Kurta Sets</h4>
                <Link to="/products?category=ethnic" className="text-primary-foreground/80 text-sm mt-2 inline-flex items-center gap-1 hover:gap-2 transition-all dark:text-foreground/80">
                  Explore <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative rounded-2xl overflow-hidden aspect-[16/9] md:flex-1 group"
            >
              <img
                src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=300&fit=crop"
                alt="Digital Products"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <span className="text-xs text-accent font-bold uppercase tracking-wider">Digital</span>
                <h4 className="text-primary-foreground text-xl font-bold mt-1 dark:text-foreground">Style Guides & eBooks</h4>
                <Link to="/products?category=digital" className="text-primary-foreground/80 text-sm mt-2 inline-flex items-center gap-1 hover:gap-2 transition-all dark:text-foreground/80">
                  Download <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
