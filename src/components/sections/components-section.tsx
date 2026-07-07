import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ComponentsDemo } from "./components-demo";

export function ComponentsSection() {
  return (
    <section id="components" className="scroll-mt-20 bg-[#f7f9fc] py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Component showcase"
          title="Kontrol form admin yang match dengan dashboard."
          description="Select dan date picker memakai visual language yang sama dengan orders, products, profile, dan settings."
        />
        <Card className="mt-12 max-w-3xl rounded-xl border-neutral-200/70 bg-white p-6 shadow-sm shadow-neutral-200/50 sm:p-8">
          <ComponentsDemo />
        </Card>
      </Container>
    </section>
  );
}
