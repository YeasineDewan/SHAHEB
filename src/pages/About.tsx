import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Footer } from "@/components/layout/Footer";
import { Award, Users, Globe, Heart } from "lucide-react";

const About = () => {
  return (
    <Layout>
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=600&fit=crop" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/70 dark:bg-background/80" />
        </div>
        <div className="container px-4 relative text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-bold text-primary-foreground dark:text-foreground mb-4">
            SHAHEB সম্পর্কে
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-primary-foreground/80 dark:text-foreground/80 max-w-xl mx-auto">
            পুরুষদের ফ্যাশনের প্রতি ভালোবাসা থেকে জন্ম, SHAHEB ঐতিহ্য ও আধুনিকতার মধ্যে সেতু তৈরি করে।
          </motion.p>
        </div>
      </section>
      <section className="container px-4 py-16 md:py-24 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">আমাদের গল্প</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          SHAHEB ২০২৪ সালে একটি সহজ দৃষ্টিভঙ্গি নিয়ে প্রতিষ্ঠিত হয়েছিল — প্রিমিয়াম, সুনিপুণভাবে তৈরি পুরুষদের ফ্যাশন সবার কাছে সহজলভ্য করা।
          আমরা বিশ্বাস করি প্রতিটি পুরুষ আত্মবিশ্বাসী ও স্টাইলিশ অনুভব করার যোগ্য, সেটা বোর্ডরুম মিটিং হোক, উৎসব উদযাপন হোক, বা প্রতিদিনের বাইরে যাওয়া হোক।
        </p>
        <p className="text-muted-foreground leading-relaxed">
          হাতে বাছাই করা এথনিক পোশাক থেকে আধুনিক স্ট্রিট স্টাইল এবং এক্সক্লুসিভ ডিজিটাল স্টাইল গাইড, আমরা এমন পণ্য সংগ্রহ করি যা সমসাময়িক বাংলাদেশী পুরুষকে উদযাপন করে।
          মান, প্রামাণিকতা এবং গ্রাহক অভিজ্ঞতা আমাদের সবকিছুর কেন্দ্রে।
        </p>
      </section>
      <section className="bg-secondary/50 py-16">
        <div className="container px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Users, value: "১০,০০০+", label: "সন্তুষ্ট গ্রাহক" },
            { icon: Award, value: "৫০০+", label: "পণ্যসমূহ" },
            { icon: Globe, value: "৬৪", label: "জেলায় ডেলিভারি" },
            { icon: Heart, value: "৪.৯/৫", label: "গ্রাহক রেটিং" },
          ].map(({ icon: Icon, value, label }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <Icon className="h-8 w-8 text-accent mx-auto mb-3" />
              <p className="text-2xl md:text-3xl font-bold">{value}</p>
              <p className="text-sm text-muted-foreground mt-1">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <Footer />
    </Layout>
  );
};

export default About;
