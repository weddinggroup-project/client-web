"use client";

import { useMemo, useState } from "react";
import { HiOutlineClock, HiOutlineMapPin, HiOutlineUserGroup, HiOutlineCheckCircle, HiOutlinePencilSquare, HiOutlinePlus, HiOutlineTrash, HiOutlineUser } from "react-icons/hi2";
import { useFeedback } from "@/components/dash/feedback";
import { FormModal } from "@/components/dash/form-modal";
import { Badge, DashHeader, Panel, ProgressBar, SectionTitle, StatCard, btn, type Tone } from "@/components/dash/primitives";
import { EmptyState, ErrorState, LoadingBlock } from "@/components/dash/states";
import type { FieldDef, FormValues } from "@/components/dash/form-modal";
import { useResource } from "@/components/dash/use-resource";
import { api, ApiError } from "@/lib/vowly/client";
import type { EmergencyContact, EventSession, SessionSummary, TaskPriority, Vendor } from "@/lib/vowly/types";
import { CrudTable } from "../crud/crud-table";
import { initialText, integer, optionalText, text } from "../crud/payload";
import { useProjectApi } from "../project-context";

const priorities: Record<TaskPriority, { label: string; tone: Tone }> = {
  rendah: { label: "Rendah", tone: "neutral" },
  sedang: { label: "Sedang", tone: "gold" },
  tinggi: { label: "Tinggi", tone: "danger" },
};

const NO_PHASE = "Rundown Acara";

export type SessionPhase = { phase: string; sessions: EventSession[]; start: string; end: string };

/** "08:00"-"10:00" -> minutes; 0 when the values are malformed. */
export function durationMinutes(start: string, end: string): number {
  const toMinutes = (value: string) => {
    const [h, m] = value.split(":").map(Number);
    return Number.isFinite(h) && Number.isFinite(m) ? (h as number) * 60 + (m as number) : Number.NaN;
  };
  const diff = toMinutes(end) - toMinutes(start);
  return Number.isNaN(diff) || diff < 0 ? 0 : diff;
}

/** Sessions grouped by phase in order of first appearance (the API already sorts by time), with each group's time span. */
export function groupSessions(sessions: EventSession[]): SessionPhase[] {
  const map = new Map<string, SessionPhase>();
  for (const session of sessions) {
    const key = session.phase.trim() || NO_PHASE;
    const group = map.get(key) ?? { phase: key, sessions: [], start: session.start_time, end: session.end_time };
    group.sessions.push(session);
    if (session.start_time < group.start) group.start = session.start_time;
    if (session.end_time > group.end) group.end = session.end_time;
    map.set(key, group);
  }
  return [...map.values()];
}

export function PersiapanView() {
  const path = useProjectApi();
  const feedback = useFeedback();
  const [tick, setTick] = useState(0);
  const [editing, setEditing] = useState<EventSession | null | undefined>(undefined);
  const [search, setSearch] = useState("");
  const summary = useResource<SessionSummary>(path("/sessions-summary"), { _r: tick || undefined });
  const list = useResource<EventSession[]>(path("/sessions"), { limit: 100, _r: tick || undefined });
  const vendors = useResource<Vendor[]>(path("/vendors"), { limit: 100 });
  const vendorName = (id: string) => vendors.data?.find((vendor) => vendor.id === id)?.name;
  const reload = () => setTick((value) => value + 1);

  const all = useMemo(() => list.data ?? [], [list.data]);
  const visible = useMemo(
    () => (search ? all.filter((session) => `${session.name} ${session.pic_name} ${session.location}`.toLowerCase().includes(search.toLowerCase())) : all),
    [all, search],
  );
  const groups = useMemo(() => groupSessions(visible), [visible]);
  const involved = useMemo(() => new Set(all.flatMap((session) => session.vendor_ids)).size, [all]);
  const span = all.length > 0 ? `${all[0]?.start_time} – ${all.reduce((max, session) => (session.end_time > max ? session.end_time : max), "00:00")}` : "-";

  const fields: FieldDef[] = [
    { kind: "text", name: "name", label: "Nama sesi", required: true, maxLength: 150, span: 2, placeholder: "Akad Nikah" },
    { kind: "time", name: "start_time", label: "Mulai", required: true },
    { kind: "time", name: "end_time", label: "Selesai", required: true },
    { kind: "text", name: "location", label: "Lokasi", maxLength: 200 },
    { kind: "text", name: "pic_name", label: "PIC", maxLength: 100 },
    { kind: "text", name: "phase", label: "Fase / kelompok", maxLength: 80, placeholder: "Prosesi Pagi: Akad Nikah" },
    { kind: "text", name: "category", label: "Kategori", maxLength: 80 },
    { kind: "select", name: "priority", label: "Prioritas", options: Object.entries(priorities).map(([value, { label }]) => ({ value, label })) },
    { kind: "number", name: "sort_order", label: "Urutan", min: 0 },
    { kind: "multi", name: "vendor_ids", label: "Vendor bertugas", span: 2, options: (vendors.data ?? []).map((vendor) => ({ value: vendor.id, label: vendor.name })) },
    { kind: "textarea", name: "notes", label: "Catatan", maxLength: 2000, span: 2 },
  ];

  async function save(values: FormValues) {
    const mode = editing ? "update" : "create";
    const body = {
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
    };
    if (editing) await api.put(path(`/sessions/${editing.id}`), body);
    else await api.post(path("/sessions"), body);
    feedback.success(editing ? "Perubahan disimpan" : "Sesi ditambahkan");
    setEditing(undefined);
    reload();
  }

  async function remove(session: EventSession) {
    const ok = await feedback.confirm({ title: "Hapus sesi?", description: session.name, confirmLabel: "Hapus", danger: true });
    if (!ok) return;
    try {
      await api.delete(path(`/sessions/${session.id}`));
      feedback.success("Sesi dihapus");
      reload();
    } catch (cause) {
      feedback.error("Gagal menghapus", cause instanceof ApiError ? cause.message : undefined);
    }
  }

  return (
    <>
      <DashHeader
        eyebrow="Kurasi Hari Bahagia"
        title="Persiapan & Rundown Acara"
        description="Susun timeline persiapan pernikahan, rundown menit demi menit hari-H (Akad & Resepsi), serta koordinasi penanggung jawab vendor secara presisi."
        actions={
          <button type="button" className={btn.primary} onClick={() => setEditing(null)}>
            <HiOutlinePlus className="size-4" aria-hidden /> Tambah Sesi Acara
          </button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={<HiOutlineClock />} label="Sesi Terjadwal" value={list.data ? all.length : "-"} chip={`${groups.length} Kelompok`} hint={span} />
        <StatCard icon={<HiOutlineUserGroup />} label="Mitra Terlibat" value={list.data ? involved : "-"} chip="Vendor" hint="Terhubung ke rundown" />
        <div className="rounded-2xl border border-gold/50 bg-white p-5 shadow-sm shadow-gold/20">
          <div className="flex items-start justify-between">
            <span className="grid size-11 place-items-center rounded-xl bg-gold/40 text-gold-foreground">
              <HiOutlineCheckCircle className="size-5" aria-hidden />
            </span>
            <span className="rounded-full bg-gold/40 px-2.5 py-0.5 text-[11px] font-semibold text-gold-foreground">{summary.data ? `${summary.data.total - summary.data.ready} Perlu Dilengkapi` : "-"}</span>
          </div>
          <p className="mt-4 font-serif text-3xl font-semibold">{summary.data ? `${summary.data.ready_percent}%` : "-"} <span className="text-base font-normal text-ink-soft">Siap</span></p>
          <p className="mt-1 text-sm text-ink-soft">Kesiapan Rundown</p>
          <div className="mt-2">
            <ProgressBar value={summary.data?.ready_percent ?? 0} />
          </div>
        </div>
      </div>

      <input
        type="search"
        aria-label="Cari sesi"
        placeholder="Cari sesi, PIC, atau lokasi…"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="mb-4 h-10 w-full max-w-md rounded-lg border border-gold/70 bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
      />

      {list.loading ? (
        <LoadingBlock rows={4} />
      ) : list.error ? (
        <ErrorState error={list.error} onRetry={list.reload} />
      ) : groups.length === 0 ? (
        <Panel>
          <EmptyState title={all.length === 0 ? "Belum ada sesi" : "Sesi tidak ditemukan"} description={all.length === 0 ? "Tambahkan sesi pertama, mis. Akad Nikah." : "Ubah kata kunci pencarian."} />
        </Panel>
      ) : (
        <div className="space-y-8">
          {groups.map((group) => (
            <section key={group.phase} aria-label={group.phase}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-serif text-xl font-semibold">{group.phase}</h2>
                <Badge tone="gold">{group.start} – {group.end}</Badge>
              </div>
              <ul className="space-y-3">
                {group.sessions.map((session) => {
                  const priority = priorities[session.priority];
                  const minutes = durationMinutes(session.start_time, session.end_time);
                  return (
                    <li key={session.id} className="flex gap-4 rounded-2xl border border-gold/50 bg-white p-4 shadow-sm shadow-gold/20">
                      <div className="w-20 shrink-0 rounded-xl bg-cream p-2 text-center">
                        <p className="font-serif text-lg font-semibold">{session.start_time}</p>
                        <p className="text-[11px] text-ink-soft">{session.end_time}</p>
                        <p className="mt-1 text-[11px] font-semibold text-gold-foreground">{minutes} Mnt</p>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="flex flex-wrap items-center gap-2 font-semibold">
                          {session.name}
                          <Badge tone={priority.tone}>{priority.label}</Badge>
                        </p>
                        <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-soft">
                          <span className="flex items-center gap-1"><HiOutlineMapPin className="size-3.5" aria-hidden /> {session.location || "Lokasi belum diisi"}</span>
                          <span className="flex items-center gap-1"><HiOutlineUser className="size-3.5" aria-hidden /> PIC: {session.pic_name || "belum diisi"}</span>
                        </p>
                        {session.vendor_ids.length > 0 ? (
                          <p className="mt-2 flex flex-wrap gap-1.5">
                            {session.vendor_ids.map((id) => (
                              <Badge key={id}>{vendorName(id) ?? "Vendor"}</Badge>
                            ))}
                          </p>
                        ) : null}
                        {session.notes ? <p className="mt-2 rounded-lg bg-cream p-2 text-xs text-ink-soft">{session.notes}</p> : null}
                      </div>
                      <div className="flex shrink-0 flex-col gap-1">
                        <button type="button" className={btn.icon} aria-label={`Ubah ${session.name}`} onClick={() => setEditing(session)}>
                          <HiOutlinePencilSquare className="size-4" aria-hidden />
                        </button>
                        <button type="button" className={btn.icon} aria-label={`Hapus ${session.name}`} onClick={() => void remove(session)}>
                          <HiOutlineTrash className="size-4" aria-hidden />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}

      <FormModal
        open={editing !== undefined}
        title={editing ? "Ubah sesi" : "Tambah sesi acara"}
        wide
        fields={fields}
        initial={
          {
            name: editing?.name ?? "",
            start_time: editing?.start_time?.slice(0, 5) ?? "",
            end_time: editing?.end_time?.slice(0, 5) ?? "",
            location: editing?.location ?? "",
            pic_name: editing?.pic_name ?? "",
            phase: editing?.phase ?? "",
            category: editing?.category ?? "",
            priority: editing?.priority ?? "sedang",
            sort_order: initialText(editing?.sort_order ?? 0),
            vendor_ids: editing?.vendor_ids ?? [],
            notes: editing?.notes ?? "",
          } satisfies FormValues
        }
        onClose={() => setEditing(undefined)}
        onSubmit={save}
      />

      <div className="mt-8">
        <Panel className="mb-4 border-0 bg-transparent p-0 shadow-none sm:p-0">
          <SectionTitle eyebrow="Hari-H" title="Kontak Darurat" />
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
