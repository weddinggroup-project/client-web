import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ComponentsDemo } from "./components-demo";

export async function ComponentsSection() {
  const t = await getTranslations("Components");

  return (
    <section id="components" className="scroll-mt-20 bg-slate-50 py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />
        <Card className="mt-12 max-w-3xl p-6 sm:p-8">
          <ComponentsDemo />
        </Card>
      </Container>
    </section>
  );
}
