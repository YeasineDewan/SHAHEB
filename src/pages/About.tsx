import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Footer } from "@/components/layout/Footer";
import { Award, Users, Globe, Heart } from "lucide-react";

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=600&fit=crop" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/70 dark:bg-background/80" />
        </div>
        <div className="container px-4 relative text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-bold text-primary-foreground dark:text-foreground mb-4">
            About SHAHEB
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-primary-foreground/80 dark:text-foreground/80 max-w-xl mx-auto">
            Born from a passion for men's fashion, SHAHEB bridges the gap between tradition and modernity.
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="container px-4 py-16 md:py-24 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Story</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          SHAHEB was founded in 2024 with a simple vision — to make premium, well-crafted men's fashion accessible to everyone. 
          We believe that every man deserves to feel confident and stylish, whether it's for a boardroom meeting, a festive celebration, or an everyday outing.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          From handpicked ethnic wear to modern street style and exclusive digital style guides, we curate products that celebrate the contemporary Indian man. 
          Quality, authenticity, and customer experience are at the heart of everything we do.
        </p>
      </section>

      {/* Stats */}
      <section className="bg-secondary/50 py-16">
        <div className="container px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Users, value: "10,000+", label: "Happy Customers" },
            { icon: Award, value: "500+", label: "Products" },
            { icon: Globe, value: "100+", label: "Cities Served" },
            { icon: Heart, value: "4.9/5", label: "Customer Rating" },
          ].map(({ icon: Icon, value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
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
