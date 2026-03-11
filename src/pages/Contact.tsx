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
      <div className="bg-secondary/50 border-b border-border">
        <div className="container px-4 py-10 md:py-14 text-center">
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-accent mb-2">যোগাযোগ করুন</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">আমাদের সাথে যোগাযোগ</h1>
          <p className="text-muted-foreground max-w-md mx-auto text-sm">কোনো প্রশ্ন, সাহায্যের দরকার, বা শুধু হ্যালো বলতে চান? আমরা আপনার কথা শুনতে চাই।</p>
        </div>
      </div>
      <div className="container px-4 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: ShoppingBag, title: "অর্ডার সমস্যা", desc: "ট্র্যাক বা রিপোর্ট" },
            { icon: HelpCircle, title: "জিজ্ঞাসা", desc: "সাধারণ প্রশ্ন", href: "/faq" },
            { icon: MessageCircle, title: "লাইভ চ্যাট", desc: "আমাদের সাথে চ্যাট করুন" },
            { icon: Phone, title: "কল করুন", desc: "+৮৮০ ১৭১২ ৩৪৫৬৭৮" },
          ].map(({ icon: Icon, title, desc, href }) => (
            <Link key={title} to={href || "#"} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3 hover:shadow-md transition-shadow group">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                <Icon className="h-5 w-5 text-accent" />
              </div>
              <div><p className="font-semibold text-sm">{title}</p><p className="text-[10px] text-muted-foreground">{desc}</p></div>
            </Link>
          ))}
        </div>
      </div>
      <div className="container px-4 py-12 md:py-16 max-w-5xl">
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="font-bold text-lg mb-4">যোগাযোগের তথ্য</h2>
              {[
                { icon: Mail, title: "ইমেইল", detail: "support@shaheb.com", sub: "২৪ ঘণ্টার মধ্যে উত্তর দিই" },
                { icon: Phone, title: "ফোন", detail: "+৮৮০ ১৭১২ ৩৪৫৬৭৮", sub: "শনি-বৃহঃ, সকাল ১০টা - রাত ৮টা" },
                { icon: MapPin, title: "ঠিকানা", detail: "গুলশান-২, ঢাকা", sub: "ঢাকা, বাংলাদেশ" },
                { icon: Clock, title: "কর্মসময়", detail: "শনি-বৃহঃ, সকাল ১০টা - রাত ৮টা", sub: "শুক্রবার ও সরকারি ছুটিতে বন্ধ" },
              ].map(({ icon: Icon, title, detail, sub }) => (
                <motion.div key={title} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-start gap-3.5 mb-5">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0"><Icon className="h-5 w-5 text-accent" /></div>
                  <div><p className="font-semibold text-sm">{title}</p><p className="text-sm text-foreground">{detail}</p><p className="text-[10px] text-muted-foreground">{sub}</p></div>
                </motion.div>
              ))}
            </div>
            <div className="rounded-xl overflow-hidden border border-border h-48 bg-secondary flex items-center justify-center">
              <div className="text-center text-muted-foreground"><MapPin className="h-8 w-8 mx-auto mb-2 opacity-40" /><p className="text-xs">ম্যাপ ভিউ শীঘ্রই আসছে</p></div>
            </div>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="md:col-span-3">
            {sent ? (
              <div className="bg-card border border-border rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4"><Check className="h-8 w-8 text-green-600" /></div>
                <h3 className="text-xl font-bold mb-2">বার্তা পাঠানো হয়েছে!</h3>
                <p className="text-sm text-muted-foreground mb-4">আমরা আপনার বার্তা পেয়েছি এবং ২৪ ঘণ্টার মধ্যে উত্তর দেব।</p>
                <Button variant="outline" className="rounded-full" onClick={() => setSent(false)}>আরেকটি বার্তা পাঠান</Button>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
                <h2 className="font-bold text-lg mb-5">আমাদের বার্তা পাঠান</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5"><Label className="text-xs font-medium">পুরো নাম *</Label><Input placeholder="আবদুল করিম" className="rounded-lg" /></div>
                    <div className="space-y-1.5"><Label className="text-xs font-medium">ইমেইল *</Label><Input type="email" placeholder="you@email.com" className="rounded-lg" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5"><Label className="text-xs font-medium">ফোন</Label><Input placeholder="+৮৮০ ১৭১২ ৩৪৫৬৭৮" className="rounded-lg" /></div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">বিভাগ</Label>
                      <Select><SelectTrigger className="rounded-lg"><SelectValue placeholder="বিষয় নির্বাচন করুন" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="order">অর্ডার সমস্যা</SelectItem>
                          <SelectItem value="product">পণ্য সম্পর্কিত</SelectItem>
                          <SelectItem value="return">রিটার্ন / রিফান্ড</SelectItem>
                          <SelectItem value="feedback">মতামত</SelectItem>
                          <SelectItem value="other">অন্যান্য</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1.5"><Label className="text-xs font-medium">বিষয় *</Label><Input placeholder="কিভাবে সাহায্য করতে পারি?" className="rounded-lg" /></div>
                  <div className="space-y-1.5"><Label className="text-xs font-medium">বার্তা *</Label><Textarea placeholder="বিস্তারিত লিখুন..." rows={5} className="rounded-lg" /></div>
                  <div className="space-y-1.5"><Label className="text-xs font-medium">অর্ডার আইডি (ঐচ্ছিক)</Label><Input placeholder="ORD-2026-XXX" className="rounded-lg" /></div>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full h-11 px-8 font-semibold" onClick={() => setSent(true)}>
                    <Send className="mr-2 h-4 w-4" /> বার্তা পাঠান
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
