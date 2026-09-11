import { ArrowLeft, Home, SearchX, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background px-5 py-6 text-foreground sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col">
        <header className="flex h-14 items-center justify-between">
          <Link
            href="/"
            className="rounded-md font-serif text-xl font-semibold text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
            aria-label="Vowly home"
          >
            Vowly
          </Link>
          <span className="hidden rounded-full border border-border bg-background px-3 py-1.5 text-sm font-semibold text-muted-foreground shadow-sm sm:inline-flex">
            Vowly
          </span>
        </header>

        <section className="grid flex-1 items-center gap-6 py-10 lg:grid-cols-[1fr_420px]">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-secondary bg-secondary px-3 py-1 text-xs font-semibold tracking-wide text-primary uppercase">
              <span className="size-1.5 rounded-full bg-primary" />
              Error 404
            </span>
            <h1 className="mt-6 text-balance font-serif text-5xl font-semibold leading-[1.02] text-foreground sm:text-6xl">
              Halaman tidak ditemukan.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Link yang kamu buka mungkin sudah dipindahkan, belum tersedia,
              atau tidak termasuk route aktif di platform Vowly.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/dashboard" variant="rose">
                <ArrowLeft className="size-4" aria-hidden="true" />
                Kembali ke dashboard
              </ButtonLink>
              <ButtonLink href="/" variant="secondary">
                <Home className="size-4" aria-hidden="true" />
                Beranda
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-2xl border border-card-border bg-card p-4 shadow-xl shadow-secondary/60">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <p className="text-sm font-semibold text-foreground">Status route</p>
                <p className="mt-1 text-xs text-muted-foreground">Starter admin panel</p>
              </div>
              <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
                <SearchX className="size-5" aria-hidden="true" />
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {[
                ["Halaman diminta", "Tidak ditemukan", "bg-error/10 text-error"],
                ["Bahasa", "Indonesia", "bg-secondary text-primary"],
                ["Admin shell", "Siap", "bg-success/10 text-success"],
              ].map(([label, value, tone]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-xl border border-border bg-muted/60 px-4 py-3"
                >
                  <span className="text-sm font-medium text-muted-foreground">{label}</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-3 rounded-xl border border-border bg-background p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-success/10 text-success">
                <ShieldCheck className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Navigasi aman</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Gunakan dashboard atau beranda untuk kembali ke flow utama.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
