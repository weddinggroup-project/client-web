"use client";

import { useState } from "react";
import { DashHeader, Badge, Panel, ProgressBar, StatCard, type Tone } from "@/components/dash/primitives";
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

export function BudgetView() {
  const path = useProjectApi();
  const summary = useResource<BudgetSummary>(path("/budget-summary"));
  const [tick, setTick] = useState(0);

  const data = summary.data;
  return (
    <>
      <DashHeader eyebrow="Budget" title="Anggaran & Pengeluaran" description="Pantau estimasi dan realisasi tiap pos. Total anggaran diatur di menu Profile." />

      {summary.loading ? (
        <LoadingBlock rows={2} />
      ) : summary.error || !data ? (
        <ErrorState error={summary.error} onRetry={summary.reload} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total anggaran" value={formatRupiah(data.total_budget)} />
            <StatCard label="Estimasi pos" value={formatRupiah(data.estimated_total)} hint={data.items_over_estimate > 0 ? `${data.items_over_estimate} pos melebihi estimasi` : undefined} />
            <StatCard label="Terpakai" value={formatRupiah(data.actual_total)} />
            <StatCard label="Sisa" value={formatRupiah(data.remaining)} tone={data.over_budget ? "danger" : "success"} hint={data.status} />
          </div>
          <Panel className="mt-4">
            <ProgressBar value={data.actual_total} max={data.total_budget} tone={data.over_budget ? "danger" : "primary"} />
          </Panel>
        </>
      )}

      <div className="mt-6">
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
