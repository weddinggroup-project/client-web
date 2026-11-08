"use client";

import { useMemo, useState } from "react";
import { HiOutlineChevronDown, HiOutlineChevronUp, HiOutlinePencilSquare, HiOutlinePlus, HiOutlineTrash } from "react-icons/hi2";
import { useFeedback } from "@/components/dash/feedback";
import { FormModal, type FieldDef, type FormValues } from "@/components/dash/form-modal";
import { Badge, DashHeader, Panel, ProgressBar, StatCard, btn, type Tone } from "@/components/dash/primitives";
import { EmptyState, ErrorState, LoadingBlock } from "@/components/dash/states";
import { useResource } from "@/components/dash/use-resource";
import { api, ApiError } from "@/lib/vowly/client";
import { cn } from "@/lib/utils";
import { formatDate, formatRupiah } from "@/lib/vowly/format";
import type { ChecklistItem, TaskPriority, TaskStatus } from "@/lib/vowly/types";
import { initialText, optionalText, text } from "../crud/payload";
import { useProject, useProjectApi } from "../project-context";

const statuses: Record<TaskStatus, { label: string; tone: Tone }> = {
  belum_mulai: { label: "Belum mulai", tone: "neutral" },
  dalam_koordinasi: { label: "Sedang Berjalan", tone: "warning" },
  terverifikasi_pic: { label: "Terverifikasi PIC", tone: "gold" },
  selesai: { label: "Selesai", tone: "success" },
};
const priorities: Record<TaskPriority, string> = { rendah: "Rendah", sedang: "Sedang", tinggi: "Tinggi" };
const toOptions = (map: Record<string, string | { label: string }>) =>
  Object.entries(map).map(([value, item]) => ({ value, label: typeof item === "string" ? item : item.label }));

const NO_PHASE = "Tanpa Fase";

export type PhaseGroup = { phase: string; items: ChecklistItem[]; done: number };

/** Groups tasks by phase (alphabetical, so "Fase 1…" precedes "Fase 2…"), with "Tanpa Fase" last. */
export function groupByPhase(items: ChecklistItem[]): PhaseGroup[] {
  const map = new Map<string, PhaseGroup>();
  for (const item of items) {
    const key = item.phase.trim() || NO_PHASE;
    const group = map.get(key) ?? { phase: key, items: [], done: 0 };
    group.items.push(item);
    if (item.status === "selesai") group.done += 1;
    map.set(key, group);
  }
  return [...map.values()].sort((a, b) => (a.phase === NO_PHASE ? 1 : b.phase === NO_PHASE ? -1 : a.phase.localeCompare(b.phase, "id")));
}

const fields: FieldDef[] = [
  { kind: "text", name: "title", label: "Tugas", required: true, maxLength: 200, span: 2 },
  { kind: "text", name: "phase", label: "Fase", maxLength: 80, placeholder: "Fase 1: 12 – 9 Bulan Sebelum Hari-H" },
  { kind: "text", name: "category", label: "Kategori", maxLength: 80 },
  { kind: "text", name: "pic_name", label: "PIC", maxLength: 100 },
  { kind: "select", name: "priority", label: "Prioritas", options: toOptions(priorities) },
  { kind: "select", name: "status", label: "Status", options: toOptions(statuses) },
  { kind: "date", name: "due_date", label: "Tenggat" },
  { kind: "money", name: "cost_amount", label: "Biaya", hint: "Biaya > 0 otomatis membuat pos anggaran." },
  { kind: "textarea", name: "notes", label: "Catatan", maxLength: 1000, span: 2 },
];

type Filter = "all" | "urgent" | "progress" | "done";

export function ChecklistView() {
  const path = useProjectApi();
  const feedback = useFeedback();
  const { daysUntil } = useProject();
  const [tick, setTick] = useState(0);
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [editing, setEditing] = useState<ChecklistItem | null | undefined>(undefined);
  const list = useResource<ChecklistItem[]>(path("/checklist-items"), { limit: 100, _r: tick || undefined });
  const urgent = useResource<ChecklistItem[]>(path("/checklist-items"), { limit: 100, filter: "due_soon", _r: tick || undefined });

  const items = useMemo(() => list.data ?? [], [list.data]);
  const urgentIds = useMemo(() => new Set((urgent.data ?? []).map((item) => item.id)), [urgent.data]);
  const total = list.meta?.total ?? items.length;
  const done = items.filter((item) => item.status === "selesai").length;
  const verified = items.filter((item) => item.status === "terverifikasi_pic").length;
  const running = items.filter((item) => item.status === "dalam_koordinasi").length;
  const pct = items.length > 0 ? Math.round((done / items.length) * 100) : 0;

  const visible = useMemo(
    () =>
      items.filter((item) =>
        filter === "all" ? true : filter === "urgent" ? urgentIds.has(item.id) : filter === "progress" ? item.status === "dalam_koordinasi" : item.status === "selesai",
      ),
    [items, filter, urgentIds],
  );
  const groups = useMemo(() => groupByPhase(visible), [visible]);
  // The first phase that still has open work starts expanded; the user's own toggles win.
  const firstOpenPhase = groups.find((group) => group.done < group.items.length)?.phase;
  const isOpen = (phase: string) => open[phase] ?? phase === firstOpenPhase;

  function reload() {
    setTick((value) => value + 1);
  }

  async function toggle(item: ChecklistItem) {
    try {
      await api.put(path(`/checklist-items/${item.id}`), { status: item.status === "selesai" ? "belum_mulai" : "selesai" });
      reload();
    } catch (cause) {
      feedback.error("Gagal memperbarui tugas", cause instanceof ApiError ? cause.message : undefined);
    }
  }

  async function remove(item: ChecklistItem) {
    const ok = await feedback.confirm({ title: "Hapus tugas?", description: item.title, confirmLabel: "Hapus", danger: true });
    if (!ok) return;
    try {
      await api.delete(path(`/checklist-items/${item.id}`));
      feedback.success("Tugas dihapus");
      reload();
    } catch (cause) {
      feedback.error("Gagal menghapus", cause instanceof ApiError ? cause.message : undefined);
    }
  }

  async function save(values: FormValues) {
    const mode = editing ? "update" : "create";
    const cost = text(values, "cost_amount").replace(/[.\s]/g, "");
    const body = {
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
    if (editing) await api.put(path(`/checklist-items/${editing.id}`), body);
    else await api.post(path("/checklist-items"), body);
    feedback.success(editing ? "Perubahan disimpan" : "Tugas ditambahkan");
    setEditing(undefined);
    reload();
  }

  const chips: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "Semua Tugas", count: total },
    { id: "urgent", label: "Mendesak", count: urgent.meta?.total ?? urgentIds.size },
    { id: "progress", label: "Sedang Berjalan", count: running },
    { id: "done", label: "Selesai", count: done },
  ];

  return (
    <>
      <DashHeader
        eyebrow="Timeline & Milestones Pengantin"
        title="Checklist Persiapan Pernikahan"
        description="Pantau setiap tahapan dan tenggat waktu persiapan pernikahan impian Anda dari bulan ke bulan agar terstruktur tanpa ada yang terlewat."
        actions={
          <button type="button" className={btn.primary} onClick={() => setEditing(null)}>
            <HiOutlinePlus className="size-4" aria-hidden /> Tambah Tugas Baru
          </button>
        }
      />

      {list.loading ? (
        <LoadingBlock rows={5} />
      ) : list.error ? (
        <ErrorState error={list.error} onRetry={list.reload} />
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <Panel>
              <p className="text-[11px] font-medium tracking-[0.1em] text-ink-soft uppercase">
                Status Eksekusi{daysUntil !== null && daysUntil > 0 ? ` Menuju H-${daysUntil}` : ""}
              </p>
              <h2 className="mt-1 font-serif text-2xl font-semibold">Kemajuan Keseluruhan: {pct}% Selesai</h2>
              <div className="mt-4">
                <ProgressBar value={done} max={Math.max(items.length, 1)} />
              </div>
              <p className="mt-2 text-sm text-ink-soft">
                {done} dari {items.length} tugas tuntas
              </p>
            </Panel>
            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Total Tugas" value={total} hint="Seluruh aktivitas" />
              <StatCard label="Tuntas" value={done} hint={`${verified} terverifikasi PIC`} tone="success" />
              <StatCard label="Sedang Jalan" value={running} hint="Dalam koordinasi" />
              <StatCard label="Mendesak" value={urgent.meta?.total ?? urgentIds.size} hint="Batas < 7 hari" tone="danger" />
            </div>
          </div>

          <div className="mb-4 mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter tugas">
            {chips.map((chip) => (
              <button
                key={chip.id}
                type="button"
                aria-pressed={filter === chip.id}
                onClick={() => setFilter(chip.id)}
                className={cn("rounded-full border px-4 py-1.5 text-sm font-medium transition", filter === chip.id ? "border-ink bg-ink text-white" : "border-gold/60 bg-white hover:bg-cream")}
              >
                {chip.label} ({chip.count})
              </button>
            ))}
          </div>

          {groups.length === 0 ? (
            <Panel>
              <EmptyState title={filter === "all" ? "Belum ada tugas" : "Tidak ada tugas pada filter ini"} description="Tambahkan tugas pertama untuk mulai melacak persiapan." />
            </Panel>
          ) : (
            <div className="space-y-3">
              {groups.map((group) => {
                const expanded = isOpen(group.phase);
                const groupPct = Math.round((group.done / group.items.length) * 100);
                return (
                  <Panel key={group.phase} className="p-0 sm:p-0">
                    <button
                      type="button"
                      aria-expanded={expanded}
                      onClick={() => setOpen((current) => ({ ...current, [group.phase]: !expanded }))}
                      className="flex w-full items-center justify-between gap-4 p-5 text-left"
                    >
                      <span>
                        <span className="block font-serif text-lg font-semibold">{group.phase}</span>
                        {group.done === group.items.length ? <Badge tone="success">Semua Tugas Selesai</Badge> : <Badge tone="gold">{group.items.length - group.done} Tugas Tersisa</Badge>}
                      </span>
                      <span className="flex items-center gap-3 text-right text-sm">
                        <span>
                          <strong className="block">{group.done}/{group.items.length} Tugas ({groupPct}%)</strong>
                        </span>
                        {expanded ? <HiOutlineChevronUp className="size-5" aria-hidden /> : <HiOutlineChevronDown className="size-5" aria-hidden />}
                      </span>
                    </button>
                    {expanded ? (
                      <ul className="divide-y divide-gold/30 border-t border-gold/40">
                        {group.items.map((item) => {
                          const status = statuses[item.status];
                          return (
                            <li key={item.id} className="flex items-start gap-3 px-5 py-4">
                              <input
                                type="checkbox"
                                aria-label={`Tandai ${item.title} selesai`}
                                checked={item.status === "selesai"}
                                onChange={() => void toggle(item)}
                                className="mt-1 size-4 accent-primary"
                              />
                              <div className="min-w-0 flex-1">
                                <p className={cn("flex flex-wrap items-center gap-2 font-medium", item.status === "selesai" && "text-ink-soft line-through")}>
                                  {item.title}
                                  {urgentIds.has(item.id) ? <Badge tone="danger">Mendesak</Badge> : null}
                                  <Badge tone={status.tone}>{status.label}</Badge>
                                  {item.category ? <Badge>{item.category}</Badge> : null}
                                </p>
                                <p className="mt-1 text-xs text-ink-soft">
                                  {item.due_date ? `Batas: ${formatDate(item.due_date, "short")}` : "Tanpa tenggat"} • Prioritas {priorities[item.priority]}
                                  {item.pic_name ? ` • ${item.pic_name}` : ""}
                                  {item.cost_amount ? ` • ${formatRupiah(item.cost_amount)}` : ""}
                                </p>
                                {item.notes ? <p className="mt-1 text-sm text-ink-soft">{item.notes}</p> : null}
                              </div>
                              <button type="button" className={btn.icon} aria-label="Ubah tugas" onClick={() => setEditing(item)}>
                                <HiOutlinePencilSquare className="size-4" aria-hidden />
                              </button>
                              <button type="button" className={btn.icon} aria-label="Hapus tugas" onClick={() => void remove(item)}>
                                <HiOutlineTrash className="size-4" aria-hidden />
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </Panel>
                );
              })}
            </div>
          )}
          {(list.meta?.total ?? 0) > items.length ? <p className="mt-3 text-xs text-ink-soft">Menampilkan {items.length} dari {list.meta?.total} tugas.</p> : null}
        </>
      )}

      <FormModal
        open={editing !== undefined}
        title={editing ? "Ubah tugas" : "Tambah tugas"}
        fields={fields}
        initial={
          {
            title: editing?.title ?? "",
            phase: editing?.phase ?? "",
            category: editing?.category ?? "",
            pic_name: editing?.pic_name ?? "",
            priority: editing?.priority ?? "sedang",
            status: editing?.status ?? "belum_mulai",
            due_date: editing?.due_date?.slice(0, 10) ?? "",
            cost_amount: initialText(editing?.cost_amount),
            notes: editing?.notes ?? "",
          } satisfies FormValues
        }
        onClose={() => setEditing(undefined)}
        onSubmit={save}
      />
    </>
  );
}
