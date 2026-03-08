import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/landing/HeroSection";
import { TrustBadges } from "@/components/landing/TrustBadges";
import { CategoriesSection } from "@/components/landing/CategoriesSection";
import { FeaturedProducts } from "@/components/landing/FeaturedProducts";
import { PromoBanners } from "@/components/landing/PromoBanners";
import { VideoCarousel } from "@/components/landing/VideoCarousel";
import { TrendingSection } from "@/components/landing/TrendingSection";
import { BrandsMarquee } from "@/components/landing/BrandsMarquee";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { NewsletterSection } from "@/components/landing/NewsletterSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { Footer } from "@/components/layout/Footer";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <TrustBadges />
      <CategoriesSection />
      <FeaturedProducts />
      <PromoBanners />
      <VideoCarousel />
      <TrendingSection />
      <BrandsMarquee />
      <TestimonialsSection />
      <NewsletterSection />
      <FAQSection />
      <Footer />
    </Layout>
  );
};

export default Index;
