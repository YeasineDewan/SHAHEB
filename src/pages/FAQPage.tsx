import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Footer } from "@/components/layout/Footer";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, HelpCircle, Package, CreditCard, RotateCcw, Truck, Monitor, ShieldCheck, MessageCircle, ChevronRight, X } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const FAQPage = () => {
  const { t, language } = useLanguage();
  const [search, setSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const faqGroups = useMemo(() => [
    {
      title: t("faq.ordersShipping"), icon: Truck,
      faqs: language === "bn" ? [
        { q: "শিপিং কতদিন সময় নেয়?", a: "স্ট্যান্ডার্ড শিপিং ৫-৭ কার্যদিবস সময় নেয়। এক্সপ্রেস শিপিং (২-৩ দিন) চেকআউটে অতিরিক্ত ৳১৪৯ তে পাওয়া যায়। বেলা ২টার আগে দেওয়া অর্ডার সেদিনই শিপ করা হয়।" },
        { q: "আমি কিভাবে আমার অর্ডার ট্র্যাক করতে পারি?", a: "শিপ হওয়ার পর আপনি ইমেইল ও SMS এ ট্র্যাকিং লিঙ্ক পাবেন। ড্যাশবোর্ড → অর্ডার পেজ থেকেও ট্র্যাক করতে পারবেন।" },
        { q: "অর্ডার দেওয়ার পর কি ডেলিভারি ঠিকানা পরিবর্তন করা যায়?", a: "হ্যাঁ, অর্ডার দেওয়ার ২ ঘণ্টার মধ্যে আপনি ডেলিভারি ঠিকানা আপডেট করতে পারবেন। ডিসপ্যাচের পর ঠিকানা পরিবর্তন সম্ভব নয়।" },
      ] : [
        { q: "How long does shipping take?", a: "Standard shipping takes 5-7 business days. Express shipping (2-3 days) is available at checkout for an additional ৳149. Orders placed before 2 PM BST are shipped the same day." },
        { q: "How can I track my order?", a: "Once shipped, you'll receive a tracking link via email and SMS. You can also track from your Dashboard → Orders page." },
        { q: "Can I change my delivery address after placing an order?", a: "Yes, you can update your delivery address within 2 hours of placing the order. After dispatch, address changes are not possible." },
      ],
    },
    {
      title: t("faq.paymentsTitle"), icon: CreditCard,
      faqs: language === "bn" ? [
        { q: "কোন পেমেন্ট পদ্ধতি গ্রহণ করা হয়?", a: "আমরা বিকাশ, নগদ, ক্যাশ অন ডেলিভারি (COD), এবং ক্রেডিট/ডেবিট কার্ড গ্রহণ করি।" },
        { q: "আমার পেমেন্ট তথ্য কি নিরাপদ?", a: "অবশ্যই। সব লেনদেন ২৫৬-বিট SSL এনক্রিপশন ব্যবহার করে। আমরা আপনার কার্ডের তথ্য কখনো সংরক্ষণ করি না।" },
      ] : [
        { q: "What payment methods do you accept?", a: "We accept bKash, Nagad, Cash on Delivery (COD), and credit/debit cards." },
        { q: "Is my payment information secure?", a: "Absolutely. All transactions use 256-bit SSL encryption. We never store your card details on our servers." },
      ],
    },
    {
      title: t("faq.returnsTitle"), icon: RotateCcw,
      faqs: language === "bn" ? [
        { q: "আপনাদের রিটার্ন পলিসি কী?", a: "আমরা ১৫ দিনের ঝামেলামুক্ত রিটার্ন পলিসি অফার করি। পণ্য অব্যবহৃত, অপরিষ্কৃত, সব ট্যাগ লাগানো এবং মূল প্যাকেজিংয়ে থাকতে হবে।" },
        { q: "রিফান্ড কতদিন সময় নেয়?", a: "রিটার্ন পণ্য পাওয়ার ২৪ ঘণ্টার মধ্যে রিফান্ড শুরু করা হয়। বিকাশ/নগদ: ১-২ দিন, কার্ড: ৫-৭ দিন।" },
      ] : [
        { q: "What is your return policy?", a: "We offer a 15-day hassle-free return policy. Products must be unworn, unwashed, with all tags attached and in original packaging." },
        { q: "How long do refunds take?", a: "Refunds are initiated within 24 hours of receiving the returned item. bKash/Nagad: 1-2 days, Cards: 5-7 days." },
      ],
    },
    {
      title: t("faq.digitalTitle"), icon: Monitor,
      faqs: language === "bn" ? [
        { q: "ডিজিটাল পণ্য কিভাবে পাব?", a: "কেনার পর ড্যাশবোর্ড → ডাউনলোডস সেকশনে তাৎক্ষণিকভাবে পাওয়া যাবে। ইমেইলেও ডাউনলোড লিঙ্ক পাঠানো হবে।" },
      ] : [
        { q: "How do I access digital products?", a: "After purchase, digital products are instantly available in your Dashboard → Downloads section. You'll also receive a download link via email." },
      ],
    },
    {
      title: t("faq.accountTitle"), icon: ShieldCheck,
      faqs: language === "bn" ? [
        { q: "কিভাবে অ্যাকাউন্ট তৈরি করব?", a: "হেডারে 'সাইন আপ' এ ক্লিক করুন, আপনার তথ্য দিন এবং ইমেইল ভেরিফাই করুন। চেকআউটের সময়ও সাইন আপ করতে পারবেন।" },
        { q: "পাসওয়ার্ড ভুলে গেছি। কিভাবে রিসেট করব?", a: "লগইন পেজে 'পাসওয়ার্ড ভুলে গেছেন?' এ ক্লিক করুন, আপনার ইমেইল দিন এবং কয়েক মিনিটের মধ্যে রিসেট লিঙ্ক পাবেন।" },
      ] : [
        { q: "How do I create an account?", a: "Click 'Sign Up' in the header, enter your details, and verify your email. You can also sign up during checkout." },
        { q: "I forgot my password. How do I reset it?", a: "Click 'Forgot Password' on the login page, enter your registered email, and you'll receive a reset link within minutes." },
      ],
    },
  ], [language, t]);

  const filteredGroups = useMemo(() => {
    if (!search && !activeGroup) return faqGroups;
    return faqGroups
      .filter(g => !activeGroup || g.title === activeGroup)
      .map(g => ({
        ...g,
        faqs: g.faqs.filter(f =>
          !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
        ),
      }))
      .filter(g => g.faqs.length > 0);
  }, [search, activeGroup, faqGroups]);

  const totalResults = filteredGroups.reduce((s, g) => s + g.faqs.length, 0);

  return (
    <Layout>
      <div className="bg-primary text-primary-foreground">
        <div className="container px-4 py-12 md:py-20 max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/20 mb-5">
              <HelpCircle className="h-7 w-7 text-accent" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-3">{t("faq.heroTitle")}</h1>
            <p className="text-primary-foreground/60 mb-8 max-w-lg mx-auto">{t("faq.heroDesc")}</p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder={t("faq.searchPlaceholder")} value={search} onChange={(e) => setSearch(e.target.value)}
                className="pl-12 pr-10 h-13 rounded-full bg-background text-foreground border-0 shadow-lg text-sm" />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2">
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
            {search && (
              <p className="text-sm text-primary-foreground/50 mt-3">
                {totalResults} {t("faq.resultsFor")} "{search}"
              </p>
            )}
          </motion.div>
        </div>
      </div>

      <div className="border-b border-border bg-card">
        <div className="container px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          <Badge variant={!activeGroup ? "default" : "outline"}
            className={`cursor-pointer rounded-full px-4 py-1.5 whitespace-nowrap ${!activeGroup ? "bg-accent text-accent-foreground" : ""}`}
            onClick={() => setActiveGroup(null)}>{t("faq.allTopics")}</Badge>
          {faqGroups.map(g => (
            <Badge key={g.title} variant={activeGroup === g.title ? "default" : "outline"}
              className={`cursor-pointer rounded-full px-4 py-1.5 whitespace-nowrap gap-1.5 ${activeGroup === g.title ? "bg-accent text-accent-foreground" : ""}`}
              onClick={() => setActiveGroup(activeGroup === g.title ? null : g.title)}>
              <g.icon className="h-3 w-3" /> {g.title}
            </Badge>
          ))}
        </div>
      </div>

      <div className="container px-4 py-10 md:py-16 max-w-3xl">
        <div className="text-xs text-muted-foreground mb-8 flex items-center gap-1">
          <Link to="/" className="hover:text-foreground">{t("general.home")}</Link> <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">FAQ</span>
          {activeGroup && <><ChevronRight className="h-3 w-3" /><span className="text-foreground">{activeGroup}</span></>}
        </div>

        {filteredGroups.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="font-semibold text-lg mb-2">{t("faq.noResults")}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t("faq.noResultsDesc")}</p>
            <Button variant="outline" className="rounded-full" onClick={() => { setSearch(""); setActiveGroup(null); }}>
              {t("general.clearSearch")}
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-10">
            {filteredGroups.map((group, gi) => (
              <motion.div key={group.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.05 }}>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                    <group.icon className="h-4.5 w-4.5 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">{group.title}</h2>
                    <p className="text-xs text-muted-foreground">{group.faqs.length} {t("faq.questions")}</p>
                  </div>
                </div>
                <Accordion type="single" collapsible className="space-y-2">
                  {group.faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`${group.title}-${i}`}
                      className="bg-card border border-border rounded-xl px-5 data-[state=open]:shadow-sm transition-shadow">
                      <AccordionTrigger className="text-left font-medium text-sm hover:no-underline py-4">{faq.q}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">{faq.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="mt-16 bg-primary text-primary-foreground rounded-2xl p-8 md:p-10 text-center">
          <MessageCircle className="h-10 w-10 mx-auto mb-4 text-accent" />
          <h3 className="text-xl md:text-2xl font-bold mb-2">{t("faq.stillQuestions")}</h3>
          <p className="text-primary-foreground/60 text-sm mb-6 max-w-md mx-auto">{t("faq.stillQuestionsDesc")}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full h-11 px-6" asChild>
              <Link to="/contact">{t("faq.contactSupport")}</Link>
            </Button>
            <Button variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 rounded-full h-11 px-6">
              support@shaheb.com
            </Button>
          </div>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Package, title: t("faq.trackOrder"), desc: t("faq.checkStatus"), href: "/track-order" },
            { icon: RotateCcw, title: t("faq.returns"), desc: t("faq.startReturn"), href: "/contact" },
            { icon: ShieldCheck, title: t("faq.myAccount"), desc: t("faq.manageProfile"), href: "/dashboard" },
          ].map(item => (
            <Link key={item.title} to={item.href}
              className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:shadow-md hover:border-accent/30 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                <item.icon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </Layout>
  );
};

export default FAQPage;
