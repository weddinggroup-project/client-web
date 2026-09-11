import { Navbar } from "@/components/landing/navbar/navbar";
import { Footer } from "@/components/landing/footer/footer";
import { ProductHero } from "@/features/undangan-digital/components/product-hero";
import { ProductBenefits } from "@/features/undangan-digital/components/product-benefits";
import { ProductShowcase } from "@/features/undangan-digital/components/product-showcase";
import { ProductSteps } from "@/features/undangan-digital/components/product-steps";
import { ProductCta } from "@/features/undangan-digital/components/product-cta";

export const metadata = {
  title: "Undangan Digital",
};

export default function UndanganDigitalPage() {
  return (
    <>
      <Navbar />
      <main>
        <ProductHero />
        <ProductBenefits />
        <ProductShowcase />
        <ProductSteps />
        <ProductCta />
      </main>
      <Footer />
    </>
  );
}
