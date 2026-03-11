import { motion } from "framer-motion";

const brands = ["RAYMOND", "PETER ENGLAND", "VAN HEUSEN", "LOUIS PHILIPPE", "ALLEN SOLLY", "ARROW"];

export function BrandsMarquee() {
  return (
    <section className="py-8 md:py-12 border-y border-border overflow-hidden bg-muted/30">
      <div className="container px-4 mb-4 text-center">
        <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground">সেরাদের দ্বারা অনুপ্রাণিত</p>
      </div>
      <div className="relative">
        <motion.div animate={{ x: [0, -1000] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="flex gap-16 items-center whitespace-nowrap">
          {[...brands, ...brands, ...brands].map((brand, i) => (
            <span key={i} className="text-xl md:text-2xl font-display font-bold text-muted-foreground/40 tracking-[0.15em] select-none">{brand}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
