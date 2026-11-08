"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { HiOutlineCalendarDays, HiOutlineHeart, HiOutlineMapPin, HiOutlinePlusCircle, HiOutlineUserPlus } from "react-icons/hi2";
import { Badge, DashHeader, Panel, ProgressBar, btn } from "@/components/dash/primitives";
import { EmptyState, ErrorState, LoadingBlock } from "@/components/dash/states";
import { useResource } from "@/components/dash/use-resource";
import { formatDate, formatNumber, formatRelative, formatRupiah, formatRupiahShort } from "@/lib/vowly/format";
import type { Home, Vendor } from "@/lib/vowly/types";
import { projectHref } from "../nav";
import { useProject, useProjectApi } from "../project-context";

const label = "text-[11px] font-medium tracking-[0.1em] text-ink-soft uppercase";

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-gold/50 bg-white p-5 shadow-sm shadow-gold/20 ${className}`}>{children}</div>;
}

const vendorStatus: Record<Vendor["relationship_status"], { text: string; tone: "success" | "warning" }> = {
  terkunci: { text: "Terkunci", tone: "success" },
  negosiasi: { text: "Negosiasi", tone: "warning" },
};

/** Total row count of a filtered list, read from pagination meta with a one-row page. */
function useCount(path: string, query: Record<string, string>) {
  const { meta } = useResource<unknown[]>(path, { limit: 1, ...query });
  return meta?.total;
}

export function HomeView() {
  const { project } = useProject();
  const path = useProjectApi();
  const home = useResource<Home>(path("/home"));
  const hadir = useCount(path("/guests"), { rsvp_status: "hadir" });
  const menunggu = useCount(path("/guests"), { rsvp_status: "belum_respons" });
  const menolak = useCount(path("/guests"), { rsvp_status: "tidak_hadir" });
  const tasksTotal = useCount(path("/checklist-items"), {});
  const tasksDone = useCount(path("/checklist-items"), { status: "selesai" });
  const vendors = useResource<Vendor[]>(path("/vendors"), { limit: 4, relationship_status: "terkunci" });

  if (home.loading) return <LoadingBlock rows={6} />;
  if (home.error || !home.data) return <ErrorState error={home.error} onRetry={home.reload} />;
  const data = home.data;

  const spentPct = data.total_budget > 0 ? Math.round((data.actual_spent / data.total_budget) * 1000) / 10 : 0;
  const overBudget = data.budget_remaining < 0;
  const donePct = tasksTotal ? Math.round(((tasksDone ?? 0) / tasksTotal) * 100) : 0;
  const href = (slug: string) => projectHref(project.id, slug);

  return (
    <>
      <DashHeader
        eyebrow="Ikhtisar Pernikahan"
        title={`Selamat Datang Kembali, ${project.title}`}
        description={`Rangkuman persiapan hari bahagia Anda menuju ${formatDate(data.event_date)}.`}
        actions={
          <>
            <Link href={href("budget")} className={btn.secondary}>
              <HiOutlinePlusCircle className="size-4" aria-hidden /> Pengeluaran
            </Link>
            <Link href={href("tamu")} className={btn.secondary}>
              <HiOutlineUserPlus className="size-4" aria-hidden /> Tambah Tamu
            </Link>
            <Link href={href("persiapan")} className={btn.primary}>
              <HiOutlineCalendarDays className="size-4" aria-hidden /> Tambah Rundown
            </Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <div className="flex items-center justify-between">
            <p className={label}>Hari Bahagia</p>
            <Badge tone="gold">{data.days_until_event > 0 ? `H-${data.days_until_event} Hari` : data.days_until_event === 0 ? "Hari ini" : "Selesai"}</Badge>
          </div>
          <p className="mt-4 font-serif text-2xl font-semibold">{formatDate(data.event_date)}</p>
          <p className="mt-1 text-sm text-ink-soft">Akad &amp; Resepsi</p>
          <p className="mt-4 flex items-center gap-2 border-t border-gold/40 pt-3 text-sm text-ink-soft">
            <HiOutlineMapPin className="size-4 shrink-0" aria-hidden />
            <span className="truncate">{project.venue ?? "Lokasi belum diisi"}</span>
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <p className={label}>Anggaran Biaya</p>
            <Badge tone={overBudget ? "danger" : "gold"}>{spentPct}% Terpakai</Badge>
          </div>
          <p className="mt-4 font-serif text-2xl font-semibold">{formatRupiah(data.total_budget)}</p>
          <p className="mt-1 text-sm text-ink-soft">Total Alokasi Budget</p>
          <div className="mt-4 border-t border-gold/40 pt-3">
            <ProgressBar value={data.actual_spent} max={data.total_budget} tone={overBudget ? "danger" : "primary"} />
            <p className="mt-2 text-xs text-ink-soft">
              Terpakai: {formatRupiahShort(data.actual_spent)} &nbsp; <span className={overBudget ? "font-semibold text-red-700" : "font-semibold text-gold-foreground"}>Sisa: {formatRupiahShort(data.budget_remaining)}</span>
            </p>
          </div>
        </Card>

        <Card>
          <p className={label}>Tamu &amp; Kehadiran</p>
          <p className="mt-4 font-serif text-2xl font-semibold">
            {formatNumber(data.guest_count)} <span className="text-sm font-normal text-ink-soft">Undangan</span>
          </p>
          <p className="mt-1 text-sm text-ink-soft">Estimasi {formatNumber(data.guest_estimate)} Pax</p>
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gold/40 pt-3 text-xs text-ink-soft">
            <span><strong className="block text-sm text-ink">{hadir ?? "-"}</strong>Hadir</span>
            <span><strong className="block text-sm text-ink">{menunggu ?? "-"}</strong>Menunggu</span>
            <span><strong className="block text-sm text-ink">{menolak ?? "-"}</strong>Menolak</span>
          </div>
        </Card>

        <Card>
          <p className={label}>Status Checklist</p>
          <p className="mt-4 font-serif text-2xl font-semibold">
            {donePct}% <span className="text-sm font-normal text-ink-soft">({tasksDone ?? 0}/{tasksTotal ?? 0} Selesai)</span>
          </p>
          <p className="mt-1 text-sm text-ink-soft">{formatNumber(data.tasks_open)} tugas masih terbuka</p>
          <div className="mt-4 flex items-center justify-between border-t border-gold/40 pt-3 text-xs">
            <span className={data.tasks_due_soon > 0 ? "font-semibold text-red-700" : "text-ink-soft"}>
              {data.tasks_due_soon > 0 ? `${data.tasks_due_soon} Tugas Mendesak` : "Tidak ada yang mendesak"}
            </span>
            <Link href={href("checklist")} className="font-semibold text-primary">Lihat →</Link>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Panel className="lg:col-span-3">
          <p className={label}>Log Pembaruan</p>
          <h2 className="mb-4 mt-0.5 font-serif text-xl font-semibold">Linimasa Aktivitas Terkini</h2>
          {data.recent_activity.length === 0 ? (
            <EmptyState title="Belum ada aktivitas" description="Perubahan pada tamu, anggaran, dan tugas akan tampil di sini." />
          ) : (
            <ol className="space-y-3 border-l-2 border-gold/60 pl-4">
              {data.recent_activity.map((entry) => (
                <li key={entry.id} className="rounded-xl bg-cream p-3 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-ink">{entry.message}</p>
                    <span className="shrink-0 text-xs text-ink-soft">{formatRelative(entry.created_at)}</span>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </Panel>

        <Panel className="lg:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <p className={label}>Mitra Pernikahan</p>
              <h2 className="mb-4 mt-0.5 font-serif text-xl font-semibold">Vendor Pilihan</h2>
            </div>
            {vendors.meta ? <Badge tone="gold">{vendors.meta.total} Terkunci</Badge> : null}
          </div>
          {vendors.loading ? (
            <LoadingBlock rows={3} />
          ) : !vendors.data || vendors.data.length === 0 ? (
            <EmptyState title="Belum ada vendor terkunci" description="Vendor dengan status terkunci tampil di sini." />
          ) : (
            <ul className="space-y-3">
              {vendors.data.map((vendor) => (
                <li key={vendor.id} className="flex items-center gap-3 rounded-xl bg-cream p-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-gold/50 text-gold-foreground">
                    <HiOutlineHeart className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{vendor.name}</span>
                    <span className="block truncate text-xs text-ink-soft">{vendor.category}</span>
                  </span>
                  <span className="text-right">
                    <Badge tone={vendorStatus[vendor.relationship_status].tone}>{vendorStatus[vendor.relationship_status].text}</Badge>
                    <span className="mt-1 block text-xs font-semibold">{formatRupiah(vendor.contract_value)}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link href={href("vendor")} className={`${btn.secondary} mt-4 w-full`}>
            Kelola Seluruh Vendor →
          </Link>
        </Panel>
      </div>
    </>
  );
}

