import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "কোন পেমেন্ট পদ্ধতি গ্রহণ করেন?", a: "আমরা সকল প্রধান ক্রেডিট/ডেবিট কার্ড, বিকাশ, নগদ, রকেট এবং ক্যাশ অন ডেলিভারি গ্রহণ করি।" },
  { q: "শিপিংয়ে কত সময় লাগে?", a: "স্ট্যান্ডার্ড শিপিংয়ে ৩-৫ কার্যদিবস এবং এক্সপ্রেস শিপিংয়ে ১-২ দিন লাগে।" },
  { q: "পণ্য রিটার্ন বা এক্সচেঞ্জ করা যায়?", a: "হ্যাঁ! আমরা ১৫ দিনের ঝামেলামুক্ত রিটার্ন পলিসি অফার করি। পণ্য অব্যবহৃত ও আসল প্যাকেজিংসহ থাকতে হবে।" },
  { q: "ডিজিটাল পণ্য কিভাবে পাব?", a: "কেনার পর ডিজিটাল পণ্য আপনার ড্যাশবোর্ডে তাৎক্ষণিক পাওয়া যাবে। যেকোনো সময় ডাউনলোড করতে পারবেন।" },
  { q: "দেশের বাইরে শিপিং করেন?", a: "বর্তমানে আমরা শুধু বাংলাদেশে শিপিং করি। আন্তর্জাতিক শিপিং শীঘ্রই আসছে!" },
];

export function FAQSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-accent mb-2">প্রশ্ন আছে?</p>
            <h2 className="text-3xl md:text-4xl font-bold">সাধারণ জিজ্ঞাসা</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium hover:no-underline">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
