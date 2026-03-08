import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturedProducts } from "@/components/landing/FeaturedProducts";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { Footer } from "@/components/layout/Footer";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturedProducts />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </Layout>
  );
};

export default Index;
