import { Container } from "@/components/ui/container";
import { painPoints } from "@/components/landing/landing-data";

export function ProblemSection() {
  return (
    <section id="konten" className="scroll-mt-20 bg-background py-20 sm:py-28">
      <Container className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
        <div>
          <h2 className="text-pretty font-serif text-2xl leading-snug font-semibold text-accent sm:text-3xl">
            Apakah kamu sedang merencakan pernikahan dan sedang berada dalam
            situasi ini?
          </h2>
          <span className="mt-4 block h-1 w-12 rounded-full bg-accent/40" aria-hidden="true" />
        </div>

        <ul className="flex flex-col gap-5 lg:border-l lg:border-border lg:pl-12">
          {painPoints.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3">
              <Icon className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
              <p className="text-base text-foreground/80">{text}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
