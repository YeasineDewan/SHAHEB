import { motion } from "framer-motion";
import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

const features = [
  { icon: Truck, title: "বিনামূল্যে শিপিং", desc: "৳৯৯৯+ অর্ডারে" },
  { icon: ShieldCheck, title: "নিরাপদ পেমেন্ট", desc: "১০০% এনক্রিপ্টেড চেকআউট" },
  { icon: RotateCcw, title: "সহজ রিটার্ন", desc: "১৫ দিনের ঝামেলামুক্ত রিটার্ন" },
  { icon: Headphones, title: "২৪/৭ সাপোর্ট", desc: "চ্যাট ও ইমেইল সাপোর্ট" },
];

export function TrustBadges() {
  return (
    <section className="py-10 md:py-14 border-y border-border bg-card/50">
      <div className="container px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.1 }}
              className="flex items-center gap-3 md:justify-center">
              <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <f.icon className="h-5 w-5 md:h-6 md:w-6 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-sm">{f.title}</p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
