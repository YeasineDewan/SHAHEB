import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, UPI, net banking, and popular wallets. International payments are also supported." },
  { q: "How long does shipping take?", a: "Standard shipping takes 5-7 business days. Express shipping is available for 2-3 day delivery within India." },
  { q: "Can I return or exchange products?", a: "Yes! We offer a 15-day hassle-free return policy. Products must be unworn and in original packaging." },
  { q: "How do I access digital products?", a: "After purchase, digital products are instantly available in your account dashboard. You can download them anytime." },
  { q: "Do you ship internationally?", a: "Currently we ship across India. International shipping is coming soon. Stay tuned!" },
];

export function FAQSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-accent mb-2">Got Questions?</p>
            <h2 className="text-3xl md:text-4xl font-bold">FAQ</h2>
          </div>

          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
