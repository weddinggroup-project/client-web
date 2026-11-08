"use client";

import { useRef, useState } from "react";
import { HiOutlineArrowDownTray, HiOutlineArrowUpTray, HiOutlineCloudArrowUp } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { useFeedback } from "@/components/dash/feedback";
import type { FieldDef, FormValues } from "@/components/dash/form-modal";
import { Badge, DashHeader, StatCard, btn, type Tone } from "@/components/dash/primitives";
import { useResource } from "@/components/dash/use-resource";
import { api, ApiError } from "@/lib/vowly/client";
import type { DocumentKind, DocumentStatus, DocumentSummary, FileInfo, FileUrl, Vendor, VowlyDocument } from "@/lib/vowly/types";
import { CrudTable } from "../crud/crud-table";
import { optionalText, text } from "../crud/payload";
import { useProjectApi } from "../project-context";

const NIL_UUID = "00000000-0000-0000-0000-000000000000";
const KEEP = "__keep";
const MAX_BYTES = 8 * 1024 * 1024;

const kinds: Record<DocumentKind, string> = { kua: "Berkas KUA", kontrak_vendor: "Kontrak vendor", rundown: "Rundown", bukti_bayar: "Bukti bayar", lainnya: "Lainnya" };
const statuses: Record<DocumentStatus, { label: string; tone: Tone }> = {
  draf: { label: "Draf", tone: "neutral" },
  menunggu_ttd: { label: "Menunggu TTD", tone: "warning" },
  ditandatangani: { label: "Ditandatangani", tone: "success" },
};
const kindOptions = Object.entries(kinds).map(([value, label]) => ({ value, label }));
const statusOptions = Object.entries(statuses).map(([value, { label }]) => ({ value, label }));

export function DokumenView() {
  const path = useProjectApi();
  const feedback = useFeedback();
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [kind, setKind] = useState("");
  const [tick, setTick] = useState(0);
  const summary = useResource<DocumentSummary>(path("/documents-summary"), { _r: tick || undefined });
  // The API has no file listing: keep files uploaded in this session so they can be attached to a document.
  const [uploaded, setUploaded] = useState<FileInfo[]>([]);
  const vendors = useResource<Vendor[]>(path("/vendors"), { limit: 100 });
  const bump = () => setTick((value) => value + 1);

  async function upload(file: File) {
    if (file.size > MAX_BYTES) {
      feedback.error("Berkas terlalu besar", "Ukuran maksimum 8 MB.");
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const { data: info } = await api.upload<FileInfo>(path("/files"), form);
      setUploaded((current) => [info, ...current]);
      feedback.success("Berkas diunggah", "Pilih berkas ini saat menambah dokumen.");
      bump();
    } catch (cause) {
      feedback.error("Gagal mengunggah", cause instanceof ApiError ? cause.message : undefined);
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function open(fileId: string) {
    try {
      const { data } = await api.get<FileUrl>(path(`/files/${fileId}/url`));
      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch (cause) {
      feedback.error("Tidak dapat membuka berkas", cause instanceof ApiError ? cause.message : undefined);
    }
  }

  const fields: FieldDef[] = [
    { kind: "text", name: "title", label: "Judul dokumen", required: true, maxLength: 200, span: 2 },
    { kind: "select", name: "kind", label: "Jenis", required: true, options: kindOptions },
    { kind: "select", name: "status", label: "Status", options: statusOptions },
    { kind: "text", name: "contract_number", label: "Nomor kontrak", maxLength: 100 },
    { kind: "text", name: "parties", label: "Pihak terkait", maxLength: 300 },
    { kind: "select", name: "file_id", label: "Berkas", emptyLabel: "Tanpa berkas", options: [{ value: KEEP, label: "Pertahankan berkas saat ini" }, ...uploaded.map((file) => ({ value: file.id, label: file.filename }))], hint: "Unggah berkas dulu, lalu pilih di sini." },
    { kind: "select", name: "vendor_id", label: "Vendor", emptyLabel: "Tanpa vendor", options: (vendors.data ?? []).map((vendor) => ({ value: vendor.id, label: vendor.name })) },
  ];

  const sum = summary.data;
  return (
    <>
      <DashHeader
        title="Dokumen & Arsip Kontrak Vendor"
        description="Kelola kontrak kerja sama, berkas legal KUA, proposal vendor, serta faktur pembayaran dalam satu brankas digital."
        actions={
          <>
            <input
              ref={fileInput}
              type="file"
              accept="application/pdf,image/jpeg,image/png,image/webp"
              className="sr-only"
              aria-label="Pilih berkas"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void upload(file);
              }}
            />
            <button type="button" className={btn.primary} disabled={uploading} onClick={() => fileInput.current?.click()}>
              <HiOutlineArrowUpTray className="size-4" aria-hidden />
              {uploading ? "Mengunggah…" : "Unggah Dokumen Baru"}
            </button>
          </>
        }
      />

      {sum ? (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Dokumen" value={`${sum.total} Berkas`} hint={`${uploaded.length} diunggah di sesi ini`} />
          <StatCard label="Ditandatangani" value={`${sum.by_status.ditandatangani ?? 0} / ${sum.total}`} tone="success" hint={`${sum.by_status.menunggu_ttd ?? 0} menunggu tanda tangan`} />
          <StatCard label="Berkas Legal KUA" value={sum.kua_total > 0 ? `${Math.round((sum.kua_signed / sum.kua_total) * 100)}% Lengkap` : "-"} hint={`${sum.kua_signed} dari ${sum.kua_total} ditandatangani`} />
          <StatCard label="Masih Draf" value={`${sum.by_status.draf ?? 0} Berkas`} hint="Belum diajukan" />
        </div>
      ) : null}

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const file = event.dataTransfer.files[0];
          if (file) void upload(file);
        }}
        className={cn("mb-6 flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition", dragging ? "border-primary bg-blush/30" : "border-gold/70 bg-white")}
      >
        <span className="grid size-12 place-items-center rounded-full bg-blush text-blush-foreground">
          <HiOutlineCloudArrowUp className="size-6" aria-hidden />
        </span>
        <p className="font-medium">Seret &amp; lepas berkas PDF kontrak atau faktur ke sini, atau pilih lewat tombol unggah</p>
        <p className="text-xs text-ink-soft">PDF, JPEG, PNG, atau WebP • maksimum 8 MB • tipe diperiksa dari isi berkas</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter jenis dokumen">
        {[["", `Semua Berkas${sum ? ` (${sum.total})` : ""}`] as const, ...kindOptions.map((option) => [option.value, option.label] as const)].map(([value, label]) => (
          <button
            key={value || "all"}
            type="button"
            aria-pressed={kind === value}
            onClick={() => setKind(value)}
            className={cn("rounded-full border px-4 py-1.5 text-sm font-medium transition", kind === value ? "border-primary bg-primary text-primary-foreground" : "border-gold/60 bg-white hover:bg-cream")}
          >
            {label}
          </button>
        ))}
      </div>

      <CrudTable<VowlyDocument>
        key={kind}
        resource="/documents"
        fixedQuery={kind ? { kind } : undefined}
        noun="dokumen"
        refreshKey={tick}
        onChanged={bump}
        filters={[{ name: "status", label: "Semua status", options: statusOptions }]}
        columns={[
          { header: "Dokumen", cell: (row) => <span className="font-medium">{row.title}</span> },
          { header: "Jenis", cell: (row) => kinds[row.kind] },
          { header: "Nomor", cell: (row) => row.contract_number || "-" },
          { header: "Status", cell: (row) => <Badge tone={statuses[row.status].tone}>{statuses[row.status].label}</Badge> },
        ]}
        extraActions={(row) =>
          row.file_id ? (
            <button type="button" className={btn.icon} aria-label="Buka berkas" onClick={() => void open(row.file_id as string)}>
              <HiOutlineArrowDownTray className="size-4" aria-hidden />
            </button>
          ) : null
        }
        fields={fields}
        toInitial={(row): FormValues => ({
          title: row?.title ?? "",
          kind: row?.kind ?? "lainnya",
          status: row?.status ?? "draf",
          contract_number: row?.contract_number ?? "",
          parties: row?.parties ?? "",
          file_id: row?.file_id ? KEEP : "",
          vendor_id: row?.vendor_id ?? "",
        })}
        toPayload={(values, mode) => {
          const detach = (name: string) => {
            const value = text(values, name);
            if (value === KEEP) return undefined;
            return value === "" ? (mode === "update" ? NIL_UUID : undefined) : value;
          };
          return {
            title: text(values, "title"),
            kind: text(values, "kind"),
            status: text(values, "status"),
            contract_number: optionalText(values, "contract_number", mode) ?? "",
            parties: optionalText(values, "parties", mode) ?? "",
            file_id: detach("file_id"),
            vendor_id: detach("vendor_id"),
          };
        }}
      />
    </>
  );
}
