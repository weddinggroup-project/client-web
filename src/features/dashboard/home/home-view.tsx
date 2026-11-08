"use client";

import Link from "next/link";
import { DashHeader, Panel, ProgressBar, SectionTitle, StatCard } from "@/components/dash/primitives";
import { EmptyState, ErrorState, LoadingBlock } from "@/components/dash/states";
import { useResource } from "@/components/dash/use-resource";
import { formatDate, formatNumber, formatRelative, formatRupiah } from "@/lib/vowly/format";
import type { Home } from "@/lib/vowly/types";
import { projectHref } from "../nav";
import { useProject, useProjectApi } from "../project-context";

export function HomeView() {
  const { project } = useProject();
  const path = useProjectApi();
  const { data, error, loading, reload } = useResource<Home>(path("/home"));

  if (loading) return <LoadingBlock rows={6} />;
  if (error || !data) return <ErrorState error={error} onRetry={reload} />;

  const overBudget = data.budget_remaining < 0;
  const spentPct = data.total_budget > 0 ? (data.actual_spent / data.total_budget) * 100 : 0;

  return (
    <>
      <DashHeader
        eyebrow="Main Dashboard"
        title={`Selamat datang, ${project.title}`}
        description={`Akad & resepsi pada ${formatDate(data.event_date)}.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Hari menuju acara" value={data.days_until_event > 0 ? formatNumber(data.days_until_event) : "0"} hint={formatDate(data.event_date, "short")} />
        <StatCard
          label="Sisa anggaran"
          value={formatRupiah(data.budget_remaining)}
          tone={overBudget ? "danger" : undefined}
          hint={overBudget ? "Melebihi anggaran" : `dari ${formatRupiah(data.total_budget)}`}
        />
        <StatCard label="Tamu hadir (pax)" value={formatNumber(data.rsvp_attending_pax)} hint={`${formatNumber(data.guest_count)} tamu • estimasi ${formatNumber(data.guest_estimate)}`} />
        <StatCard
          label="Tugas terbuka"
          value={formatNumber(data.tasks_open)}
          tone={data.tasks_due_soon > 0 ? "danger" : undefined}
          hint={data.tasks_due_soon > 0 ? `${data.tasks_due_soon} segera jatuh tempo` : "Tidak ada yang mendesak"}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Panel className="lg:col-span-3">
          <SectionTitle eyebrow="Budget" title="Pengeluaran vs anggaran" aside={<Link className="text-xs font-semibold text-primary" href={projectHref(project.id, "budget")}>Kelola</Link>} />
          <ProgressBar value={data.actual_spent} max={data.total_budget} tone={overBudget ? "danger" : "primary"} />
          <p className="mt-3 text-sm text-ink-soft">
            {formatRupiah(data.actual_spent)} terpakai{data.total_budget > 0 ? ` (${Math.round(spentPct)}%)` : ""}
          </p>
        </Panel>

        <Panel className="lg:col-span-2">
          <SectionTitle eyebrow="Aktivitas" title="Terbaru" />
          {data.recent_activity.length === 0 ? (
            <EmptyState title="Belum ada aktivitas" description="Perubahan pada tamu, anggaran, dan tugas akan tampil di sini." />
          ) : (
            <ul className="space-y-3">
              {data.recent_activity.map((entry) => (
                <li key={entry.id} className="text-sm">
                  <p className="text-ink">{entry.message}</p>
                  <p className="text-xs text-ink-soft">{formatRelative(entry.created_at)}</p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
