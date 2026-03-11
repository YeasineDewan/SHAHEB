import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

const videos = [
  { id: 1, title: "গ্রীষ্মকালীন কালেকশন ২০২৬", subtitle: "হালকা কাপড়, সাহসী ডিজাইন", thumbnail: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=1200&h=600&fit=crop", color: "from-amber-900/80" },
  { id: 2, title: "কারুশিল্পের পেছনে", subtitle: "দেখুন কিভাবে প্রিমিয়াম কুর্তা তৈরি হয়", thumbnail: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200&h=600&fit=crop", color: "from-stone-900/80" },
  { id: 3, title: "স্ট্রিট স্টাইল লুকবুক", subtitle: "আধুনিক ও ঐতিহ্যের মিশ্রণ — SHAHEB স্টাইল", thumbnail: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1200&h=600&fit=crop", color: "from-zinc-900/80" },
  { id: 4, title: "উৎসব সংস্করণ", subtitle: "ঈদ ও বিয়ের জন্য প্রস্তুত পোশাক", thumbnail: "https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?w=1200&h=600&fit=crop", color: "from-yellow-900/80" },
];

export function VideoCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const next = useCallback(() => setCurrent((c) => (c + 1) % videos.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + videos.length) % videos.length), []);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isPlaying, next]);

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-accent mb-2">দেখুন ও জানুন</p>
            <h2 className="text-3xl md:text-4xl font-bold">ভিডিও লুকবুক</h2>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-full" onClick={prev}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" className="rounded-full" onClick={next}><ChevronRight className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <div className="relative rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9]">
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.6 }} className="absolute inset-0">
              <img src={videos[current].thumbnail} alt={videos[current].title} className="w-full h-full object-cover" />
              <div className={`absolute inset-0 bg-gradient-to-r ${videos[current].color} via-transparent to-transparent`} />
              <div className="absolute inset-0 flex items-center px-6 md:px-16">
                <div className="max-w-lg">
                  <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-primary-foreground/80 text-sm tracking-wider uppercase mb-2 dark:text-foreground/80">{videos[current].subtitle}</motion.p>
                  <motion.h3 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-primary-foreground text-2xl md:text-4xl font-bold mb-6 dark:text-foreground">{videos[current].title}</motion.h3>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-6"><Play className="mr-2 h-4 w-4 fill-current" /> এখন দেখুন</Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center border border-primary-foreground/30 dark:bg-foreground/20 dark:border-foreground/30">
              <Play className="h-6 w-6 md:h-8 md:w-8 text-primary-foreground fill-current ml-1 dark:text-foreground" />
            </div>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {videos.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-accent" : "w-4 bg-primary-foreground/40 dark:bg-foreground/40"}`} />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 mt-4 md:hidden">
          <Button variant="outline" size="icon" className="rounded-full h-9 w-9" onClick={prev}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="text-sm text-muted-foreground font-medium">{current + 1} / {videos.length}</span>
          <Button variant="outline" size="icon" className="rounded-full h-9 w-9" onClick={next}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
    </section>
  );
}
