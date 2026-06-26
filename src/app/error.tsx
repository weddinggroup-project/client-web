"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 p-6 text-center text-white">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-300">
          Terjadi kendala
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          Halaman ini belum dapat dimuat.
        </h1>
        <p className="mt-4 text-slate-400">
          Error sudah tercatat. Silakan coba sekali lagi.
        </p>
        <Button className="mt-7" onClick={reset}>
          Coba lagi
        </Button>
      </div>
    </main>
  );
}
