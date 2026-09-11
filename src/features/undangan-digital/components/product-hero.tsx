import { Container } from "@/components/ui/container";

export function ProductHero() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(169,112,120,0.16),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(214,196,160,0.35),transparent_45%),linear-gradient(180deg,#f8f3ea_0%,#ffffff_100%)]"
        aria-hidden="true"
      />

      <Container className="relative text-center">
        <h1 className="mx-auto max-w-2xl font-serif text-3xl font-bold text-foreground sm:text-4xl">
          Undangan Digital Berbasis Website
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
          Cara Mudah Berbagi Momen Kebahagiaan Pernikahan dengan Cara yang
          Elegan.
        </p>
      </Container>
    </section>
  );
}
