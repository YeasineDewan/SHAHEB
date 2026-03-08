import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, Send, Clock, MessageCircle, HelpCircle, ShoppingBag, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Contact = () => {
  const [sent, setSent] = useState(false);

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-secondary/50 border-b border-border">
        <div className="container px-4 py-10 md:py-14 text-center">
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-accent mb-2">Get In Touch</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-muted-foreground max-w-md mx-auto text-sm">Have a question, need help, or just want to say hi? We'd love to hear from you.</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="container px-4 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: ShoppingBag, title: "Order Issues", desc: "Track or report" },
            { icon: HelpCircle, title: "FAQ", desc: "Common questions", href: "/faq" },
            { icon: MessageCircle, title: "Live Chat", desc: "Chat with us" },
            { icon: Phone, title: "Call Us", desc: "+91 98765 43210" },
          ].map(({ icon: Icon, title, desc, href }) => (
            <Link key={title} to={href || "#"} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3 hover:shadow-md transition-shadow group">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                <Icon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-sm">{title}</p>
                <p className="text-[10px] text-muted-foreground">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="container px-4 py-12 md:py-16 max-w-5xl">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Contact info */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="font-bold text-lg mb-4">Get In Touch</h2>
              {[
                { icon: Mail, title: "Email", detail: "support@shaheb.com", sub: "We reply within 24 hours" },
                { icon: Phone, title: "Phone", detail: "+91 98765 43210", sub: "Mon–Sat, 10 AM – 7 PM" },
                { icon: MapPin, title: "Address", detail: "123 Fashion Street, Andheri West", sub: "Mumbai, Maharashtra 400058" },
                { icon: Clock, title: "Working Hours", detail: "Mon–Sat, 10 AM – 7 PM IST", sub: "Closed on Sundays & holidays" },
              ].map(({ icon: Icon, title, detail, sub }) => (
                <motion.div key={title} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  className="flex items-start gap-3.5 mb-5">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{title}</p>
                    <p className="text-sm text-foreground">{detail}</p>
                    <p className="text-[10px] text-muted-foreground">{sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="rounded-xl overflow-hidden border border-border h-48 bg-secondary flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs">Map view available soon</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="md:col-span-3">
            {sent ? (
              <div className="bg-card border border-border rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                <p className="text-sm text-muted-foreground mb-4">We've received your message and will get back to you within 24 hours.</p>
                <Button variant="outline" className="rounded-full" onClick={() => setSent(false)}>Send Another Message</Button>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
                <h2 className="font-bold text-lg mb-5">Send Us a Message</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5"><Label className="text-xs font-medium">Full Name *</Label><Input placeholder="John Smith" className="rounded-lg" /></div>
                    <div className="space-y-1.5"><Label className="text-xs font-medium">Email *</Label><Input type="email" placeholder="john@email.com" className="rounded-lg" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5"><Label className="text-xs font-medium">Phone</Label><Input placeholder="+91 98765 43210" className="rounded-lg" /></div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Category</Label>
                      <Select>
                        <SelectTrigger className="rounded-lg"><SelectValue placeholder="Select topic" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="order">Order Issue</SelectItem>
                          <SelectItem value="product">Product Query</SelectItem>
                          <SelectItem value="return">Return / Refund</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1.5"><Label className="text-xs font-medium">Subject *</Label><Input placeholder="How can we help?" className="rounded-lg" /></div>
                  <div className="space-y-1.5"><Label className="text-xs font-medium">Message *</Label><Textarea placeholder="Describe your query in detail..." rows={5} className="rounded-lg" /></div>
                  <div className="space-y-1.5"><Label className="text-xs font-medium">Order ID (optional)</Label><Input placeholder="ORD-2026-XXX" className="rounded-lg" /></div>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full h-11 px-8 font-semibold" onClick={() => setSent(true)}>
                    <Send className="mr-2 h-4 w-4" /> Send Message
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default Contact;
