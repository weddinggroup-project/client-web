"use client";

import { useState } from "react";
import { Badge, DashHeader, Panel, ProgressBar, SectionTitle, StatCard, type Tone } from "@/components/dash/primitives";
import type { FieldDef, FormValues } from "@/components/dash/form-modal";
import { useResource } from "@/components/dash/use-resource";
import type { EmergencyContact, EventSession, SessionSummary, TaskPriority, Vendor } from "@/lib/vowly/types";
import { CrudTable } from "../crud/crud-table";
import { initialText, integer, optionalText, text } from "../crud/payload";
import { useProjectApi } from "../project-context";

const priorities: Record<TaskPriority, { label: string; tone: Tone }> = {
  rendah: { label: "Rendah", tone: "neutral" },
  sedang: { label: "Sedang", tone: "gold" },
  tinggi: { label: "Tinggi", tone: "danger" },
};

export function PersiapanView() {
  const path = useProjectApi();
  const [tick, setTick] = useState(0);
  const summary = useResource<SessionSummary>(path("/sessions-summary"), { _r: tick || undefined });
  const vendors = useResource<Vendor[]>(path("/vendors"), { limit: 100 });

  const fields: FieldDef[] = [
    { kind: "text", name: "name", label: "Nama sesi", required: true, maxLength: 150, span: 2, placeholder: "Akad Nikah" },
    { kind: "time", name: "start_time", label: "Mulai", required: true },
    { kind: "time", name: "end_time", label: "Selesai", required: true },
    { kind: "text", name: "location", label: "Lokasi", maxLength: 200 },
    { kind: "text", name: "pic_name", label: "PIC", maxLength: 100 },
    { kind: "text", name: "phase", label: "Fase", maxLength: 80 },
    { kind: "text", name: "category", label: "Kategori", maxLength: 80 },
    { kind: "select", name: "priority", label: "Prioritas", options: Object.entries(priorities).map(([value, { label }]) => ({ value, label })) },
    { kind: "number", name: "sort_order", label: "Urutan", min: 0 },
    { kind: "multi", name: "vendor_ids", label: "Vendor bertugas", span: 2, options: (vendors.data ?? []).map((vendor) => ({ value: vendor.id, label: vendor.name })) },
    { kind: "textarea", name: "notes", label: "Catatan", maxLength: 2000, span: 2 },
  ];

  return (
    <>
      <DashHeader eyebrow="Persiapan" title="Timeline & Milestone" description="Susun rundown acara dan kontak darurat hari-H. Sesi dianggap siap bila punya PIC, lokasi, dan minimal satu vendor." />

      {summary.data ? (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <StatCard label="Total sesi" value={summary.data.total} />
          <StatCard label="Sesi siap" value={summary.data.ready} />
          <div className="rounded-2xl border border-gold/50 bg-white p-4">
            <p className="text-[11px] font-medium tracking-[0.1em] text-ink-soft uppercase">Kesiapan</p>
            <p className="mt-2 font-serif text-2xl font-semibold">{summary.data.ready_percent}%</p>
            <div className="mt-2">
              <ProgressBar value={summary.data.ready_percent} />
            </div>
          </div>
        </div>
      ) : null}

      <CrudTable<EventSession>
        resource="/sessions"
        noun="sesi"
        refreshKey={tick}
        onChanged={() => setTick((value) => value + 1)}
        columns={[
          { header: "Sesi", cell: (row) => <span className="font-medium">{row.name}</span> },
          { header: "Waktu", cell: (row) => `${row.start_time}–${row.end_time}` },
          { header: "Lokasi", cell: (row) => row.location || "-" },
          { header: "PIC", cell: (row) => row.pic_name || "-" },
          { header: "Vendor", cell: (row) => row.vendor_ids.length },
          { header: "Prioritas", cell: (row) => <Badge tone={priorities[row.priority].tone}>{priorities[row.priority].label}</Badge> },
        ]}
        fields={fields}
        toInitial={(row): FormValues => ({
          name: row?.name ?? "",
          start_time: row?.start_time?.slice(0, 5) ?? "",
          end_time: row?.end_time?.slice(0, 5) ?? "",
          location: row?.location ?? "",
          pic_name: row?.pic_name ?? "",
          phase: row?.phase ?? "",
          category: row?.category ?? "",
          priority: row?.priority ?? "sedang",
          sort_order: initialText(row?.sort_order ?? 0),
          vendor_ids: row?.vendor_ids ?? [],
          notes: row?.notes ?? "",
        })}
        toPayload={(values, mode) => ({
          name: text(values, "name"),
          start_time: text(values, "start_time"),
          end_time: text(values, "end_time"),
          location: text(values, "location"),
          pic_name: text(values, "pic_name"),
          phase: text(values, "phase"),
          category: text(values, "category"),
          priority: text(values, "priority"),
          sort_order: integer(values, "sort_order") ?? 0,
          vendor_ids: Array.isArray(values.vendor_ids) ? values.vendor_ids : [],
          notes: optionalText(values, "notes", mode),
        })}
      />

      <div className="mt-8">
        <Panel className="mb-4 border-0 bg-transparent p-0 shadow-none sm:p-0">
          <SectionTitle eyebrow="Hari-H" title="Kontak darurat" />
        </Panel>
        <CrudTable<EmergencyContact>
          resource="/emergency-contacts"
          noun="kontak"
          columns={[
            { header: "Nama", cell: (row) => <span className="font-medium">{row.name}</span> },
            { header: "Peran", cell: (row) => row.role || "-" },
            { header: "Telepon", cell: (row) => row.phone },
          ]}
          fields={[
            { kind: "text", name: "name", label: "Nama", required: true, maxLength: 150 },
            { kind: "text", name: "role", label: "Peran", maxLength: 80, placeholder: "Koordinator, Keluarga…" },
            { kind: "tel", name: "phone", label: "Telepon", required: true, maxLength: 32, span: 2 },
          ]}
          toInitial={(row): FormValues => ({ name: row?.name ?? "", role: row?.role ?? "", phone: row?.phone ?? "" })}
          toPayload={(values) => ({ name: text(values, "name"), role: text(values, "role"), phone: text(values, "phone") })}
        />
      </div>
    </>
  );
}
