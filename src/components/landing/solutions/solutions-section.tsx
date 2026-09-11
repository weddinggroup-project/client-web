import { Container } from "@/components/ui/container";
import { solutions } from "@/components/landing/landing-data";
import { SolutionCard } from "./solution-card";

export function SolutionsSection() {
  return (
    <section id="layanan" className="scroll-mt-20 bg-muted py-20 sm:py-28">
      <Container>
        <h2 className="text-center font-serif text-2xl font-bold tracking-wide text-foreground uppercase sm:text-3xl">
          Kami Punya Solusinya!
        </h2>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {solutions.map((solution) => (
            <SolutionCard key={solution.title} {...solution} />
          ))}
        </div>
      </Container>
    </section>
  );
}
