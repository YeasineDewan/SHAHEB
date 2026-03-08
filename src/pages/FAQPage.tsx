import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Footer } from "@/components/layout/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, HelpCircle, Package, CreditCard, RotateCcw, Truck, Monitor, ShieldCheck, MessageCircle, ChevronRight, X } from "lucide-react";
import { motion } from "framer-motion";

const faqGroups = [
  {
    title: "Orders & Shipping",
    icon: Truck,
    faqs: [
      { q: "How long does shipping take?", a: "Standard shipping takes 5-7 business days. Express shipping (2-3 days) is available at checkout for an additional ₹149. Orders placed before 2 PM IST are shipped the same day." },
      { q: "Do you ship internationally?", a: "Currently we ship across India with 28,000+ PIN codes covered. International shipping to UAE, USA, UK, and Canada is launching in Q3 2026. Join our newsletter for updates." },
      { q: "How can I track my order?", a: "Once shipped, you'll receive a tracking link via email and SMS. You can also track from your Dashboard → Orders page, or visit our dedicated Track Order page with your order ID." },
      { q: "Can I change my delivery address after placing an order?", a: "Yes, you can update your delivery address within 2 hours of placing the order. Go to Dashboard → Orders → select your order → Edit Address. After dispatch, address changes are not possible." },
      { q: "What if my order is delayed?", a: "If your order hasn't arrived within the estimated timeframe, please check the tracking status first. If it shows no movement for 48+ hours, contact our support team and we'll investigate immediately. You're eligible for a full refund if delivery exceeds 15 business days." },
    ],
  },
  {
    title: "Payments & Pricing",
    icon: CreditCard,
    faqs: [
      { q: "What payment methods do you accept?", a: "We accept Visa, Mastercard, RuPay credit/debit cards, UPI (GPay, PhonePe, Paytm), Net Banking (all major banks), and Cash on Delivery. EMI options are available on orders above ₹3,000." },
      { q: "Is my payment information secure?", a: "Absolutely. All transactions use 256-bit SSL encryption. We are PCI-DSS compliant and never store your card details on our servers. Payments are processed through RazorPay's secure gateway." },
      { q: "Do you offer EMI options?", a: "Yes! No-cost EMI is available on orders above ₹3,000 for select bank cards. You can choose 3, 6, or 12-month EMI plans at checkout. Standard EMI with interest is available on all cards." },
      { q: "Will I be charged GST?", a: "All prices displayed include GST. You'll receive a GST-compliant invoice with your order. For B2B purchases with GSTIN, contact our business team for GST input credit." },
    ],
  },
  {
    title: "Returns & Refunds",
    icon: RotateCcw,
    faqs: [
      { q: "What is your return policy?", a: "We offer a 15-day hassle-free return policy. Products must be unworn, unwashed, with all tags attached and in original packaging. Simply initiate a return from your Dashboard → Orders page." },
      { q: "How long do refunds take?", a: "Refunds are initiated within 24 hours of receiving the returned item. Bank processing times: UPI/Wallets: 1-2 days, Credit/Debit cards: 5-7 days, Net Banking: 7-10 days." },
      { q: "Can I exchange instead of return?", a: "Yes! You can exchange for a different size or color of the same product. Exchanges are processed faster — your new item ships within 24 hours of receiving the original." },
      { q: "What if I receive a damaged or wrong item?", a: "We sincerely apologize if this happens. Contact us within 48 hours with photos of the issue. We'll arrange a free pickup and send a replacement or full refund — no questions asked." },
    ],
  },
  {
    title: "Digital Products",
    icon: Monitor,
    faqs: [
      { q: "How do I access digital products?", a: "After purchase, digital products are instantly available in your Dashboard → Downloads section. You'll also receive a download link via email. Downloads are available for 1 year from purchase date." },
      { q: "Can I get a refund on digital products?", a: "Due to the nature of digital products, refunds are not available after download. If you experience technical issues accessing your purchase, our support team will help resolve it within 24 hours." },
      { q: "In what formats are digital products available?", a: "eBooks are available in PDF and EPUB formats. Style guides come as interactive PDFs. Video content is streamable in HD quality directly from your dashboard." },
      { q: "Can I share my digital purchases?", a: "Digital products are licensed for personal use only. Each purchase is linked to your account. Sharing or redistributing is not permitted under our terms of service." },
    ],
  },
  {
    title: "Account & Security",
    icon: ShieldCheck,
    faqs: [
      { q: "How do I create an account?", a: "Click 'Sign Up' in the header, enter your details, and verify your email. You can also sign up during checkout. Your account gives you access to order tracking, wishlists, and exclusive member deals." },
      { q: "I forgot my password. How do I reset it?", a: "Click 'Forgot Password' on the login page, enter your registered email, and you'll receive a reset link within minutes. The link expires in 1 hour for security." },
      { q: "How do I delete my account?", a: "Go to Dashboard → Settings → scroll to the bottom and click 'Delete Account'. This action is permanent and will remove all your data including order history after a 30-day grace period." },
    ],
  },
];

const allFaqsFlat = faqGroups.flatMap(g => g.faqs.map(f => ({ ...f, group: g.title })));

const FAQPage = () => {
  const [search, setSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

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
  }, [search, activeGroup]);

  const totalResults = filteredGroups.reduce((s, g) => s + g.faqs.length, 0);

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-primary text-primary-foreground">
        <div className="container px-4 py-12 md:py-20 max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/20 mb-5">
              <HelpCircle className="h-7 w-7 text-accent" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-3">How can we help you?</h1>
            <p className="text-primary-foreground/60 mb-8 max-w-lg mx-auto">
              Find answers to common questions about orders, payments, returns, and more.
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for answers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 pr-10 h-13 rounded-full bg-background text-foreground border-0 shadow-lg text-sm"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2">
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
            {search && (
              <p className="text-sm text-primary-foreground/50 mt-3">
                {totalResults} result{totalResults !== 1 ? "s" : ""} found for "{search}"
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Category filter chips */}
      <div className="border-b border-border bg-card">
        <div className="container px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          <Badge
            variant={!activeGroup ? "default" : "outline"}
            className={`cursor-pointer rounded-full px-4 py-1.5 whitespace-nowrap ${!activeGroup ? "bg-accent text-accent-foreground" : ""}`}
            onClick={() => setActiveGroup(null)}
          >
            All Topics
          </Badge>
          {faqGroups.map(g => (
            <Badge
              key={g.title}
              variant={activeGroup === g.title ? "default" : "outline"}
              className={`cursor-pointer rounded-full px-4 py-1.5 whitespace-nowrap gap-1.5 ${activeGroup === g.title ? "bg-accent text-accent-foreground" : ""}`}
              onClick={() => setActiveGroup(activeGroup === g.title ? null : g.title)}
            >
              <g.icon className="h-3 w-3" /> {g.title}
            </Badge>
          ))}
        </div>
      </div>

      <div className="container px-4 py-10 md:py-16 max-w-3xl">
        {/* Breadcrumb */}
        <div className="text-xs text-muted-foreground mb-8 flex items-center gap-1">
          <Link to="/" className="hover:text-foreground">Home</Link> <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">FAQ</span>
          {activeGroup && <><ChevronRight className="h-3 w-3" /><span className="text-foreground">{activeGroup}</span></>}
        </div>

        {filteredGroups.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="font-semibold text-lg mb-2">No results found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We couldn't find any FAQ matching "{search}". Try different keywords or browse all topics.
            </p>
            <Button variant="outline" className="rounded-full" onClick={() => { setSearch(""); setActiveGroup(null); }}>
              Clear Search
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-10">
            {filteredGroups.map((group, gi) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gi * 0.05 }}
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                    <group.icon className="h-4.5 w-4.5 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">{group.title}</h2>
                    <p className="text-xs text-muted-foreground">{group.faqs.length} question{group.faqs.length !== 1 ? "s" : ""}</p>
                  </div>
                </div>
                <Accordion type="single" collapsible className="space-y-2">
                  {group.faqs.map((faq, i) => (
                    <AccordionItem
                      key={i}
                      value={`${group.title}-${i}`}
                      className="bg-card border border-border rounded-xl px-5 data-[state=open]:shadow-sm transition-shadow"
                    >
                      <AccordionTrigger className="text-left font-medium text-sm hover:no-underline py-4">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </div>
        )}

        {/* Still need help CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 bg-primary text-primary-foreground rounded-2xl p-8 md:p-10 text-center"
        >
          <MessageCircle className="h-10 w-10 mx-auto mb-4 text-accent" />
          <h3 className="text-xl md:text-2xl font-bold mb-2">Still have questions?</h3>
          <p className="text-primary-foreground/60 text-sm mb-6 max-w-md mx-auto">
            Can't find what you're looking for? Our support team is here to help you 7 days a week.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full h-11 px-6" asChild>
              <Link to="/contact">Contact Support</Link>
            </Button>
            <Button variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 rounded-full h-11 px-6">
              support@shaheb.com
            </Button>
          </div>
        </motion.div>

        {/* Quick links */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Package, title: "Track Order", desc: "Check your order status", href: "/track-order" },
            { icon: RotateCcw, title: "Returns", desc: "Start a return or exchange", href: "/contact" },
            { icon: ShieldCheck, title: "My Account", desc: "Manage your profile", href: "/dashboard" },
          ].map(item => (
            <Link
              key={item.title}
              to={item.href}
              className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:shadow-md hover:border-accent/30 transition-all group"
            >
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
