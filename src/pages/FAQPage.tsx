import { Layout } from "@/components/layout/Layout";
import { Footer } from "@/components/layout/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqGroups = [
  {
    title: "Orders & Shipping",
    faqs: [
      { q: "How long does shipping take?", a: "Standard shipping takes 5-7 business days. Express shipping (2-3 days) is available at checkout." },
      { q: "Do you ship internationally?", a: "Currently we ship across India. International shipping is coming soon." },
      { q: "How can I track my order?", a: "Once shipped, you'll receive a tracking link via email. You can also track from your Orders page." },
    ],
  },
  {
    title: "Payments",
    faqs: [
      { q: "What payment methods do you accept?", a: "We accept credit/debit cards, UPI, net banking, and popular digital wallets." },
      { q: "Is my payment information secure?", a: "Absolutely. All transactions use 256-bit SSL encryption." },
    ],
  },
  {
    title: "Returns & Refunds",
    faqs: [
      { q: "Can I return or exchange products?", a: "Yes. We offer a 15-day hassle-free return policy. Products must be unworn with tags attached." },
      { q: "How long do refunds take?", a: "Refunds are processed within 5-7 business days after we receive the returned item." },
    ],
  },
  {
    title: "Digital Products",
    faqs: [
      { q: "How do I access digital products?", a: "After purchase, digital products are instantly available in your account dashboard for download." },
      { q: "Can I get a refund on digital products?", a: "Due to the nature of digital products, refunds are not available after download. Contact support for issues." },
    ],
  },
];

const FAQPage = () => {
  return (
    <Layout>
      <div className="container px-4 py-12 md:py-20 max-w-3xl">
        <div className="text-center mb-12">
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-accent mb-2">Help Center</p>
          <h1 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h1>
        </div>

        <div className="space-y-8">
          {faqGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-lg font-bold mb-3">{group.title}</h2>
              <Accordion type="single" collapsible className="space-y-2">
                {group.faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`${group.title}-${i}`} className="bg-card border border-border rounded-lg px-4">
                    <AccordionTrigger className="text-left font-medium text-sm hover:no-underline">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default FAQPage;
