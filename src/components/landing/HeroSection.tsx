import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export function HeroSection() {
  const { t } = useLanguage();
  return (
    <section className="relative overflow-hidden min-h-[85vh] md:min-h-[90vh] flex items-center">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1920&h=1080&fit=crop&q=80" alt="Men's Fashion" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30 dark:from-background/98 dark:via-background/80 dark:to-background/40" />
      </div>
      <div className="relative container px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-medium tracking-wider uppercase text-accent">{t("hero.badge")}</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
              {t("hero.title1")}{" "}<span className="text-gradient">{t("hero.style")}</span><br />
              <span className="text-muted-foreground text-3xl md:text-4xl lg:text-5xl font-light">{t("hero.title2")}</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base md:text-lg text-muted-foreground max-w-md mb-8 leading-relaxed">
              {t("hero.desc")}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8 h-13 rounded-full shadow-lg shadow-accent/25" asChild>
                <Link to="/products">{t("hero.browse")} <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 h-13 rounded-full backdrop-blur-sm" asChild>
                <Link to="/about"><Play className="mr-2 h-4 w-4 fill-current" /> {t("hero.story")}</Link>
              </Button>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
              className="flex gap-8 mt-12 pt-8 border-t border-border/50">
              {[
                { value: "১০K+", label: t("hero.customers") },
                { value: "৫০০+", label: t("hero.products") },
                { value: "৪.৯★", label: t("hero.rating") },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
