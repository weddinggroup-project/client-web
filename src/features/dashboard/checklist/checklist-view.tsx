"use client";

import { DashHeader, Badge, type Tone } from "@/components/dash/primitives";
import type { FieldDef, FormValues } from "@/components/dash/form-modal";
import { formatDate, formatRupiah } from "@/lib/vowly/format";
import type { ChecklistItem, TaskPriority, TaskStatus } from "@/lib/vowly/types";
import { CrudTable } from "../crud/crud-table";
import { initialText, optionalText, text } from "../crud/payload";

const statuses: Record<TaskStatus, { label: string; tone: Tone }> = {
  belum_mulai: { label: "Belum mulai", tone: "neutral" },
  dalam_koordinasi: { label: "Dalam koordinasi", tone: "warning" },
  terverifikasi_pic: { label: "Terverifikasi PIC", tone: "gold" },
  selesai: { label: "Selesai", tone: "success" },
};
const priorities: Record<TaskPriority, { label: string; tone: Tone }> = {
  rendah: { label: "Rendah", tone: "neutral" },
  sedang: { label: "Sedang", tone: "gold" },
  tinggi: { label: "Tinggi", tone: "danger" },
};
const toOptions = (map: Record<string, { label: string }>) => Object.entries(map).map(([value, { label }]) => ({ value, label }));

const fields: FieldDef[] = [
  { kind: "text", name: "title", label: "Tugas", required: true, maxLength: 200, span: 2 },
  { kind: "text", name: "phase", label: "Fase", maxLength: 80, placeholder: "H-90, H-30…" },
  { kind: "text", name: "category", label: "Kategori", maxLength: 80 },
  { kind: "text", name: "pic_name", label: "PIC", maxLength: 100 },
  { kind: "select", name: "priority", label: "Prioritas", options: toOptions(priorities) },
  { kind: "select", name: "status", label: "Status", options: toOptions(statuses) },
  { kind: "date", name: "due_date", label: "Tenggat" },
  { kind: "money", name: "cost_amount", label: "Biaya", hint: "Biaya > 0 otomatis membuat pos anggaran." },
  { kind: "textarea", name: "notes", label: "Catatan", maxLength: 1000, span: 2 },
];

export function ChecklistView() {
  return (
    <>
      <DashHeader eyebrow="Checklist" title="Daftar Tugas" description="Pantau tugas persiapan per fase dan PIC. Biaya tugas tersinkron ke Budget." />
      <CrudTable<ChecklistItem>
        resource="/checklist-items"
        noun="tugas"
        searchable={false}
        filters={[
          { name: "status", label: "Semua status", options: toOptions(statuses) },
          {
            name: "filter",
            label: "Semua tugas",
            options: [
              { value: "due_soon", label: "Segera jatuh tempo" },
              { value: "coordinating", label: "Dalam koordinasi" },
              { value: "pic_verified", label: "Terverifikasi PIC" },
            ],
          },
        ]}
        columns={[
          { header: "Tugas", cell: (row) => <span className="font-medium">{row.title}</span> },
          { header: "Fase", cell: (row) => row.phase || "-" },
          { header: "PIC", cell: (row) => row.pic_name || "-" },
          { header: "Prioritas", cell: (row) => <Badge tone={priorities[row.priority].tone}>{priorities[row.priority].label}</Badge> },
          { header: "Status", cell: (row) => <Badge tone={statuses[row.status].tone}>{statuses[row.status].label}</Badge> },
          { header: "Tenggat", cell: (row) => formatDate(row.due_date, "short") },
          { header: "Biaya", cell: (row) => (row.cost_amount ? formatRupiah(row.cost_amount) : "-"), className: "text-right" },
        ]}
        fields={fields}
        toInitial={(row): FormValues => ({
          title: row?.title ?? "",
          phase: row?.phase ?? "",
          category: row?.category ?? "",
          pic_name: row?.pic_name ?? "",
          priority: row?.priority ?? "sedang",
          status: row?.status ?? "belum_mulai",
          due_date: row?.due_date?.slice(0, 10) ?? "",
          cost_amount: initialText(row?.cost_amount),
          notes: row?.notes ?? "",
        })}
        toPayload={(values, mode) => {
          const cost = text(values, "cost_amount").replace(/[.\s]/g, "");
          return {
            title: text(values, "title"),
            phase: text(values, "phase"),
            category: text(values, "category"),
            pic_name: text(values, "pic_name"),
            priority: text(values, "priority"),
            status: text(values, "status"),
            due_date: optionalText(values, "due_date", mode),
            cost_amount: cost === "" ? undefined : /^\d+$/.test(cost) ? Number(cost) : undefined,
            notes: optionalText(values, "notes", mode),
          };
        }}
      />
    </>
  );
}
