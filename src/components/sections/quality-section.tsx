import { getTranslations } from "next-intl/server";
import { HiArrowRight, HiCheckBadge } from "react-icons/hi2";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const gates = ["ESLint", "TypeScript", "Vitest", "Playwright", "Production build"];

export async function QualitySection() {
  const t = await getTranslations("Quality");

  return (
    <section id="quality" className="scroll-mt-20 bg-white py-24 sm:py-32">
      <Container>
        <div className="overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-12 text-white sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between lg:px-16">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
              {t("eyebrow")}
            </p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
              {t("title")}
            </h2>
            <div className="mt-7 flex flex-wrap gap-3">
              {gates.map((gate) => (
                <span
                  key={gate}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-300"
                >
                  <HiCheckBadge className="size-4 text-emerald-300" aria-hidden="true" />
                  {gate}
                </span>
              ))}
            </div>
          </div>
          <ButtonLink
            href="https://nextjs.org/docs"
            className="mt-10 shrink-0 lg:mt-0"
          >
            {t("docs")}
            <HiArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
