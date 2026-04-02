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
import { useLanguage } from "@/contexts/LanguageContext";

const Contact = () => {
  const { t } = useLanguage();
  const [sent, setSent] = useState(false);
  return (
    <Layout>
      <div className="bg-secondary/50 border-b border-border">
        <div className="container px-4 py-10 md:py-14 text-center">
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-accent mb-2">{t("contact.getInTouch")}</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{t("contact.title")}</h1>
          <p className="text-muted-foreground max-w-md mx-auto text-sm">{t("contact.subtitle")}</p>
        </div>
      </div>
      <div className="container px-4 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: ShoppingBag, title: t("contact.orderIssue"), desc: t("contact.trackReport") },
            { icon: HelpCircle, title: t("contact.inquiries"), desc: t("contact.generalQuestions"), href: "/faq" },
            { icon: MessageCircle, title: t("contact.liveChat"), desc: t("contact.chatWithUs") },
            { icon: Phone, title: t("contact.callUs"), desc: "+৮৮০ ১৭১২ ৩৪৫৬৭৮" },
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
              <h2 className="font-bold text-lg mb-4">{t("contact.contactInfo")}</h2>
              {[
                { icon: Mail, title: t("contact.emailLabel"), detail: "support@shaheb.com", sub: t("contact.emailReply") },
                { icon: Phone, title: t("contact.phoneLabel"), detail: "+৮৮০ ১৭১২ ৩৪৫৬৭৮", sub: t("contact.phoneHours") },
                { icon: MapPin, title: t("contact.addressLabel"), detail: "গুলশান-২, ঢাকা", sub: "ঢাকা, বাংলাদেশ" },
                { icon: Clock, title: t("contact.workingHours"), detail: t("contact.phoneHours"), sub: t("contact.closedDays") },
              ].map(({ icon: Icon, title, detail, sub }) => (
                <motion.div key={title} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-start gap-3.5 mb-5">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0"><Icon className="h-5 w-5 text-accent" /></div>
                  <div><p className="font-semibold text-sm">{title}</p><p className="text-sm text-foreground">{detail}</p><p className="text-[10px] text-muted-foreground">{sub}</p></div>
                </motion.div>
              ))}
            </div>
            <div className="rounded-xl overflow-hidden border border-border h-48 bg-secondary flex items-center justify-center">
              <div className="text-center text-muted-foreground"><MapPin className="h-8 w-8 mx-auto mb-2 opacity-40" /><p className="text-xs">{t("contact.mapComingSoon")}</p></div>
            </div>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="md:col-span-3">
            {sent ? (
              <div className="bg-card border border-border rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4"><Check className="h-8 w-8 text-green-600" /></div>
                <h3 className="text-xl font-bold mb-2">{t("contact.sent")}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t("contact.sentDesc")}</p>
                <Button variant="outline" className="rounded-full" onClick={() => setSent(false)}>{t("contact.sendAnother")}</Button>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
                <h2 className="font-bold text-lg mb-5">{t("contact.sendMessage")}</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5"><Label className="text-xs font-medium">{t("contact.fullName")}</Label><Input placeholder="আবদুল করিম" className="rounded-lg" /></div>
                    <div className="space-y-1.5"><Label className="text-xs font-medium">{t("contact.emailRequired")}</Label><Input type="email" placeholder="you@email.com" className="rounded-lg" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5"><Label className="text-xs font-medium">{t("contact.phoneOptional")}</Label><Input placeholder="+৮৮০ ১৭১২ ৩৪৫৬৭৮" className="rounded-lg" /></div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">{t("contact.category")}</Label>
                      <Select><SelectTrigger className="rounded-lg"><SelectValue placeholder={t("contact.selectCategory")} /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="order">{t("contact.orderIssueOpt")}</SelectItem>
                          <SelectItem value="product">{t("contact.productRelated")}</SelectItem>
                          <SelectItem value="return">{t("contact.returnRefund")}</SelectItem>
                          <SelectItem value="feedback">{t("contact.feedback")}</SelectItem>
                          <SelectItem value="other">{t("contact.other")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1.5"><Label className="text-xs font-medium">{t("contact.subject")}</Label><Input placeholder={t("contact.subjectPlaceholder")} className="rounded-lg" /></div>
                  <div className="space-y-1.5"><Label className="text-xs font-medium">{t("contact.message")}</Label><Textarea placeholder={t("contact.messagePlaceholder")} rows={5} className="rounded-lg" /></div>
                  <div className="space-y-1.5"><Label className="text-xs font-medium">{t("contact.orderIdOptional")}</Label><Input placeholder="ORD-2026-XXX" className="rounded-lg" /></div>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full h-11 px-8 font-semibold" onClick={() => setSent(true)}>
                    <Send className="mr-2 h-4 w-4" /> {t("contact.sendBtn")}
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
