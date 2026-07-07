import { HiArrowRight, HiCheckBadge } from "react-icons/hi2";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const gates = ["ESLint", "TypeScript", "Vitest", "Playwright", "Production build"];

export function QualitySection() {
  return (
    <section id="quality" className="scroll-mt-20 bg-white py-20 sm:py-28">
      <Container>
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-[#f7f9fc] px-6 py-12 text-neutral-950 shadow-sm shadow-neutral-200/50 sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between lg:px-16">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Siap untuk dikembangkan
            </p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Quality gate sudah tersambung untuk workflow starter.
            </h2>
            <div className="mt-7 flex flex-wrap gap-3">
              {gates.map((gate) => (
                <span
                  key={gate}
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-600"
                >
                  <HiCheckBadge className="size-4 text-emerald-500" aria-hidden="true" />
                  {gate}
                </span>
              ))}
            </div>
          </div>
          <ButtonLink
            href="https://nextjs.org/docs"
            className="mt-10 shrink-0 lg:mt-0"
          >
            Baca dokumentasi
            <HiArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
