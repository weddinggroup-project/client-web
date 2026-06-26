import { getTranslations } from "next-intl/server";
import {
  HiOutlineBeaker,
  HiOutlineBolt,
  HiOutlineCloudArrowUp,
  HiOutlineCommandLine,
  HiOutlineLanguage,
  HiOutlineShieldCheck,
} from "react-icons/hi2";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export async function FeaturesSection() {
  const t = await getTranslations("Features");
  const features = [
    { icon: HiOutlineBolt, title: t("serverTitle"), description: t("serverDescription") },
    { icon: HiOutlineShieldCheck, title: t("authTitle"), description: t("authDescription") },
    { icon: HiOutlineLanguage, title: t("i18nTitle"), description: t("i18nDescription") },
    { icon: HiOutlineCommandLine, title: t("apiTitle"), description: t("apiDescription") },
    { icon: HiOutlineBeaker, title: t("uiTitle"), description: t("uiDescription") },
    {
      icon: HiOutlineCloudArrowUp,
      title: t("qualityTitle"),
      description: t("qualityDescription"),
    },
  ];

  return (
    <section id="features" className="scroll-mt-20 bg-white py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />
        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <article key={title} className="bg-white p-7 sm:p-8">
              <div className="grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-950">
                {title}
              </h3>
              <p className="mt-2 leading-7 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
