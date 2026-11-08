"use client";

import { useMemo, useState } from "react";
import { HiOutlineChatBubbleLeftRight, HiOutlinePencilSquare, HiOutlinePlus, HiOutlineTrash } from "react-icons/hi2";
import { useFeedback } from "@/components/dash/feedback";
import { FormModal } from "@/components/dash/form-modal";
import { Badge, DashHeader, Panel, SectionTitle, StatCard, btn } from "@/components/dash/primitives";
import { EmptyState, ErrorState, LoadingBlock } from "@/components/dash/states";
import { useResource } from "@/components/dash/use-resource";
import type { FieldDef, FormValues } from "@/components/dash/form-modal";
import { api, ApiError } from "@/lib/vowly/client";
import { cn } from "@/lib/utils";
import { formatDate, formatRupiah, initials } from "@/lib/vowly/format";
import type { SessionSummary, Vendor, VendorCuration } from "@/lib/vowly/types";
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

/** Wraps an Indonesian number as a wa.me link, or null when there is no usable number. */
export function whatsappLink(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 8 ? `https://wa.me/${digits}` : null;
}

function Curation({ items }: { items: VendorCuration[] }) {
  if (items.length === 0) return null;
  return (
    <Panel className="mt-6">
      <SectionTitle eyebrow="Kurasi terbuka" title="Kategori belum punya vendor terkunci" />
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((row) => (
          <li key={row.category} className="rounded-xl border border-gold/50 bg-cream p-3 text-sm">
            <p className="font-semibold">{row.category}</p>
            <p className="text-xs text-ink-soft">Alokasi {formatRupiah(row.allocated)}</p>
            <p className="text-xs text-ink-soft">Sisa {formatRupiah(row.remaining)}</p>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function VendorsView() {
  const path = useProjectApi();
  const feedback = useFeedback();
  const [tick, setTick] = useState(0);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Vendor | null | undefined>(undefined);
  const list = useResource<Vendor[]>(path("/vendors"), { limit: 100, _r: tick || undefined });
  const curation = useResource<VendorCuration[]>(path("/vendor-curation"), { _r: tick || undefined });
  const sessions = useResource<SessionSummary>(path("/sessions-summary"));

  const all = useMemo(() => list.data ?? [], [list.data]);
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const vendor of all) counts.set(vendor.category, (counts.get(vendor.category) ?? 0) + 1);
    return [...counts.entries()];
  }, [all]);
  const locked = all.filter((vendor) => vendor.relationship_status === "terkunci");
  const committed = locked.reduce((sum, vendor) => sum + vendor.contract_value, 0);
  const visible = all.filter(
    (vendor) =>
      (!category || vendor.category === category) &&
      (!status || vendor.relationship_status === status) &&
      (!search || `${vendor.name} ${vendor.pic_name} ${vendor.category}`.toLowerCase().includes(search.toLowerCase())),
  );
  const reload = () => setTick((value) => value + 1);

  async function save(values: FormValues) {
    const mode = editing ? "update" : "create";
    const body = {
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
    };
    if (editing) await api.put(path(`/vendors/${editing.id}`), body);
    else await api.post(path("/vendors"), body);
    feedback.success(editing ? "Perubahan disimpan" : "Vendor ditambahkan");
    setEditing(undefined);
    reload();
  }

  async function remove(vendor: Vendor) {
    const ok = await feedback.confirm({ title: "Hapus vendor?", description: `${vendor.name}. Relasinya ke anggaran, dokumen, dan sesi dilepas.`, confirmLabel: "Hapus", danger: true });
    if (!ok) return;
    try {
      await api.delete(path(`/vendors/${vendor.id}`));
      feedback.success("Vendor dihapus");
      reload();
    } catch (cause) {
      feedback.error("Gagal menghapus", cause instanceof ApiError ? cause.message : undefined);
    }
  }

  return (
    <>
      <DashHeader
        title="Direktori & Manajemen Vendor"
        description="Pantau status kurasi vendor, penandatanganan kontrak, termin pembayaran, dan koordinasi PIC Hari-H secara terpusat."
        actions={
          <button type="button" className={btn.primary} onClick={() => setEditing(null)}>
            <HiOutlinePlus className="size-4" aria-hidden /> Tambah Vendor Baru
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Vendor Terkunci" value={`${locked.length} / ${all.length}`} hint={`${curation.data?.length ?? 0} kategori kurasi terbuka`} />
        <StatCard label="Nilai Komitmen Kontrak" value={formatRupiah(committed)} hint={`${locked.length} kontrak aktif`} />
        <StatCard label="Vendor Negosiasi" value={all.length - locked.length} hint="Belum terkunci" />
        <StatCard label="Brief & Rundown Teknis" value={sessions.data ? `${sessions.data.ready} Siap` : "-"} hint={sessions.data ? `dari ${sessions.data.total} sesi` : undefined} />
      </div>

      <Panel className="mt-6 p-4 sm:p-4">
        <div className="flex flex-wrap gap-2">
          <input
            type="search"
            aria-label="Cari vendor"
            placeholder="Cari nama vendor, kontak PIC, atau kategori…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-10 min-w-56 flex-1 rounded-lg border border-gold/70 bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
          <select aria-label="Status vendor" value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 rounded-lg border border-gold/70 bg-white px-3 text-sm">
            <option value="">Semua Status</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter kategori vendor">
          {[["", `Semua Kategori (${all.length})`] as const, ...categories.map(([name, count]) => [name, `${name} (${count})`] as const)].map(([value, label]) => (
            <button
              key={value || "all"}
              type="button"
              aria-pressed={category === value}
              onClick={() => setCategory(value)}
              className={cn("rounded-full border px-3.5 py-1 text-xs font-medium transition", category === value ? "border-primary bg-primary text-primary-foreground" : "border-gold/60 bg-white hover:bg-cream")}
            >
              {label}
            </button>
          ))}
        </div>
      </Panel>

      {list.loading ? (
        <div className="mt-4">
          <LoadingBlock rows={4} />
        </div>
      ) : list.error ? (
        <ErrorState error={list.error} onRetry={list.reload} />
      ) : visible.length === 0 ? (
        <Panel className="mt-4">
          <EmptyState title={all.length === 0 ? "Belum ada vendor" : "Vendor tidak ditemukan"} description={all.length === 0 ? "Tambahkan vendor pertama Anda." : "Ubah kata kunci atau filter."} />
        </Panel>
      ) : (
        <ul className="mt-4 grid gap-4 md:grid-cols-2">
          {visible.map((vendor) => {
            const wa = whatsappLink(vendor.phone);
            return (
              <li key={vendor.id} className="rounded-2xl border border-gold/50 bg-white p-5 shadow-sm shadow-gold/20">
                <div className="flex items-start gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gold/50 font-serif font-semibold text-gold-foreground">{initials(vendor.name)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] tracking-wider text-ink-soft uppercase">{vendor.category}</p>
                    <p className="truncate font-serif text-lg font-semibold">{vendor.name}</p>
                  </div>
                  <Badge tone={vendor.relationship_status === "terkunci" ? "success" : "warning"}>{vendor.relationship_status === "terkunci" ? "Terkunci" : "Negosiasi"}</Badge>
                </div>
                <div className="mt-4 rounded-xl bg-cream p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-ink-soft">Nilai Kontrak</span>
                    <strong>{formatRupiah(vendor.contract_value)}</strong>
                  </div>
                  <p className="mt-1 text-xs text-ink-soft">{vendor.payment_scheme || "Skema pembayaran belum diisi"}</p>
                  {vendor.contract_date ? <p className="text-xs text-ink-soft">Kontrak: {formatDate(vendor.contract_date, "short")}</p> : null}
                </div>
                <p className="mt-3 text-sm text-ink-soft">{vendor.pic_name ? `PIC: ${vendor.pic_name}` : "PIC belum diisi"}</p>
                <div className="mt-4 flex items-center gap-2">
                  <button type="button" className={`${btn.secondary} flex-1`} onClick={() => setEditing(vendor)}>
                    <HiOutlinePencilSquare className="size-4" aria-hidden /> Ubah
                  </button>
                  {wa ? (
                    <a className={`${btn.secondary} flex-1`} href={wa} target="_blank" rel="noopener noreferrer">
                      <HiOutlineChatBubbleLeftRight className="size-4" aria-hidden /> WhatsApp
                    </a>
                  ) : null}
                  <button type="button" className={btn.icon} aria-label={`Hapus ${vendor.name}`} onClick={() => void remove(vendor)}>
                    <HiOutlineTrash className="size-4" aria-hidden />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Curation items={curation.data ?? []} />

      <FormModal
        open={editing !== undefined}
        title={editing ? "Ubah vendor" : "Tambah vendor"}
        wide
        fields={fields}
        initial={
          {
            name: editing?.name ?? "",
            category: editing?.category ?? "",
            relationship_status: editing?.relationship_status ?? "negosiasi",
            pic_name: editing?.pic_name ?? "",
            phone: editing?.phone ?? "",
            email: editing?.email ?? "",
            portfolio_url: editing?.portfolio_url ?? "",
            contract_value: initialText(editing?.contract_value ?? ""),
            payment_scheme: editing?.payment_scheme ?? "",
            contract_date: editing?.contract_date?.slice(0, 10) ?? "",
            sla_notes: editing?.sla_notes ?? "",
          } satisfies FormValues
        }
        onClose={() => setEditing(undefined)}
        onSubmit={save}
      />
    </>
  );
}
