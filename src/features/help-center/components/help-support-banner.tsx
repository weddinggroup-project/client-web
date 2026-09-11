import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

const supportImage = {
  src: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1000&auto=format&fit=crop",
  alt: "Tim customer service Vowly siap membantu",
};

export function HelpSupportBanner() {
  return (
    <Container>
      <div className="grid overflow-hidden rounded-2xl bg-muted shadow-sm shadow-black/5 lg:grid-cols-2">
        <div className="flex flex-col justify-center px-8 py-10 sm:px-12 sm:py-14">
          <h2 className="font-serif text-2xl leading-snug font-bold text-foreground sm:text-3xl">
            Masih membutuhkan bantuan?
          </h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Tim concierge kami tersedia 24/7 untuk membantu Anda melalui setiap
            detail perencanaan pernikahan Anda.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button variant="rose" className="h-11 px-6">
              Hubungi Customer Service
            </Button>
            <Link
              href="#"
              className="inline-flex h-11 items-center justify-center rounded-full border border-primary/40 px-6 text-sm font-semibold text-primary transition hover:bg-secondary"
            >
              Kirim Tiket Bantuan
            </Link>
          </div>
        </div>

        <div className="relative min-h-64 lg:min-h-full">
          <Image
            src={supportImage.src}
            alt={supportImage.alt}
            fill
            unoptimized
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </Container>
  );
}
