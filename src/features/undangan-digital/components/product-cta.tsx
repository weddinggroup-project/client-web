import Link from "next/link";
import { Container } from "@/components/ui/container";

export function ProductCta() {
  return (
    <section className="bg-muted py-20 sm:py-24">
      <Container className="text-center">
        <h2 className="mx-auto max-w-2xl font-serif text-xl leading-snug font-bold text-foreground uppercase sm:text-2xl">
          Tertarik? Pesan Sekarang Dan Lihat Paket Yang Sesuai Dengan
          Kebutuhan Mu
        </h2>

        <Link
          href="/undangan-digital/pesan"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-primary px-10 text-xs font-semibold tracking-wide text-primary-foreground uppercase shadow-lg shadow-primary/20 transition hover:scale-[1.02] hover:bg-primary-hover active:scale-[0.98]"
        >
          Pesan
        </Link>
      </Container>
    </section>
  );
}
