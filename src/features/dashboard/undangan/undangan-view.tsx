"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineKey, HiOutlineNoSymbol, HiOutlinePaperAirplane } from "react-icons/hi2";
import { useFeedback } from "@/components/dash/feedback";
import { FormModal, type FieldDef, type FormValues } from "@/components/dash/form-modal";
import { Modal } from "@/components/dash/modal";
import { Badge, DashHeader, Panel, SectionTitle, StatCard, btn, type Tone } from "@/components/dash/primitives";
import { defaultTemplateStyle, templateStyles } from "@/features/undangan-digital/wizard/wizard-data";
import { EmptyState, ErrorState, LoadingBlock } from "@/components/dash/states";
import { useResource } from "@/components/dash/use-resource";
import { api, ApiError } from "@/lib/vowly/client";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/vowly/format";
import type { Collaborator, Delivery, DeliveryResult, DeliveryStatus, Guest, InviteCreated, Template } from "@/lib/vowly/types";
import { useProject, useProjectApi } from "../project-context";

const deliveryLabel: Record<DeliveryStatus, { label: string; tone: Tone }> = {
  belum_dikirim: { label: "Belum dikirim", tone: "neutral" },
  mengirim: { label: "Mengirim", tone: "warning" },
  terkirim: { label: "Terkirim", tone: "success" },
  gagal: { label: "Gagal", tone: "danger" },
};

/** Permission modules a collaborator can be granted, labelled for the invite dialog (API module keys). */
const moduleLabels: Record<string, string> = {
  home: "Home",
  activity: "Aktivitas",
  profile: "Profil",
  guests: "Tamu",
  budget: "Budget",
  checklist: "Checklist",
  vendors: "Vendor",
  sessions: "Persiapan",
  documents: "Dokumen",
  deliveries: "Pengiriman undangan",
  ai: "AI Assistant",
};

function TemplatePicker() {
  const router = useRouter();
  const feedback = useFeedback();
  const { project } = useProject();
  const templates = useResource<Template[]>("/templates");
  const [saving, setSaving] = useState<string>();

  async function choose(template: Template) {
    setSaving(template.id);
    try {
      await api.put(`/invitations/${project.id}`, { template_id: template.id });
      feedback.success("Template dipilih", template.name);
      router.refresh();
    } catch (cause) {
      feedback.error("Gagal memilih template", cause instanceof ApiError ? cause.message : undefined);
    } finally {
      setSaving(undefined);
    }
  }

  return (
    <Panel className="mb-6">
      <SectionTitle eyebrow="Template" title="Tampilan undangan" aside={project.is_owner ? undefined : <Badge>Hanya pemilik</Badge>} />
      {templates.loading ? (
        <LoadingBlock rows={2} />
      ) : templates.error ? (
        <ErrorState error={templates.error} onRetry={templates.reload} />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-3">
          {(templates.data ?? []).map((template) => {
            const selected = project.template_id === template.id;
            const style = templateStyles[template.slug] ?? defaultTemplateStyle;
            return (
              <li key={template.id}>
                <button
                  type="button"
                  disabled={!project.is_owner || saving !== undefined}
                  aria-pressed={selected}
                  onClick={() => void choose(template)}
                  className={cn("w-full rounded-2xl border p-3 text-left transition disabled:opacity-60", selected ? "border-gold-foreground bg-blush/30 ring-2 ring-gold-foreground/30" : "border-gold/50 hover:bg-cream")}
                >
                  <span
                    className="relative flex aspect-[4/3] w-full items-center justify-center rounded-xl border"
                    style={{ background: style.colors[0], borderColor: style.colors[1] }}
                  >
                    <span className="font-serif text-lg font-semibold" style={{ color: style.colors[1] }}>
                      {project.title}
                    </span>
                    {selected ? <span className="absolute left-2 top-2 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold text-white">Digunakan saat ini</span> : null}
                  </span>
                  <span className="mt-3 block font-semibold">{template.name}</span>
                  <span className="block text-xs text-ink-soft">{style.tagline}</span>
                  <span className="mt-2 block text-xs font-semibold text-primary">{selected ? "Template aktif" : saving === template.id ? "Menyimpan…" : "Terapkan"}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <p className="mt-3 text-xs text-ink-soft">
        Tautan undangan: <strong className="text-ink">{project.subdomain}</strong>
      </p>
    </Panel>
  );
}

function Deliveries() {
  const path = useProjectApi();
  const feedback = useFeedback();
  const { project } = useProject();
  const [tick, setTick] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const guests = useResource<Guest[]>(path("/guests"), { limit: 100 });
  const deliveries = useResource<Delivery[]>(path("/deliveries"), { limit: 100, _r: tick || undefined });

  const byGuest = useMemo(() => new Map((deliveries.data ?? []).map((delivery) => [delivery.guest_id, delivery])), [deliveries.data]);
  const list = guests.data ?? [];

  function toggle(id: string) {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  async function send() {
    const ok = await feedback.confirm({
      title: `Kirim undangan ke ${selected.length} tamu?`,
      description: "Undangan dikirim lewat WhatsApp ke nomor tamu. Tamu yang sudah menerimanya dilewati.",
      confirmLabel: "Kirim",
    });
    if (!ok) return;
    setSending(true);
    try {
      const { data } = await api.post<DeliveryResult[]>(path("/deliveries/send"), { guest_ids: selected, resend: false });
      const sent = data.filter((item) => item.status === "terkirim").length;
      const failed = data.filter((item) => item.status === "gagal").length;
      const skipped = data.filter((item) => item.status === "dilewati").length;
      feedback.success("Pengiriman selesai", `${sent} terkirim, ${failed} gagal, ${skipped} dilewati.`);
      setSelected([]);
      setTick((value) => value + 1);
    } catch (cause) {
      feedback.error("Gagal mengirim", cause instanceof ApiError ? cause.message : undefined);
    } finally {
      setSending(false);
    }
  }

  return (
    <Panel className="mb-6">
      <SectionTitle
        eyebrow="Pengiriman"
        title="Status kirim undangan"
        aside={
          <button type="button" className={btn.primary} disabled={selected.length === 0 || sending || !project.template_id} onClick={() => void send()}>
            <HiOutlinePaperAirplane className="size-4" aria-hidden />
            {sending ? "Mengirim…" : `Kirim (${selected.length})`}
          </button>
        }
      />
      {!project.template_id ? <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">Pilih template terlebih dahulu sebelum mengirim undangan.</p> : null}
      {guests.loading || deliveries.loading ? (
        <LoadingBlock />
      ) : guests.error || deliveries.error ? (
        <ErrorState error={guests.error ?? deliveries.error} onRetry={() => { guests.reload(); deliveries.reload(); }} />
      ) : list.length === 0 ? (
        <EmptyState title="Belum ada tamu" description="Tambahkan tamu di menu Guest List." />
      ) : (
        <ul className="divide-y divide-gold/30">
          {list.map((guest) => {
            const delivery = byGuest.get(guest.id);
            const status = deliveryLabel[delivery?.status ?? "belum_dikirim"];
            return (
              <li key={guest.id} className="flex items-center gap-3 py-2.5 text-sm">
                <input type="checkbox" aria-label={`Pilih ${guest.full_name}`} checked={selected.includes(guest.id)} onChange={() => toggle(guest.id)} className="size-4 accent-primary" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{guest.display_name}</span>
                  <span className="block text-xs text-ink-soft">{guest.phone || "Tanpa nomor WhatsApp"}</span>
                </span>
                <Badge tone={status.tone}>{status.label}</Badge>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}

function Collaborators() {
  const path = useProjectApi();
  const feedback = useFeedback();
  const { project } = useProject();
  const list = useResource<Collaborator[]>(path("/collaborators"), undefined, project.is_owner);
  const [inviting, setInviting] = useState(false);
  const [token, setToken] = useState<{ email: string; value: string }>();

  if (!project.is_owner) return null;

  const fields: FieldDef[] = [
    { kind: "email", name: "email", label: "Email kolaborator", required: true, maxLength: 254, span: 2, hint: "Harus sama dengan email akun yang akan menerima undangan." },
    {
      kind: "select",
      name: "role",
      label: "Peran",
      required: true,
      options: [
        { value: "pasangan", label: "Pasangan (akses penuh)" },
        { value: "panitia_vendor", label: "Panitia / vendor (terbatas)" },
      ],
    },
    {
      kind: "multi",
      name: "write",
      label: "Izin ubah (opsional, menimpa bawaan peran)",
      span: 2,
      options: Object.entries(moduleLabels).map(([value, label]) => ({ value, label })),
    },
  ];

  async function invite(values: FormValues) {
    const write = Array.isArray(values.write) ? values.write : [];
    const body: Record<string, unknown> = { email: String(values.email ?? "").trim(), role: values.role };
    if (write.length > 0) body.permissions = Object.fromEntries(write.map((module) => [module, "write"]));
    const { data } = await api.post<InviteCreated>(path("/collaborators"), body);
    setInviting(false);
    setToken({ email: data.collaborator.email, value: data.invite_token });
    list.reload();
  }

  async function regenerate(row: Collaborator) {
    try {
      const { data } = await api.post<InviteCreated>(path(`/collaborators/${row.id}/token`));
      setToken({ email: row.email, value: data.invite_token });
    } catch (cause) {
      feedback.error("Gagal membuat token", cause instanceof ApiError ? cause.message : undefined);
    }
  }

  async function revoke(row: Collaborator) {
    const ok = await feedback.confirm({ title: "Cabut akses?", description: `${row.email} langsung kehilangan akses ke proyek ini.`, confirmLabel: "Cabut", danger: true });
    if (!ok) return;
    try {
      await api.delete(path(`/collaborators/${row.id}`));
      feedback.success("Akses dicabut");
      list.reload();
    } catch (cause) {
      feedback.error("Gagal mencabut akses", cause instanceof ApiError ? cause.message : undefined);
    }
  }

  const statusTone: Record<Collaborator["status"], Tone> = { pending: "warning", accepted: "success", revoked: "neutral" };
  const statusText: Record<Collaborator["status"], string> = { pending: "Menunggu", accepted: "Aktif", revoked: "Dicabut" };

  return (
    <Panel>
      <SectionTitle
        eyebrow="Kolaborasi"
        title="Pasangan & panitia"
        aside={
          <button type="button" className={btn.primary} onClick={() => setInviting(true)}>
            Undang kolaborator
          </button>
        }
      />
      {list.loading ? (
        <LoadingBlock rows={2} />
      ) : list.error ? (
        <ErrorState error={list.error} onRetry={list.reload} />
      ) : !list.data || list.data.length === 0 ? (
        <EmptyState title="Belum ada kolaborator" description="Undang pasangan atau panitia untuk membantu mengelola proyek." />
      ) : (
        <ul className="divide-y divide-gold/30">
          {list.data.map((row) => (
            <li key={row.id} className="flex flex-wrap items-center gap-3 py-3 text-sm">
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{row.email}</span>
                <span className="block text-xs text-ink-soft">
                  {row.role === "pasangan" ? "Pasangan" : "Panitia / vendor"} • diundang {formatDate(row.created_at, "short")}
                </span>
              </span>
              <Badge tone={statusTone[row.status]}>{statusText[row.status]}</Badge>
              {row.status === "pending" ? (
                <button type="button" className={btn.icon} aria-label="Buat token baru" onClick={() => void regenerate(row)}>
                  <HiOutlineKey className="size-4" aria-hidden />
                </button>
              ) : null}
              {row.status !== "revoked" ? (
                <button type="button" className={btn.icon} aria-label="Cabut akses" onClick={() => void revoke(row)}>
                  <HiOutlineNoSymbol className="size-4" aria-hidden />
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      <FormModal open={inviting} title="Undang kolaborator" fields={fields} initial={{ email: "", role: "pasangan", write: [] }} submitLabel="Buat undangan" onClose={() => setInviting(false)} onSubmit={invite} />

      <Modal open={token !== undefined} title="Token undangan" description="Token hanya ditampilkan sekali. Bagikan ke penerima sendiri; belum ada pengiriman email." onClose={() => setToken(undefined)}>
        {token ? (
          <div className="space-y-3">
            <p className="text-sm">
              Untuk <strong>{token.email}</strong>. Penerima memasukkannya di halaman <code className="rounded bg-muted px-1">/kolaborasi/terima</code> setelah masuk dengan email yang sama.
            </p>
            <input readOnly value={token.value} aria-label="Token undangan" onFocus={(event) => event.currentTarget.select()} className="h-10 w-full rounded-lg border border-gold/70 bg-cream px-3 font-mono text-xs" />
            <div className="flex justify-end gap-2">
              <button type="button" className={btn.secondary} onClick={() => void navigator.clipboard.writeText(token.value).then(() => feedback.success("Token disalin"))}>
                Salin
              </button>
              <button type="button" className={btn.primary} onClick={() => setToken(undefined)}>
                Selesai
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </Panel>
  );
}

function Overview() {
  const path = useProjectApi();
  const { project } = useProject();
  const guests = useResource<Guest[]>(path("/guests"), { limit: 100 });
  const deliveries = useResource<Delivery[]>(path("/deliveries"), { limit: 100 });
  const total = guests.meta?.total ?? 0;
  const sent = (deliveries.data ?? []).filter((item) => item.status === "terkirim").length;
  const attending = (guests.data ?? []).filter((guest) => guest.rsvp_status === "hadir");
  const pax = attending.reduce((sum, guest) => sum + guest.pax, 0);
  const pending = (guests.data ?? []).filter((guest) => guest.rsvp_status === "belum_respons").length;
  const declined = (guests.data ?? []).filter((guest) => guest.rsvp_status === "tidak_hadir").length;
  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <StatCard label="Web Undangan" value={project.title} hint={project.template_id ? `${project.subdomain}.vowly.id` : "Belum memilih template"} />
      <StatCard label="Progres Broadcast" value={`${sent} / ${total}`} hint={total > 0 ? `${Math.round((sent / total) * 100)}% undangan terkirim` : "Belum ada tamu"} />
      <StatCard label="Total Konfirmasi RSVP" value={`${attending.length} Hadir`} hint={`${pax} pax • ${pending} menunggu • ${declined} berhalangan`} />
    </div>
  );
}

export function UndanganView() {
  return (
    <>
      <DashHeader title="Undangan Digital & Status Pengiriman" description="Kelola template website undangan, kirim broadcast WhatsApp, dan pantau status pengiriman serta RSVP langsung dari satu dasbor." />
      <Overview />
      <TemplatePicker />
      <Deliveries />
      <Collaborators />
    </>
  );
}
