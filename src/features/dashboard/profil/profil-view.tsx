"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiOutlineCalendarDays, HiOutlineKey, HiOutlinePencilSquare, HiOutlinePlus, HiOutlineTrash, HiOutlineUserPlus } from "react-icons/hi2";
import { useFeedback } from "@/components/dash/feedback";
import { FormModal, type FieldDef, type FormValues } from "@/components/dash/form-modal";
import { LogoutButton } from "@/components/dash/logout-button";
import { Badge, DashHeader, Panel, ProgressBar, btn } from "@/components/dash/primitives";
import { EmptyState, LoadingBlock } from "@/components/dash/states";
import { useResource } from "@/components/dash/use-resource";
import { api, ApiError } from "@/lib/vowly/client";
import { formatDate, formatRupiah, initials, parseRupiah } from "@/lib/vowly/format";
import type { Collaborator, CoupleMember, GiftAccount } from "@/lib/vowly/types";
import { initialText, text } from "../crud/payload";
import { projectHref } from "../nav";
import { useProject, useProjectApi } from "../project-context";

const settingsFields: FieldDef[] = [
  { kind: "text", name: "title", label: "Judul proyek", required: true, maxLength: 150, span: 2 },
  { kind: "text", name: "groom_name", label: "Nama mempelai pria", required: true, maxLength: 100 },
  { kind: "text", name: "bride_name", label: "Nama mempelai wanita", required: true, maxLength: 100 },
  { kind: "date", name: "event_date", label: "Tanggal acara", required: true },
  { kind: "number", name: "guest_count", label: "Perkiraan jumlah tamu", min: 1 },
  { kind: "text", name: "venue", label: "Lokasi / gedung", maxLength: 200 },
  { kind: "text", name: "city", label: "Kota", maxLength: 100 },
  { kind: "textarea", name: "address", label: "Alamat", maxLength: 500, span: 2 },
  { kind: "money", name: "total_budget", label: "Total anggaran" },
  { kind: "text", name: "hashtags", label: "Hashtag", hint: "Pisahkan dengan koma. Maksimal 20.", maxLength: 600 },
  { kind: "textarea", name: "love_story", label: "Kisah cinta", maxLength: 5000, rows: 5, span: 2 },
];

const memberFields: FieldDef[] = [
  { kind: "text", name: "full_name", label: "Nama lengkap & gelar", required: true, maxLength: 150 },
  { kind: "text", name: "nickname", label: "Nama panggilan akrab", required: true, maxLength: 60 },
  { kind: "text", name: "father_name", label: "Nama ayah kandung", required: true, maxLength: 150 },
  { kind: "text", name: "mother_name", label: "Nama ibu kandung", required: true, maxLength: 150 },
  { kind: "text", name: "birth_order", label: "Urutan anak dalam keluarga", maxLength: 120, placeholder: "Putra pertama dari 3 bersaudara" },
  { kind: "text", name: "instagram", label: "Akun Instagram", maxLength: 60 },
  { kind: "tel", name: "whatsapp", label: "Nomor WhatsApp aktif", required: true, maxLength: 32, span: 2 },
];

const giftFields: FieldDef[] = [
  { kind: "text", name: "bank", label: "Bank", required: true, maxLength: 60 },
  { kind: "text", name: "account_number", label: "Nomor rekening", required: true, maxLength: 40 },
  { kind: "text", name: "account_name", label: "Atas nama", required: true, maxLength: 150, span: 2 },
];

/**
 * Share of profile fields filled in: project basics, both couple members, and at least one gift account.
 * Pure so the percentage on the hero card is testable.
 */
export function profileCompleteness(input: { venue: string | null; city: string | null; guestCount: number | null; loveStory: string | null; totalBudget: number; members: number; giftAccounts: number }): number {
  const checks = [Boolean(input.venue), Boolean(input.city), Boolean(input.guestCount), Boolean(input.loveStory), input.totalBudget > 0, input.members >= 2, input.giftAccounts >= 1];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function Card({ title, subtitle, action, children, badge }: { title: string; subtitle?: string; action?: ReactNode; children: ReactNode; badge?: ReactNode }) {
  return (
    <Panel>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-serif text-xl font-semibold">
            {title}
            {badge}
          </h2>
          {subtitle ? <p className="mt-0.5 text-xs text-ink-soft">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </Panel>
  );
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-ink-soft">{label}</dt>
      <dd className="mt-0.5 rounded-lg bg-cream px-3 py-2 text-sm font-medium">{value || "-"}</dd>
    </div>
  );
}

function Hero({ members, giftCount }: { members: CoupleMember[]; giftCount: number }) {
  const { project } = useProject();
  const pct = profileCompleteness({
    venue: project.venue,
    city: project.city,
    guestCount: project.guest_count,
    loveStory: project.love_story,
    totalBudget: project.total_budget,
    members: members.length,
    giftAccounts: giftCount,
  });
  const groom = members.find((member) => member.role === "groom");
  const bride = members.find((member) => member.role === "bride");
  return (
    <div className="mb-6 grid gap-4 rounded-2xl border border-gold/50 bg-gradient-to-br from-gold/40 to-blush/30 p-6 lg:grid-cols-[1fr_300px]">
      <div>
        <Badge tone="gold">Pasangan Vowly</Badge>
        <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight">{groom && bride ? `${groom.full_name} & ${bride.full_name}` : project.title}</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Akad &amp; Resepsi: {formatDate(project.event_date)}
          {project.venue ? ` • ${project.venue}${project.city ? `, ${project.city}` : ""}` : ""}
        </p>
      </div>
      <div className="rounded-xl bg-white/80 p-4">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span>Kelengkapan Profil</span>
          <span>{pct}%</span>
        </div>
        <div className="mt-2">
          <ProgressBar value={pct} />
        </div>
        <p className="mt-2 text-xs text-ink-soft">Lengkapi lokasi, kisah cinta, anggaran, kedua mempelai, dan rekening angpao.</p>
      </div>
    </div>
  );
}

function MemberCard({ role, member, onChanged }: { role: "groom" | "bride"; member?: CoupleMember; onChanged: () => void }) {
  const path = useProjectApi();
  const feedback = useFeedback();
  const [open, setOpen] = useState(false);
  const groom = role === "groom";

  async function save(values: FormValues) {
    const optional = (name: string) => (text(values, name) === "" && !member ? undefined : text(values, name));
    const body: Record<string, unknown> = {
      full_name: text(values, "full_name"),
      nickname: text(values, "nickname"),
      whatsapp: text(values, "whatsapp"),
      father_name: text(values, "father_name"),
      mother_name: text(values, "mother_name"),
      birth_order: optional("birth_order"),
      instagram: optional("instagram"),
    };
    if (member) await api.put(path(`/couple-members/${member.id}`), body);
    else await api.post(path("/couple-members"), { ...body, role });
    feedback.success(member ? "Biodata disimpan" : "Biodata ditambahkan");
    setOpen(false);
    onChanged();
  }

  async function remove() {
    if (!member) return;
    const ok = await feedback.confirm({ title: "Hapus biodata?", description: member.full_name, confirmLabel: "Hapus", danger: true });
    if (!ok) return;
    try {
      await api.delete(path(`/couple-members/${member.id}`));
      feedback.success("Biodata dihapus");
      onChanged();
    } catch (cause) {
      feedback.error("Gagal menghapus", cause instanceof ApiError ? cause.message : undefined);
    }
  }

  return (
    <Card
      title={groom ? "Biodata Calon Mempelai Pria" : "Biodata Calon Mempelai Wanita"}
      subtitle={`Informasi identitas lengkap calon pengantin ${groom ? "pria" : "wanita"} untuk buku nikah & undangan.`}
      badge={<Badge tone={groom ? "gold" : "blush"}>{groom ? "Groom" : "Bride"}</Badge>}
      action={
        <span className="flex gap-1">
          <button type="button" className={btn.icon} aria-label={member ? "Ubah biodata" : "Tambah biodata"} onClick={() => setOpen(true)}>
            {member ? <HiOutlinePencilSquare className="size-4" aria-hidden /> : <HiOutlinePlus className="size-4" aria-hidden />}
          </button>
          {member ? (
            <button type="button" className={btn.icon} aria-label="Hapus biodata" onClick={() => void remove()}>
              <HiOutlineTrash className="size-4" aria-hidden />
            </button>
          ) : null}
        </span>
      }
    >
      {member ? (
        <dl className="grid gap-3 sm:grid-cols-2">
          <Field label="Nama Lengkap & Gelar" value={member.full_name} />
          <Field label="Nama Panggilan Akrab" value={member.nickname} />
          <Field label="Nama Ayah Kandung" value={member.father_name} />
          <Field label="Nama Ibu Kandung" value={member.mother_name} />
          <Field label="Urutan Anak dalam Keluarga" value={member.birth_order} />
          <Field label="Akun Instagram" value={member.instagram ? `@${member.instagram.replace(/^@/, "")}` : null} />
          <div className="sm:col-span-2">
            <Field label="Nomor WhatsApp Aktif" value={member.whatsapp} />
          </div>
        </dl>
      ) : (
        <div className="flex items-center gap-3 rounded-xl bg-cream p-4 text-sm text-ink-soft">
          <span className="grid size-10 place-items-center rounded-full bg-gold/50 font-semibold text-gold-foreground">{groom ? "P" : "W"}</span>
          Biodata belum diisi. Lengkapi untuk ditampilkan di undangan.
        </div>
      )}
      <FormModal
        open={open}
        title={member ? "Ubah biodata" : "Tambah biodata"}
        wide
        fields={memberFields}
        initial={{
          full_name: member?.full_name ?? "",
          nickname: member?.nickname ?? "",
          father_name: member?.father_name ?? "",
          mother_name: member?.mother_name ?? "",
          birth_order: member?.birth_order ?? "",
          instagram: member?.instagram ?? "",
          whatsapp: member?.whatsapp ?? "",
        }}
        onClose={() => setOpen(false)}
        onSubmit={save}
      />
    </Card>
  );
}

function ProjectCard() {
  const router = useRouter();
  const feedback = useFeedback();
  const { project } = useProject();
  const [open, setOpen] = useState(false);

  async function save(values: FormValues) {
    const budget = text(values, "total_budget");
    const guests = text(values, "guest_count");
    await api.put(`/invitations/${project.id}`, {
      title: text(values, "title"),
      groom_name: text(values, "groom_name"),
      bride_name: text(values, "bride_name"),
      event_date: text(values, "event_date"),
      venue: text(values, "venue"),
      city: text(values, "city"),
      address: text(values, "address"),
      guest_count: guests === "" ? undefined : Number(guests),
      total_budget: budget === "" ? 0 : parseRupiah(budget),
      love_story: text(values, "love_story"),
      hashtags: text(values, "hashtags")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
    feedback.success("Pengaturan proyek disimpan");
    setOpen(false);
    router.refresh();
  }

  return (
    <Card
      title="Kisah Kasih & Detail Hari Bahagia"
      subtitle="Ditampilkan pada e-invitation dan buku program."
      action={
        project.is_owner ? (
          <button type="button" className={btn.secondary} onClick={() => setOpen(true)}>
            Ubah pengaturan
          </button>
        ) : (
          <Badge>Hanya pemilik yang dapat mengubah</Badge>
        )
      }
    >
      <p className="rounded-xl bg-cream p-4 text-sm leading-6 text-ink">{project.love_story || "Kisah cinta belum diisi."}</p>
      <div className="mt-4">
        <p className="text-xs text-ink-soft">Tagar Resmi Pernikahan</p>
        <p className="mt-1.5 flex flex-wrap gap-2">
          {project.hashtags.length > 0 ? project.hashtags.map((tag) => <Badge key={tag}>{tag.startsWith("#") ? tag : `#${tag}`}</Badge>) : <span className="text-sm text-ink-soft">-</span>}
        </p>
      </div>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Lokasi" value={[project.venue, project.city].filter(Boolean).join(", ")} />
        <Field label="Total Anggaran" value={formatRupiah(project.total_budget)} />
        <div className="sm:col-span-2">
          <Field label="Alamat" value={project.address} />
        </div>
      </dl>
      <FormModal
        open={open}
        title="Pengaturan proyek"
        wide
        fields={settingsFields}
        initial={{
          title: project.title,
          groom_name: project.groom_name,
          bride_name: project.bride_name,
          event_date: project.event_date.slice(0, 10),
          guest_count: initialText(project.guest_count),
          venue: project.venue ?? "",
          city: project.city ?? "",
          address: project.address ?? "",
          total_budget: initialText(project.total_budget),
          hashtags: project.hashtags.join(", "),
          love_story: project.love_story ?? "",
        }}
        onClose={() => setOpen(false)}
        onSubmit={save}
      />
    </Card>
  );
}

function PlanCard() {
  const { project, daysUntil } = useProject();
  return (
    <Card title="Rencana Pernikahan" badge={daysUntil !== null && daysUntil > 0 ? <Badge tone="gold">H-{daysUntil}</Badge> : undefined}>
      <ul className="space-y-2 text-sm">
        {[
          ["Akad & Resepsi", formatDate(project.event_date)],
          ["Lokasi", [project.venue, project.city].filter(Boolean).join(", ") || "Belum diisi"],
          ["Estimasi Tamu Undangan", project.guest_count ? `${project.guest_count} Undangan` : "Belum diisi"],
        ].map(([label, value]) => (
          <li key={label} className="flex items-start gap-3 rounded-xl bg-cream p-3">
            <HiOutlineCalendarDays className="mt-0.5 size-4 shrink-0 text-gold-foreground" aria-hidden />
            <span>
              <span className="block font-medium">{label}</span>
              <span className="block text-xs text-ink-soft">{value}</span>
            </span>
          </li>
        ))}
      </ul>
      <Link href={projectHref(project.id, "persiapan")} className="mt-3 block text-center text-sm font-semibold text-primary">
        Kelola di Menu Persiapan →
      </Link>
    </Card>
  );
}

function CollaboratorsCard() {
  const { project, user } = useProject();
  const path = useProjectApi();
  const list = useResource<Collaborator[]>(path("/collaborators"), undefined, project.is_owner);
  const statusText = { pending: "Menunggu", accepted: "Aktif", revoked: "Dicabut" } as const;
  return (
    <Card title="Akses Kolaborator" badge={project.is_owner && list.data ? <Badge>{list.data.length + 1} Anggota</Badge> : undefined}>
      <ul className="space-y-2 text-sm">
        <li className="flex items-center gap-3 rounded-xl bg-cream p-3">
          <span className="grid size-9 place-items-center rounded-full bg-blush text-xs font-semibold text-blush-foreground">{initials(user.name)}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-medium">{user.name}</span>
            <span className="block text-xs text-ink-soft">{project.is_owner ? "Owner (Anda)" : "Kolaborator (Anda)"}</span>
          </span>
        </li>
        {(list.data ?? []).map((row) => (
          <li key={row.id} className="flex items-center gap-3 rounded-xl bg-cream p-3">
            <span className="grid size-9 place-items-center rounded-full bg-gold/50 text-xs font-semibold text-gold-foreground">{initials(row.email)}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">{row.email}</span>
              <span className="block text-xs text-ink-soft">{row.role === "pasangan" ? "Pasangan" : "Panitia / vendor"}</span>
            </span>
            <Badge tone={row.status === "accepted" ? "success" : row.status === "pending" ? "warning" : "neutral"}>{statusText[row.status]}</Badge>
          </li>
        ))}
      </ul>
      {project.is_owner ? (
        <Link href={projectHref(project.id, "undangan")} className={`${btn.secondary} mt-3 w-full`}>
          <HiOutlineUserPlus className="size-4" aria-hidden /> Undang Keluarga / WO
        </Link>
      ) : null}
    </Card>
  );
}

function GiftCard({ gifts, loading, onChanged }: { gifts: GiftAccount[]; loading: boolean; onChanged: () => void }) {
  const path = useProjectApi();
  const feedback = useFeedback();
  const [editing, setEditing] = useState<GiftAccount | null | undefined>(undefined);

  async function save(values: FormValues) {
    const body = { bank: text(values, "bank"), account_number: text(values, "account_number"), account_name: text(values, "account_name") };
    if (editing) await api.put(path(`/gift-accounts/${editing.id}`), body);
    else await api.post(path("/gift-accounts"), body);
    feedback.success(editing ? "Rekening disimpan" : "Rekening ditambahkan");
    setEditing(undefined);
    onChanged();
  }

  async function remove(gift: GiftAccount) {
    const ok = await feedback.confirm({ title: "Hapus rekening?", description: `${gift.bank} • ${gift.account_name}`, confirmLabel: "Hapus", danger: true });
    if (!ok) return;
    try {
      await api.delete(path(`/gift-accounts/${gift.id}`));
      feedback.success("Rekening dihapus");
      onChanged();
    } catch (cause) {
      feedback.error("Gagal menghapus", cause instanceof ApiError ? cause.message : undefined);
    }
  }

  return (
    <Card
      title="Rekening & Angpao Digital"
      action={
        <button type="button" className={btn.icon} aria-label="Tambah rekening" onClick={() => setEditing(null)}>
          <HiOutlinePlus className="size-4" aria-hidden />
        </button>
      }
    >
      {loading ? (
        <LoadingBlock rows={2} />
      ) : gifts.length === 0 ? (
        <EmptyState title="Belum ada rekening" description="Tambahkan rekening untuk angpao digital." />
      ) : (
        <ul className="space-y-2 text-sm">
          {gifts.map((gift) => (
            <li key={gift.id} className="flex items-center gap-3 rounded-xl bg-cream p-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white text-[11px] font-bold text-primary">{gift.bank.slice(0, 4).toUpperCase()}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{gift.account_number}</span>
                <span className="block truncate text-xs text-ink-soft">a.n {gift.account_name}</span>
              </span>
              <button type="button" className={btn.icon} aria-label={`Ubah rekening ${gift.bank}`} onClick={() => setEditing(gift)}>
                <HiOutlinePencilSquare className="size-4" aria-hidden />
              </button>
              <button type="button" className={btn.icon} aria-label={`Hapus rekening ${gift.bank}`} onClick={() => void remove(gift)}>
                <HiOutlineTrash className="size-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
      <FormModal
        open={editing !== undefined}
        title={editing ? "Ubah rekening" : "Tambah rekening"}
        fields={giftFields}
        initial={{ bank: editing?.bank ?? "", account_number: editing?.account_number ?? "", account_name: editing?.account_name ?? "" }}
        onClose={() => setEditing(undefined)}
        onSubmit={save}
      />
    </Card>
  );
}

function SecurityCard() {
  const feedback = useFeedback();
  const { user } = useProject();
  const [open, setOpen] = useState(false);
  return (
    <Card title="Keamanan Akun">
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-3 rounded-xl bg-cream p-3">
          <dt className="text-ink-soft">Email Login</dt>
          <dd className="truncate font-medium">{user.email}</dd>
        </div>
      </dl>
      <button type="button" className={`${btn.secondary} mt-3 w-full`} onClick={() => setOpen(true)}>
        <HiOutlineKey className="size-4" aria-hidden /> Ganti password
      </button>
      <LogoutButton className={`${btn.danger} mt-2 w-full`} label="Keluar dari akun" />
      <FormModal
        open={open}
        title="Ganti password"
        fields={[
          { kind: "text", name: "current_password", label: "Password saat ini", required: true, span: 2 },
          { kind: "text", name: "new_password", label: "Password baru", required: true, span: 2, hint: "6–72 karakter dan berbeda dari yang lama." },
        ]}
        initial={{ current_password: "", new_password: "" }}
        onClose={() => setOpen(false)}
        onSubmit={async (values) => {
          await api.post("/auth/change-password", { current_password: text(values, "current_password"), new_password: text(values, "new_password") });
          feedback.success("Password diganti");
          setOpen(false);
        }}
      />
    </Card>
  );
}

export function ProfilView() {
  const path = useProjectApi();
  const [tick, setTick] = useState(0);
  const members = useResource<CoupleMember[]>(path("/couple-members"), { limit: 10, _r: tick || undefined });
  const gifts = useResource<GiftAccount[]>(path("/gift-accounts"), { limit: 20, _r: tick || undefined });
  const reload = () => setTick((value) => value + 1);
  const list = members.data ?? [];

  return (
    <>
      <DashHeader title="Profil Calon Mempelai & Pengaturan Pernikahan" description="Kelola data pribadi kedua mempelai, identitas hari bahagia, susunan panitia keluarga, serta preferensi akun Vowly Anda." />
      <Hero members={list} giftCount={gifts.data?.length ?? 0} />
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <MemberCard role="groom" member={list.find((member) => member.role === "groom")} onChanged={reload} />
          <MemberCard role="bride" member={list.find((member) => member.role === "bride")} onChanged={reload} />
          <ProjectCard />
        </div>
        <div className="space-y-6">
          <PlanCard />
          <CollaboratorsCard />
          <GiftCard gifts={gifts.data ?? []} loading={gifts.loading} onChanged={reload} />
          <SecurityCard />
        </div>
      </div>
    </>
  );
}
