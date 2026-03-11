import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  { name: "আরিফ হোসেন", text: "SHAHEB আমার পোশাকের ধরন সম্পূর্ণ বদলে দিয়েছে। মান অতুলনীয় এবং ডেলিভারি অত্যন্ত দ্রুত।", rating: 5, location: "ঢাকা" },
  { name: "রাকিব হাসান", text: "সেরা পুরুষদের ফ্যাশন স্টোর যা আমি পেয়েছি। কুর্তা কালেকশন অথেন্টিক ও প্রিমিয়াম। সবাইকে সুপারিশ করি!", rating: 5, location: "চট্টগ্রাম" },
  { name: "তানভীর আহমেদ", text: "স্টাইল গাইড ইবুকটি প্রতিটি টাকার মূল্যবান। দারুণ টিপস এবং ফিজিক্যাল পণ্যগুলোও সমান চমৎকার।", rating: 4, location: "সিলেট" },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-secondary/50">
      <div className="container px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-accent mb-2">গ্রাহকদের মতামত</p>
          <h2 className="text-3xl md:text-4xl font-bold">রিভিউ</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.15 }}
              className="bg-card rounded-xl p-6 border border-border">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className={`h-4 w-4 ${j < t.rating ? "fill-accent text-accent" : "text-muted"}`} />
                ))}
              </div>
              <p className="text-foreground/80 mb-4 leading-relaxed">"{t.text}"</p>
              <div>
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
