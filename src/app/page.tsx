import { Navbar } from "@/components/landing/navbar/navbar";
import { HeroSection } from "@/components/landing/hero/hero-section";
import { ProblemSection } from "@/components/landing/problem/problem-section";
import { SolutionsSection } from "@/components/landing/solutions/solutions-section";
import { ShowcaseSection } from "@/components/landing/showcase/showcase-section";
import { TestimonialsSection } from "@/components/landing/testimonials/testimonials-section";
import { PricingSection } from "@/components/landing/pricing/pricing-section";
import { Footer } from "@/components/landing/footer/footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionsSection />
        <ShowcaseSection />
        <TestimonialsSection />
        <PricingSection />
      </main>
      <Footer />
    </>
  );
}
