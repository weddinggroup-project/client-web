"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge, DashHeader, SectionTitle, StatCard, btn, type Tone } from "@/components/dash/primitives";
import type { FieldDef, FormValues } from "@/components/dash/form-modal";
import { useResource } from "@/components/dash/use-resource";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/vowly/format";
import type { Delivery, DeliveryStatus, EventSession, Guest, RsvpStatus, SeatingTable } from "@/lib/vowly/types";
import { CrudTable } from "../crud/crud-table";
import { initialText, integer, optionalText, text } from "../crud/payload";
import { projectHref } from "../nav";
import { useProject, useProjectApi } from "../project-context";

const NIL_UUID = "00000000-0000-0000-0000-000000000000";

const rsvp: Record<RsvpStatus, { label: string; tone: Tone }> = {
  belum_respons: { label: "Belum respons", tone: "neutral" },
  hadir: { label: "Hadir", tone: "success" },
  tidak_hadir: { label: "Tidak hadir", tone: "danger" },
};
const deliveryText: Record<DeliveryStatus, { label: string; tone: Tone }> = {
  belum_dikirim: { label: "Belum dikirim", tone: "neutral" },
  mengirim: { label: "Mengirim", tone: "warning" },
  terkirim: { label: "Terkirim", tone: "success" },
  gagal: { label: "Gagal", tone: "danger" },
};

/** Guest entries and pax per RSVP status. Exact only while the list fits one page (the API caps `limit` at 100). */
export function rsvpTotals(guests: Pick<Guest, "rsvp_status" | "pax">[]) {
  const totals = { all: { count: 0, pax: 0 }, hadir: { count: 0, pax: 0 }, belum_respons: { count: 0, pax: 0 }, tidak_hadir: { count: 0, pax: 0 } };
  for (const guest of guests) {
    totals.all.count += 1;
    totals.all.pax += guest.pax;
    totals[guest.rsvp_status].count += 1;
    totals[guest.rsvp_status].pax += guest.pax;
  }
  return totals;
}

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
  const { project } = useProject();
  const [category, setCategory] = useState("");
  const everyone = useResource<Guest[]>(path("/guests"), { limit: 100, _r: tick || undefined });
  const deliveries = useResource<Delivery[]>(path("/deliveries"), { limit: 100, _r: tick || undefined });
  const deliveryOf = useMemo(() => new Map((deliveries.data ?? []).map((item) => [item.guest_id, item.status])), [deliveries.data]);
  const sessionName = (id: string) => sessions.find((session) => session.id === id)?.name ?? "";
  const all = useMemo(() => everyone.data ?? [], [everyone.data]);
  const complete = (everyone.meta?.total ?? 0) <= all.length;
  const totals = useMemo(() => rsvpTotals(all), [all]);
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const guest of all) if (guest.category) counts.set(guest.category, (counts.get(guest.category) ?? 0) + 1);
    return [...counts.entries()];
  }, [all]);
  const pct = (part: number) => (totals.all.pax > 0 ? Math.round((part / totals.all.pax) * 100) : 0);

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
      <DashHeader
        title="Guest List & RSVP Tamu Undangan"
        description="Kelola alokasi meja, sesi kehadiran, broadcast undangan WhatsApp, serta monitor status konfirmasi RSVP secara real-time."
        actions={
          <Link href={projectHref(project.id, "undangan")} className={btn.secondary}>
            Kirim WA Blast
          </Link>
        }
      />
      {everyone.data ? (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Tamu Terdaftar" value={complete ? `${totals.all.pax} Pax` : `${everyone.meta?.total ?? 0} Undangan`} hint={`${totals.all.count} undangan terdaftar`} />
          <StatCard label="Konfirmasi Hadir" value={complete ? `${totals.hadir.pax} Pax` : "-"} tone="success" hint={complete ? `${pct(totals.hadir.pax)}% dari total` : "Daftar lebih dari 100 tamu"} />
          <StatCard label="Belum Respon / Menunggu" value={complete ? `${totals.belum_respons.pax} Pax` : "-"} hint={complete ? `${pct(totals.belum_respons.pax)}% dari total` : undefined} />
          <StatCard label="Berhalangan Hadir" value={complete ? `${totals.tidak_hadir.pax} Pax` : "-"} tone="danger" hint={complete ? `${pct(totals.tidak_hadir.pax)}% dari total` : undefined} />
        </div>
      ) : null}
      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter kategori tamu">
        {[["", `Semua Tamu (${everyone.meta?.total ?? 0})`] as const, ...categories.map(([name, count]) => [name, `${name} (${count})`] as const)].map(([value, text]) => (
          <button
            key={value || "all"}
            type="button"
            aria-pressed={category === value}
            onClick={() => setCategory(value)}
            className={cn("rounded-full border px-4 py-1.5 text-sm font-medium transition", category === value ? "border-primary bg-primary text-primary-foreground" : "border-gold/60 bg-white hover:bg-cream")}
          >
            {text}
          </button>
        ))}
      </div>
      <CrudTable<Guest>
        key={category}
        resource="/guests"
        noun="tamu"
        searchable
        refreshKey={tick}
        onChanged={() => setTick((value) => value + 1)}
        fixedQuery={category ? { category } : undefined}
        filters={[{ name: "rsvp_status", label: "Semua Status RSVP", options: rsvpOptions }, { name: "table_id", label: "Semua meja", options: tables.map((table) => ({ value: table.id, label: table.name })) }]}
        columns={[
          {
            header: "Nama Tamu & Kategori",
            cell: (row) => (
              <span className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gold/50 text-xs font-semibold text-gold-foreground">{initials(row.full_name)}</span>
                <span className="min-w-0">
                  <span className="block truncate font-medium">{row.full_name}</span>
                  <span className="block truncate text-xs text-ink-soft">{row.category || "Tanpa kategori"}{row.display_name !== row.full_name ? ` • ${row.display_name}` : ""}</span>
                </span>
              </span>
            ),
          },
          { header: "Nomor WhatsApp", cell: (row) => row.phone || "-" },
          { header: "Sesi Acara", cell: (row) => row.session_ids.map(sessionName).filter(Boolean).join(", ") || "-" },
          { header: "Alokasi Meja", cell: (row) => tableName(row.table_id) },
          { header: "Pax", cell: (row) => `+${row.pax}` },
          { header: "Status RSVP", cell: (row) => <Badge tone={rsvp[row.rsvp_status].tone}>{rsvp[row.rsvp_status].label}</Badge> },
          { header: "Status WA Blast", cell: (row) => { const status = deliveryText[deliveryOf.get(row.id) ?? "belum_dikirim"]; return <Badge tone={status.tone}>{status.label}</Badge>; } },
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
      <div className="mt-8">
  <TablesPanel tables={tables} onChanged={() => setTick((value) => value + 1)} />
      </div>
    </>
  );
}
