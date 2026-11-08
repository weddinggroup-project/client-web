"use client";

import { useMemo, useState } from "react";
import { Badge, DashHeader, SectionTitle, type Tone } from "@/components/dash/primitives";
import type { FieldDef, FormValues } from "@/components/dash/form-modal";
import { useResource } from "@/components/dash/use-resource";
import { Panel } from "@/components/dash/primitives";
import type { EventSession, Guest, RsvpStatus, SeatingTable } from "@/lib/vowly/types";
import { CrudTable } from "../crud/crud-table";
import { initialText, integer, optionalText, text } from "../crud/payload";
import { useProjectApi } from "../project-context";

const NIL_UUID = "00000000-0000-0000-0000-000000000000";

const rsvp: Record<RsvpStatus, { label: string; tone: Tone }> = {
  belum_respons: { label: "Belum respons", tone: "neutral" },
  hadir: { label: "Hadir", tone: "success" },
  tidak_hadir: { label: "Tidak hadir", tone: "danger" },
};
const rsvpOptions = Object.entries(rsvp).map(([value, { label }]) => ({ value, label }));

function TablesPanel({ onChanged, tables }: { onChanged: () => void; tables: SeatingTable[] }) {
  return (
    <div className="mb-6">
      <SectionTitle eyebrow="Seating" title="Meja" />
      <CrudTable<SeatingTable>
        resource="/tables"
        noun="meja"
        pageSize={20}
        onChanged={onChanged}
        refreshKey={tables.length}
        columns={[
          { header: "Meja", cell: (row) => <span className="font-medium">{row.name}</span> },
          { header: "Kapasitas", cell: (row) => row.capacity },
          { header: "Terisi", cell: (row) => <span className={row.over_capacity ? "font-semibold text-red-700" : ""}>{row.used_pax}</span> },
          { header: "Tipe", cell: (row) => (row.is_vip ? <Badge tone="gold">VIP</Badge> : "Reguler") },
          { header: "Peringatan", cell: (row) => (row.over_capacity ? <Badge tone="danger">Melebihi kapasitas</Badge> : "-") },
        ]}
        fields={[
          { kind: "text", name: "name", label: "Nama meja", required: true, maxLength: 100 },
          { kind: "number", name: "capacity", label: "Kapasitas", required: true, min: 1, max: 1000 },
          { kind: "checkbox", name: "is_vip", label: "Meja VIP" },
        ]}
        toInitial={(row): FormValues => ({ name: row?.name ?? "", capacity: initialText(row?.capacity ?? 10), is_vip: row?.is_vip ?? false })}
        toPayload={(values) => ({ name: text(values, "name"), capacity: integer(values, "capacity"), is_vip: values.is_vip === true })}
      />
    </div>
  );
}

export function GuestsView() {
  const path = useProjectApi();
  const [tick, setTick] = useState(0);
  const tablesRes = useResource<SeatingTable[]>(path("/tables"), { limit: 100, _r: tick || undefined });
  const sessionsRes = useResource<EventSession[]>(path("/sessions"), { limit: 100 });
  const tables = useMemo(() => tablesRes.data ?? [], [tablesRes.data]);
  const sessions = useMemo(() => sessionsRes.data ?? [], [sessionsRes.data]);
  const tableName = (id: string | null) => tables.find((table) => table.id === id)?.name ?? "-";

  const fields: FieldDef[] = [
    { kind: "text", name: "full_name", label: "Nama lengkap", required: true, maxLength: 150 },
    { kind: "text", name: "display_name", label: "Sapaan di undangan", maxLength: 150, hint: "Kosong = sama dengan nama lengkap." },
    { kind: "text", name: "category", label: "Kategori", maxLength: 60, placeholder: "Keluarga, Teman…" },
    { kind: "tel", name: "phone", label: "WhatsApp", maxLength: 32, placeholder: "081234567890" },
    { kind: "number", name: "pax", label: "Jumlah orang (pax)", min: 1, max: 1000 },
    { kind: "select", name: "rsvp_status", label: "RSVP", options: rsvpOptions },
    { kind: "select", name: "table_id", label: "Meja", emptyLabel: "Belum ditentukan", options: tables.map((table) => ({ value: table.id, label: table.name })) },
    { kind: "textarea", name: "dietary_notes", label: "Catatan makanan", maxLength: 500 },
    { kind: "multi", name: "session_ids", label: "Sesi yang dihadiri", span: 2, options: sessions.map((session) => ({ value: session.id, label: session.name })) },
  ];

  return (
    <>
      <DashHeader eyebrow="Guest List" title="Tamu & RSVP" description="Kelola daftar tamu, meja, dan status kehadiran. Pengiriman undangan ada di menu Undangan." />
      <TablesPanel tables={tables} onChanged={() => setTick((value) => value + 1)} />
      <Panel className="mb-4 p-0 sm:p-0 border-0 shadow-none bg-transparent">
        <SectionTitle eyebrow="Tamu" title="Daftar tamu" />
      </Panel>
      <CrudTable<Guest>
        resource="/guests"
        noun="tamu"
        searchable
        refreshKey={tick}
        filters={[{ name: "rsvp_status", label: "Semua RSVP", options: rsvpOptions }, { name: "table_id", label: "Semua meja", options: tables.map((table) => ({ value: table.id, label: table.name })) }]}
        columns={[
          { header: "Nama", cell: (row) => <><span className="font-medium">{row.full_name}</span>{row.display_name !== row.full_name ? <span className="block text-xs text-ink-soft">{row.display_name}</span> : null}</> },
          { header: "Kategori", cell: (row) => row.category || "-" },
          { header: "WhatsApp", cell: (row) => row.phone || "-" },
          { header: "Pax", cell: (row) => row.pax },
          { header: "Meja", cell: (row) => tableName(row.table_id) },
          { header: "RSVP", cell: (row) => <Badge tone={rsvp[row.rsvp_status].tone}>{rsvp[row.rsvp_status].label}</Badge> },
        ]}
        fields={fields}
        toInitial={(row): FormValues => ({
          full_name: row?.full_name ?? "",
          display_name: row && row.display_name !== row.full_name ? row.display_name : "",
          category: row?.category ?? "",
          phone: row?.phone ?? "",
          pax: initialText(row?.pax ?? 1),
          rsvp_status: row?.rsvp_status ?? "belum_respons",
          table_id: row?.table_id ?? "",
          dietary_notes: row?.dietary_notes ?? "",
          session_ids: row?.session_ids ?? [],
        })}
        toPayload={(values, mode) => {
          const tableId = text(values, "table_id");
          return {
            full_name: text(values, "full_name"),
            ...(text(values, "display_name") !== "" || mode === "create" ? { display_name: text(values, "display_name") } : {}),
            category: text(values, "category"),
            phone: text(values, "phone"),
            pax: integer(values, "pax"),
            rsvp_status: text(values, "rsvp_status"),
            table_id: tableId === "" ? (mode === "update" ? NIL_UUID : undefined) : tableId,
            dietary_notes: optionalText(values, "dietary_notes", mode),
            session_ids: Array.isArray(values.session_ids) ? values.session_ids : [],
          };
        }}
      />
    </>
  );
}
