"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body className="grid min-h-screen place-items-center bg-slate-950 p-6 text-center text-white">
        <main>
          <p className="text-sm font-semibold uppercase tracking-widest text-red-300">
            Critical error
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            Aplikasi belum dapat dimuat.
          </h1>
          <button
            type="button"
            className="mt-7 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950"
            onClick={reset}
          >
            Muat ulang
          </button>
        </main>
      </body>
    </html>
  );
}
