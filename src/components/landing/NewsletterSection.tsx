import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export function NewsletterSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="relative rounded-2xl overflow-hidden">
          <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop" alt="নিউজলেটার" className="w-full h-full object-cover absolute inset-0" />
          <div className="absolute inset-0 bg-foreground/70 dark:bg-background/80" />
          <div className="relative px-6 py-14 md:py-20 text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-3 dark:text-foreground">স্টাইলে থাকুন</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto dark:text-foreground/80">
              এক্সক্লুসিভ অফার, স্টাইল টিপস এবং সদস্য-শুধু ডিসকাউন্টের জন্য সাবস্ক্রাইব করুন।
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <Input placeholder="আপনার ইমেইল দিন" type="email"
                className="rounded-full bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 dark:bg-foreground/10 dark:border-foreground/20 dark:text-foreground dark:placeholder:text-foreground/50" />
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-6">
                <Send className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">সাবস্ক্রাইব</span>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
