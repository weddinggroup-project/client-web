import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ArchitectureSection } from "@/components/sections/architecture-section";
import { ComponentsSection } from "@/components/sections/components-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { HeroSection } from "@/components/sections/hero-section";
import { QualitySection } from "@/components/sections/quality-section";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ArchitectureSection />
        <ComponentsSection />
        <QualitySection />
      </main>
      <SiteFooter />
    </>
  );
}
