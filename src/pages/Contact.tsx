import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";

const Contact = () => {
  return (
    <Layout>
      <div className="container px-4 py-12 md:py-20 max-w-5xl">
        <div className="text-center mb-12">
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-accent mb-2">Get In Touch</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-muted-foreground max-w-md mx-auto">Have a question? We'd love to hear from you.</p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Contact info */}
          <div className="md:col-span-2 space-y-6">
            {[
              { icon: Mail, title: "Email", detail: "support@shaheb.com" },
              { icon: Phone, title: "Phone", detail: "+91 98765 43210" },
              { icon: MapPin, title: "Address", detail: "Mumbai, Maharashtra, India" },
              { icon: Clock, title: "Working Hours", detail: "Mon–Sat, 10 AM – 7 PM IST" },
            ].map(({ icon: Icon, title, detail }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{title}</p>
                  <p className="text-sm text-muted-foreground">{detail}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-3 bg-card border border-border rounded-2xl p-6 md:p-8"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label className="text-xs">Name</Label><Input placeholder="Your name" className="rounded-lg" /></div>
                <div className="space-y-2"><Label className="text-xs">Email</Label><Input type="email" placeholder="you@email.com" className="rounded-lg" /></div>
              </div>
              <div className="space-y-2"><Label className="text-xs">Subject</Label><Input placeholder="How can we help?" className="rounded-lg" /></div>
              <div className="space-y-2"><Label className="text-xs">Message</Label><Textarea placeholder="Write your message..." rows={5} className="rounded-lg" /></div>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full h-11 px-8">
                <Send className="mr-2 h-4 w-4" /> Send Message
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default Contact;
