"use client";

import { useState } from "react";
import { Badge, DashHeader, Panel, SectionTitle } from "@/components/dash/primitives";
import { EmptyState, ErrorState, LoadingBlock } from "@/components/dash/states";
import { useResource } from "@/components/dash/use-resource";
import type { FieldDef, FormValues } from "@/components/dash/form-modal";
import { formatDate, formatRupiah } from "@/lib/vowly/format";
import type { Vendor, VendorCuration } from "@/lib/vowly/types";
import { CrudTable } from "../crud/crud-table";
import { initialText, money, optionalText, text } from "../crud/payload";
import { useProjectApi } from "../project-context";

const statusOptions = [
  { value: "negosiasi", label: "Negosiasi" },
  { value: "terkunci", label: "Terkunci" },
];

const fields: FieldDef[] = [
  { kind: "text", name: "name", label: "Nama vendor", required: true, maxLength: 150, span: 2 },
  { kind: "text", name: "category", label: "Kategori", required: true, maxLength: 80, placeholder: "Katering, Dekorasi…" },
  { kind: "select", name: "relationship_status", label: "Status", options: statusOptions },
  { kind: "text", name: "pic_name", label: "PIC", maxLength: 100 },
  { kind: "tel", name: "phone", label: "Telepon", maxLength: 32 },
  { kind: "email", name: "email", label: "Email", maxLength: 254 },
  { kind: "url", name: "portfolio_url", label: "Portofolio", maxLength: 500 },
  { kind: "money", name: "contract_value", label: "Nilai kontrak" },
  { kind: "text", name: "payment_scheme", label: "Skema bayar", maxLength: 300, placeholder: "DP 30% – pelunasan H-7" },
  { kind: "date", name: "contract_date", label: "Tanggal kontrak" },
  { kind: "textarea", name: "sla_notes", label: "Catatan SLA", maxLength: 2000, span: 2 },
];

function Curation() {
  const path = useProjectApi();
  const { data, error, loading, reload } = useResource<VendorCuration[]>(path("/vendor-curation"));
  return (
    <Panel className="mb-6">
      <SectionTitle eyebrow="Kurasi terbuka" title="Kategori belum punya vendor terkunci" />
      {loading ? (
        <LoadingBlock rows={2} />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : !data || data.length === 0 ? (
        <EmptyState title="Semua kategori sudah terkunci" />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((row) => (
            <li key={row.category} className="rounded-xl border border-gold/50 p-3 text-sm">
              <p className="font-semibold">{row.category}</p>
              <p className="text-xs text-ink-soft">Alokasi {formatRupiah(row.allocated)}</p>
              <p className="text-xs text-ink-soft">Sisa {formatRupiah(row.remaining)}</p>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

export function VendorsView() {
  const [tick, setTick] = useState(0);
  return (
    <>
      <DashHeader eyebrow="Vendor" title="Direktori & Status" description="Catat vendor, kontrak, dan status negosiasi." />
      <Curation key={tick} />
      <CrudTable<Vendor>
        resource="/vendors"
        noun="vendor"
        searchable={false}
        onChanged={() => setTick((value) => value + 1)}
        filters={[{ name: "relationship_status", label: "Semua status", options: statusOptions }]}
        columns={[
          { header: "Vendor", cell: (row) => <span className="font-medium">{row.name}</span> },
          { header: "Kategori", cell: (row) => row.category || "-" },
          { header: "PIC", cell: (row) => row.pic_name || "-" },
          { header: "Kontrak", cell: (row) => formatRupiah(row.contract_value), className: "text-right" },
          { header: "Tanggal", cell: (row) => formatDate(row.contract_date, "short") },
          {
            header: "Status",
            cell: (row) => <Badge tone={row.relationship_status === "terkunci" ? "success" : "warning"}>{row.relationship_status === "terkunci" ? "Terkunci" : "Negosiasi"}</Badge>,
          },
        ]}
        fields={fields}
        toInitial={(row): FormValues => ({
          name: row?.name ?? "",
          category: row?.category ?? "",
          relationship_status: row?.relationship_status ?? "negosiasi",
          pic_name: row?.pic_name ?? "",
          phone: row?.phone ?? "",
          email: row?.email ?? "",
          portfolio_url: row?.portfolio_url ?? "",
          contract_value: initialText(row?.contract_value ?? ""),
          payment_scheme: row?.payment_scheme ?? "",
          contract_date: row?.contract_date?.slice(0, 10) ?? "",
          sla_notes: row?.sla_notes ?? "",
        })}
        toPayload={(values, mode) => ({
          name: text(values, "name"),
          category: text(values, "category"),
          relationship_status: text(values, "relationship_status"),
          pic_name: text(values, "pic_name"),
          phone: text(values, "phone"),
          email: text(values, "email"),
          portfolio_url: text(values, "portfolio_url"),
          contract_value: money(values, "contract_value"),
          payment_scheme: text(values, "payment_scheme"),
          contract_date: optionalText(values, "contract_date", mode),
          sla_notes: optionalText(values, "sla_notes", mode),
        })}
      />
    </>
  );
}
