import { ArrowLeft, Home, SearchX, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#f7f9fc] px-5 py-6 text-neutral-950 sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col">
        <header className="flex h-14 items-center justify-between">
          <Link
            href="/"
            className="rounded-md text-xl font-semibold tracking-tight text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400"
            aria-label="Ganipedia home"
          >
            gani<span className="text-blue-600">pedia</span>
          </Link>
          <span className="hidden rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm font-semibold text-neutral-500 shadow-sm shadow-neutral-200/60 sm:inline-flex">
            Ganipedia Admin
          </span>
        </header>

        <section className="grid flex-1 items-center gap-6 py-10 lg:grid-cols-[1fr_420px]">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
              <span className="size-1.5 rounded-full bg-blue-600" />
              Error 404
            </span>
            <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-neutral-950 sm:text-6xl">
              Halaman tidak ditemukan di workspace ini.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-neutral-600 sm:text-lg">
              Link yang kamu buka mungkin sudah dipindahkan, belum tersedia, atau tidak termasuk route aktif di template Ganipedia.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/dashboard">
                <ArrowLeft className="size-4" aria-hidden="true" />
                Kembali ke dashboard
              </ButtonLink>
              <ButtonLink href="/" variant="secondary">
                <Home className="size-4" aria-hidden="true" />
                Beranda
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl shadow-blue-100/60">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <div>
                <p className="text-sm font-semibold text-neutral-950">Route status</p>
                <p className="mt-1 text-xs text-neutral-500">Starter admin panel</p>
              </div>
              <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-700">
                <SearchX className="size-5" aria-hidden="true" />
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {[
                ["Requested page", "Not found", "bg-rose-50 text-rose-700"],
                ["Language", "Indonesia", "bg-blue-50 text-blue-700"],
                ["Admin shell", "Ready", "bg-emerald-50 text-emerald-700"],
              ].map(([label, value, tone]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50/80 px-4 py-3"
                >
                  <span className="text-sm font-medium text-neutral-600">{label}</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-3 rounded-xl border border-neutral-100 bg-white p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                <ShieldCheck className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-neutral-950">Navigasi aman</p>
                <p className="mt-1 text-sm leading-6 text-neutral-500">
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
