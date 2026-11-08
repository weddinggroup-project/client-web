"use client";

import Link from "next/link";
import { Badge, DashHeader, StatCard } from "@/components/dash/primitives";
import type { FieldDef, FormValues } from "@/components/dash/form-modal";
import { useResource } from "@/components/dash/use-resource";
import { adminApi } from "@/lib/vowly/client";
import { formatDate, formatRupiah } from "@/lib/vowly/format";
import type { AdminVoucher, Package, Template, User } from "@/lib/vowly/types";
import { CrudTable } from "../dashboard/crud/crud-table";
import { initialText, money, text } from "../dashboard/crud/payload";
import { parseFeatures, userPayload, voucherPayload } from "./admin-payload";

const adminPath = (suffix: string) => suffix;
const common = { pathOf: adminPath, client: adminApi } as const;

function useCount(resource: string) {
  const { meta, error } = useResource<unknown[]>(resource, { limit: 1 }, true, adminApi);
  return { total: meta?.total, failed: Boolean(error) };
}

export function AdminOverview() {
  const users = useCount("/users");
  const packages = useCount("/packages");
  const templates = useCount("/templates");
  const vouchers = useCount("/vouchers");
  const cards: [string, ReturnType<typeof useCount>, string, string][] = [
    ["Pengguna", users, "/admin/pengguna", "Akun terdaftar"],
    ["Paket", packages, "/admin/paket", "Harga dan fitur"],
    ["Template", templates, "/admin/template", "Desain undangan"],
    ["Voucher", vouchers, "/admin/voucher", "Voucher dan referral"],
  ];
  return (
    <>
      <DashHeader eyebrow="Administrasi" title="Ringkasan Platform" description="Kelola pengguna dan katalog yang dipakai seluruh calon pengantin di Vowly." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, count, href, hint]) => (
          <Link key={href} href={href} className="block rounded-2xl transition hover:-translate-y-0.5">
            <StatCard label={label} value={count.failed ? "-" : (count.total ?? "…")} hint={hint} />
          </Link>
        ))}
      </div>
    </>
  );
}

export function UsersAdmin() {
  const fields: FieldDef[] = [
    { kind: "text", name: "name", label: "Nama", required: true, maxLength: 120 },
    { kind: "email", name: "email", label: "Email", required: true, maxLength: 254 },
    { kind: "select", name: "role", label: "Peran", required: true, options: [{ value: "user", label: "Pengguna" }, { value: "admin", label: "Admin" }] },
    { kind: "text", name: "password", label: "Password", maxLength: 72, hint: "Wajib saat membuat akun (6–72 karakter). Kosongkan saat mengubah untuk tidak mengganti." },
  ];
  return (
    <>
      <DashHeader eyebrow="Administrasi" title="Pengguna" description="Kelola akun pengguna dan admin." />
      <CrudTable<User>
        {...common}
        resource="/users"
        noun="pengguna"
        searchable
        columns={[
          { header: "Nama", cell: (row) => <span className="font-medium">{row.name}</span> },
          { header: "Email", cell: (row) => row.email },
          { header: "Peran", cell: (row) => <Badge tone={row.role === "admin" ? "gold" : "neutral"}>{row.role === "admin" ? "Admin" : "Pengguna"}</Badge> },
        ]}
        fields={fields}
        toInitial={(row): FormValues => ({ name: row?.name ?? "", email: row?.email ?? "", role: row?.role ?? "user", password: "" })}
        toPayload={(values, mode) => userPayload(values, mode)}
      />
    </>
  );
}

export function PackagesAdmin() {
  const fields: FieldDef[] = [
    { kind: "text", name: "code", label: "Kode", required: true, maxLength: 64, hint: "Huruf kecil, mis. journey. Dipakai klien untuk mengenali paket." },
    { kind: "text", name: "name", label: "Nama", required: true, maxLength: 120 },
    { kind: "money", name: "price", label: "Harga", required: true },
    { kind: "checkbox", name: "is_active", label: "Aktif (tampil di katalog)" },
    { kind: "textarea", name: "features", label: "Fitur", rows: 6, span: 2, hint: "Satu fitur per baris, maksimal 20." },
  ];
  return (
    <>
      <DashHeader eyebrow="Administrasi" title="Paket" description="Harga paket yang tampil di landing dan wizard pemesanan." />
      <CrudTable<Package>
        {...common}
        resource="/packages"
        noun="paket"
        columns={[
          { header: "Paket", cell: (row) => <span className="font-medium">{row.name}</span> },
          { header: "Kode", cell: (row) => row.code },
          { header: "Harga", cell: (row) => formatRupiah(row.price), className: "text-right" },
          { header: "Fitur", cell: (row) => row.features.length },
          { header: "Status", cell: (row) => <Badge tone={row.is_active ? "success" : "neutral"}>{row.is_active ? "Aktif" : "Nonaktif"}</Badge> },
        ]}
        fields={fields}
        toInitial={(row): FormValues => ({ code: row?.code ?? "", name: row?.name ?? "", price: initialText(row?.price ?? ""), is_active: row?.is_active ?? true, features: (row?.features ?? []).join("\n") })}
        toPayload={(values) => ({ code: text(values, "code"), name: text(values, "name"), price: money(values, "price"), is_active: values.is_active === true, features: parseFeatures(text(values, "features")) })}
      />
    </>
  );
}

export function TemplatesAdmin() {
  const fields: FieldDef[] = [
    { kind: "text", name: "slug", label: "Slug", required: true, maxLength: 64, hint: "Huruf kecil, mis. blush-elegance." },
    { kind: "text", name: "name", label: "Nama", required: true, maxLength: 120 },
    { kind: "url", name: "preview_url", label: "URL pratinjau", maxLength: 500, span: 2 },
    { kind: "number", name: "sort_order", label: "Urutan", min: 0 },
    { kind: "checkbox", name: "is_active", label: "Aktif (tampil di wizard)" },
  ];
  return (
    <>
      <DashHeader eyebrow="Administrasi" title="Template" description="Desain undangan yang dapat dipilih pengguna." />
      <CrudTable<Template>
        {...common}
        resource="/templates"
        noun="template"
        columns={[
          { header: "Template", cell: (row) => <span className="font-medium">{row.name}</span> },
          { header: "Slug", cell: (row) => row.slug },
          { header: "Urutan", cell: (row) => row.sort_order },
          { header: "Status", cell: (row) => <Badge tone={row.is_active ? "success" : "neutral"}>{row.is_active ? "Aktif" : "Nonaktif"}</Badge> },
        ]}
        fields={fields}
        toInitial={(row): FormValues => ({ slug: row?.slug ?? "", name: row?.name ?? "", preview_url: row?.preview_url ?? "", sort_order: initialText(row?.sort_order ?? 0), is_active: row?.is_active ?? true })}
        toPayload={(values, mode) => ({
          slug: text(values, "slug"),
          name: text(values, "name"),
          ...(text(values, "preview_url") !== "" || mode === "update" ? { preview_url: text(values, "preview_url") } : {}),
          sort_order: Number(text(values, "sort_order") || 0),
          is_active: values.is_active === true,
        })}
      />
    </>
  );
}

export function VouchersAdmin() {
  const fields: FieldDef[] = [
    { kind: "text", name: "code", label: "Kode", required: true, maxLength: 32, hint: "Huruf dan angka, 3–32 karakter. Disimpan huruf besar." },
    { kind: "select", name: "kind", label: "Jenis", required: true, options: [{ value: "voucher", label: "Voucher" }, { value: "referral", label: "Referral" }] },
    { kind: "select", name: "discount_type", label: "Tipe potongan", required: true, options: [{ value: "fixed", label: "Nominal (Rp)" }, { value: "percent", label: "Persen (1–100)" }] },
    { kind: "money", name: "amount", label: "Nilai potongan", required: true },
    { kind: "number", name: "quota", label: "Kuota pakai", min: 0, hint: "Kosong = tanpa batas." },
    { kind: "checkbox", name: "is_active", label: "Aktif" },
    { kind: "date", name: "valid_from", label: "Berlaku dari" },
    { kind: "date", name: "valid_until", label: "Berlaku sampai" },
  ];
  return (
    <>
      <DashHeader eyebrow="Administrasi" title="Voucher" description="Voucher dan kode referral. Pemakaian tercatat saat pesanan dibuat." />
      <CrudTable<AdminVoucher>
        {...common}
        resource="/vouchers"
        noun="voucher"
        columns={[
          { header: "Kode", cell: (row) => <span className="font-mono font-medium">{row.code}</span> },
          { header: "Jenis", cell: (row) => (row.kind === "voucher" ? "Voucher" : "Referral") },
          { header: "Potongan", cell: (row) => (row.discount_type === "percent" ? `${row.amount}%` : formatRupiah(row.amount)), className: "text-right" },
          { header: "Terpakai", cell: (row) => `${row.used_count}${row.quota !== null ? ` / ${row.quota}` : ""}` },
          { header: "Berlaku sampai", cell: (row) => formatDate(row.valid_until, "short") },
          { header: "Status", cell: (row) => <Badge tone={row.is_active ? "success" : "neutral"}>{row.is_active ? "Aktif" : "Nonaktif"}</Badge> },
        ]}
        fields={fields}
        toInitial={(row): FormValues => ({
          code: row?.code ?? "",
          kind: row?.kind ?? "voucher",
          discount_type: row?.discount_type ?? "fixed",
          amount: initialText(row?.amount ?? ""),
          quota: initialText(row?.quota),
          is_active: row?.is_active ?? true,
          valid_from: row?.valid_from?.slice(0, 10) ?? "",
          valid_until: row?.valid_until?.slice(0, 10) ?? "",
        })}
        toPayload={(values) => voucherPayload(values)}
      />
    </>
  );
}
