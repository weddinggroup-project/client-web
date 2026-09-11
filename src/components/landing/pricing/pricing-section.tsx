import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";

export function PricingSection() {
  return (
    <section id="kerjasama" className="scroll-mt-20 bg-background py-20 sm:py-28">
      <Container className="text-center">
        <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
          Mari Mulai Rencanakan Pernikahanmu
        </h2>

        <Card className="mx-auto mt-10 max-w-md rounded-2xl border-card-border p-8 shadow-lg shadow-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-10">
          <svg
            className="mx-auto h-3 w-16 text-accent/50"
            viewBox="0 0 64 12"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 9c8-9 16 2 24-4s16 2 24-4s10 4 10 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          <p className="mt-2 text-sm font-medium text-muted-foreground">
            Mulai Dengan Harga
          </p>
          <p className="mt-3 font-serif text-4xl font-bold text-primary">
            Rp. 220.000
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Atur rencana mu dengan matang dari sekarang.
          </p>

          <ButtonLink
            href="/sign-in"
            variant="rose"
            className="mt-7 h-11 w-full px-8"
          >
            Mulai Sekarang
          </ButtonLink>
        </Card>
      </Container>
    </section>
  );
}
