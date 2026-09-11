import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { productBenefits } from "../undangan-digital-data";

export function ProductBenefits() {
  return (
    <section className="bg-background py-20 sm:py-24">
      <Container>
        <h2 className="mx-auto max-w-2xl text-center text-lg font-semibold text-foreground uppercase sm:text-xl">
          Apa saja keunggulan undangan digital dibanding undangan konvensional?
        </h2>
        <span
          className="mx-auto mt-4 block h-1 w-12 rounded-full bg-accent/40"
          aria-hidden="true"
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {productBenefits.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="group flex h-full flex-col items-center rounded-2xl border-card-border p-6 text-center shadow-sm shadow-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10"
            >
              <span className="grid size-12 place-items-center rounded-full bg-secondary text-accent transition-transform duration-300 group-hover:scale-110">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-sm font-semibold tracking-wide text-foreground uppercase">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
