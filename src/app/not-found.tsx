import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 p-6 text-center text-white">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
          404
        </p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight">
          Halaman tidak ditemukan.
        </h1>
        <p className="mt-4 text-slate-400">
          Halamannya mungkin pindah, atau alamatnya sedikit terlalu kreatif.
        </p>
        <ButtonLink href="/" className="mt-8">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Kembali ke beranda
        </ButtonLink>
      </div>
    </main>
  );
}
