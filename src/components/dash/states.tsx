import type { ReactNode } from "react";
import { HiOutlineExclamationTriangle, HiOutlineInbox } from "react-icons/hi2";
import { ApiError } from "@/lib/vowly/client";
import { btn } from "./primitives";

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-gold/40 text-gold-foreground">
        <HiOutlineInbox className="size-6" aria-hidden />
      </span>
      <p className="font-semibold text-ink">{title}</p>
      {description ? <p className="max-w-sm text-sm text-ink-soft">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

/** Shows an API error. A 403 means the dashboard is still locked until the order is paid. */
export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const message = error instanceof ApiError ? error.message : "Terjadi kesalahan. Coba lagi.";
  const locked = error instanceof ApiError && error.status === 403;
  return (
    <div role="alert" className="flex flex-col items-center gap-2 px-4 py-12 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-red-50 text-red-600">
        <HiOutlineExclamationTriangle className="size-6" aria-hidden />
      </span>
      <p className="font-semibold text-ink">{locked ? "Fitur ini belum dibuka" : "Gagal memuat data"}</p>
      <p className="max-w-sm text-sm text-ink-soft">{message}</p>
      {onRetry && !locked ? (
        <button type="button" onClick={onRetry} className={`${btn.secondary} mt-2`}>
          Coba lagi
        </button>
      ) : null}
    </div>
  );
}

export function LoadingBlock({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-4" aria-busy="true" aria-live="polite">
      <span className="sr-only">Memuat…</span>
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="h-12 animate-pulse rounded-xl bg-gold/25" />
      ))}
    </div>
  );
}
