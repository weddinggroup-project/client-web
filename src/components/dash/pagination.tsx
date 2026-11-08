import type { PageMeta } from "@/lib/vowly/types";
import { btn } from "./primitives";

export function Pagination({ meta, onPage, noun = "data" }: { meta?: PageMeta; onPage: (page: number) => void; noun?: string }) {
  if (!meta || meta.total === 0) return null;
  const from = (meta.page - 1) * meta.limit + 1;
  const to = Math.min(meta.page * meta.limit, meta.total);
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gold/40 px-4 py-3 text-xs text-ink-soft">
      <p>
        Menampilkan {from}–{to} dari {meta.total} {noun}
      </p>
      <div className="flex items-center gap-2">
        <button type="button" className={`${btn.secondary} h-8 px-3 text-xs`} disabled={!meta.has_previous} onClick={() => onPage(meta.page - 1)}>
          Sebelumnya
        </button>
        <span aria-live="polite">
          {meta.page} / {Math.max(meta.total_pages, 1)}
        </span>
        <button type="button" className={`${btn.secondary} h-8 px-3 text-xs`} disabled={!meta.has_next} onClick={() => onPage(meta.page + 1)}>
          Berikutnya
        </button>
      </div>
    </div>
  );
}
