import Link from "next/link";
import { Container } from "@/components/ui/container";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-100 bg-white py-10 text-neutral-500">
      <Container className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <Link
          href="/"
          className="rounded-md text-xl font-semibold tracking-tight text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400"
          aria-label="Ganipedia home"
        >
          gani<span className="text-blue-600">pedia</span>
        </Link>
        <p className="text-sm">Starter commerce yang siap tumbuh bersama tokomu.</p>
      </Container>
    </footer>
  );
}
