"use client";

import { useMemo, useState } from "react";
import { DashHeader, Badge, Panel, SectionTitle, StatCard, type Tone } from "@/components/dash/primitives";
import { ErrorState, LoadingBlock } from "@/components/dash/states";
import { useResource } from "@/components/dash/use-resource";
import type { FieldDef, FormValues } from "@/components/dash/form-modal";
import { formatDate, formatRupiah } from "@/lib/vowly/format";
import type { BudgetItem, BudgetSummary, PaymentStatus } from "@/lib/vowly/types";
import { CrudTable } from "../crud/crud-table";
import { initialText, money, optionalText, text } from "../crud/payload";
import { useProjectApi } from "../project-context";

const statusLabel: Record<PaymentStatus, { label: string; tone: Tone }> = {
  belum_bayar: { label: "Belum bayar", tone: "neutral" },
  dp: { label: "DP", tone: "warning" },
  lunas: { label: "Lunas", tone: "success" },
};
const statusOptions = Object.entries(statusLabel).map(([value, { label }]) => ({ value, label }));

const fields: FieldDef[] = [
  { kind: "text", name: "name", label: "Nama pos", required: true, maxLength: 200, span: 2 },
  { kind: "text", name: "category", label: "Kategori", maxLength: 80, placeholder: "Katering, Dekorasi…" },
  { kind: "select", name: "payment_status", label: "Status bayar", options: statusOptions },
  { kind: "money", name: "estimated_amount", label: "Estimasi" },
  { kind: "money", name: "actual_amount", label: "Aktual" },
  { kind: "date", name: "due_date", label: "Jatuh tempo" },
  { kind: "text", name: "source_account", label: "Sumber dana", maxLength: 120 },
  { kind: "textarea", name: "notes", label: "Catatan", maxLength: 1000, span: 2 },
];

/** Estimated vs actual amount per budget category, largest estimate first. */
export function groupByCategory(items: Pick<BudgetItem, "category" | "estimated_amount" | "actual_amount">[]) {
  const map = new Map<string, { category: string; estimated: number; actual: number }>();
  for (const item of items) {
    const key = item.category || "Lainnya";
    const row = map.get(key) ?? { category: key, estimated: 0, actual: 0 };
    row.estimated += item.estimated_amount;
    row.actual += item.actual_amount;
    map.set(key, row);
  }
  return [...map.values()].sort((a, b) => b.estimated - a.estimated);
}

function AllocationChart({ items }: { items: BudgetItem[] }) {
  const rows = useMemo(() => groupByCategory(items), [items]);
  const max = Math.max(1, ...rows.map((row) => Math.max(row.estimated, row.actual)));
  return (
    <Panel>
      <SectionTitle
        title="Alokasi Budget vs Realisasi Pengeluaran"
        aside={
          <p className="flex gap-3 text-[11px] text-ink-soft">
            <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-gold" /> Alokasi Anggaran</span>
            <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-primary" /> Realisasi Terpakai</span>
          </p>
        }
      />
      {rows.length === 0 ? (
        <p className="text-sm text-ink-soft">Belum ada pos anggaran. Tambahkan pos untuk melihat perbandingannya.</p>
      ) : (
        <ul className="space-y-4">
          {rows.map((row) => (
            <li key={row.category}>
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2 text-sm">
                <span className="font-medium">{row.category}</span>
                <span className="text-xs text-ink-soft">
                  {formatRupiah(row.actual)} / {formatRupiah(row.estimated)}
                </span>
              </div>
              <div className="relative h-3 overflow-hidden rounded-full bg-gold/30" role="img" aria-label={`${row.category}: terpakai ${formatRupiah(row.actual)} dari ${formatRupiah(row.estimated)}`}>
                <div className="absolute inset-y-0 left-0 rounded-full bg-gold" style={{ width: `${(row.estimated / max) * 100}%` }} />
                <div className="absolute inset-y-0 left-0 rounded-full bg-primary" style={{ width: `${(row.actual / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

export function BudgetView() {
  const path = useProjectApi();
  const summary = useResource<BudgetSummary>(path("/budget-summary"));
  const [tick, setTick] = useState(0);
  const all = useResource<BudgetItem[]>(path("/budget-items"), { limit: 100, _r: tick || undefined });

  const data = summary.data;
  const usedPct = data && data.total_budget > 0 ? Math.round((data.actual_total / data.total_budget) * 1000) / 10 : 0;
  const remainingPct = data && data.total_budget > 0 ? Math.round((data.remaining / data.total_budget) * 1000) / 10 : 0;
  return (
    <>
      <DashHeader
        eyebrow="Manajemen Finansial Pernikahan"
        title="Rencana Anggaran & Realisasi Pengeluaran"
        description="Pantau alokasi dana pernikahan agar tetap terukur, transparan, dan terhindar dari over-budget."
      />

      {summary.loading ? (
        <LoadingBlock rows={2} />
      ) : summary.error || !data ? (
        <ErrorState error={summary.error} onRetry={summary.reload} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Plafon Anggaran" value={formatRupiah(data.total_budget)} hint="Plafon diatur di menu Profile" />
          <StatCard label="Realisasi / Biaya Aktual" value={formatRupiah(data.actual_total)} hint={`${usedPct}% dari plafon`} />
          <StatCard label="Sisa Cadangan Kas" value={formatRupiah(data.remaining)} tone={data.over_budget ? "danger" : "success"} hint={`${remainingPct}% siap dialokasikan`} />
          <StatCard
            label="Status Anggaran"
            value={<Badge tone={data.over_budget ? "danger" : "success"}>{data.status}</Badge>}
            hint={data.items_over_estimate > 0 ? `${data.items_over_estimate} pos melebihi estimasi` : "Tidak ada deviasi defisit pada pos utama"}
          />
        </div>
      )}

      <div className="mt-6">
        {all.error ? <ErrorState error={all.error} onRetry={all.reload} /> : <AllocationChart items={all.data ?? []} />}
      </div>

      <div className="mb-3 mt-8">
        <h2 className="font-serif text-xl font-semibold">Tabel Pengeluaran Detail</h2>
        <p className="text-xs text-ink-soft">Rincian kontrak vendor, uang muka, dan termin pelunasan.</p>
      </div>
      <div>
        <CrudTable<BudgetItem>
          resource="/budget-items"
          noun="pos anggaran"
          searchable={false}
          refreshKey={tick}
          onChanged={() => {
            summary.reload();
            setTick((value) => value + 1);
          }}
          filters={[{ name: "payment_status", label: "Semua status", options: statusOptions }]}
          columns={[
            { header: "Pos", cell: (row) => <span className="font-medium">{row.name}</span> },
            { header: "Kategori", cell: (row) => row.category || "-" },
            { header: "Estimasi", cell: (row) => formatRupiah(row.estimated_amount), className: "text-right" },
            { header: "Aktual", cell: (row) => formatRupiah(row.actual_amount), className: "text-right" },
            { header: "Status", cell: (row) => <Badge tone={statusLabel[row.payment_status].tone}>{statusLabel[row.payment_status].label}</Badge> },
            { header: "Jatuh tempo", cell: (row) => formatDate(row.due_date, "short") },
          ]}
          fields={fields}
          toInitial={(row): FormValues => ({
            name: row?.name ?? "",
            category: row?.category ?? "",
            payment_status: row?.payment_status ?? "belum_bayar",
            estimated_amount: initialText(row?.estimated_amount ?? ""),
            actual_amount: initialText(row?.actual_amount ?? ""),
            due_date: row?.due_date?.slice(0, 10) ?? "",
            source_account: row?.source_account ?? "",
            notes: row?.notes ?? "",
          })}
          toPayload={(values, mode) => ({
            name: text(values, "name"),
            category: text(values, "category"),
            payment_status: text(values, "payment_status"),
            estimated_amount: money(values, "estimated_amount"),
            actual_amount: money(values, "actual_amount"),
            due_date: optionalText(values, "due_date", mode),
            source_account: optionalText(values, "source_account", mode),
            notes: optionalText(values, "notes", mode),
          })}
        />
      </div>
    </>
  );
}
