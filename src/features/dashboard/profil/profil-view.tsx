"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFeedback } from "@/components/dash/feedback";
import { useResource } from "@/components/dash/use-resource";
import { FormModal, type FieldDef, type FormValues } from "@/components/dash/form-modal";
import { Badge, DashHeader, Panel, ProgressBar, SectionTitle, btn } from "@/components/dash/primitives";
import { api } from "@/lib/vowly/client";
import { formatDate, formatRupiah, parseRupiah } from "@/lib/vowly/format";
import type { CoupleMember, GiftAccount } from "@/lib/vowly/types";
import { CrudTable } from "../crud/crud-table";
import { initialText, text } from "../crud/payload";
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

function ProjectSettings() {
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
    <Panel className="mb-6">
      <SectionTitle
        eyebrow="Proyek"
        title={project.title}
        aside={
          project.is_owner ? (
            <button type="button" className={btn.secondary} onClick={() => setOpen(true)}>
              Ubah pengaturan
            </button>
          ) : (
            <Badge>Hanya pemilik yang dapat mengubah</Badge>
          )
        }
      />
      <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
        {[
          ["Tanggal acara", formatDate(project.event_date)],
          ["Tautan undangan", project.subdomain],
          ["Lokasi", [project.venue, project.city].filter(Boolean).join(", ") || "-"],
          ["Perkiraan tamu", project.guest_count ? String(project.guest_count) : "-"],
          ["Total anggaran", formatRupiah(project.total_budget)],
          ["Hashtag", project.hashtags.length ? project.hashtags.join(" ") : "-"],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs text-ink-soft">{label}</dt>
            <dd className="font-medium">{value}</dd>
          </div>
        ))}
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
    </Panel>
  );
}

function ChangePassword() {
  const feedback = useFeedback();
  const [open, setOpen] = useState(false);
  return (
    <Panel>
      <SectionTitle eyebrow="Akun" title="Keamanan" aside={<button type="button" className={btn.secondary} onClick={() => setOpen(true)}>Ganti password</button>} />
      <p className="text-sm text-ink-soft">Gunakan password yang berbeda dari password lama (6–72 karakter).</p>
      <FormModal
        open={open}
        title="Ganti password"
        fields={[
          { kind: "text", name: "current_password", label: "Password saat ini", required: true, span: 2 },
          { kind: "text", name: "new_password", label: "Password baru", required: true, span: 2 },
        ]}
        initial={{ current_password: "", new_password: "" }}
        onClose={() => setOpen(false)}
        onSubmit={async (values) => {
          await api.post("/auth/change-password", { current_password: text(values, "current_password"), new_password: text(values, "new_password") });
          feedback.success("Password diganti");
          setOpen(false);
        }}
      />
    </Panel>
  );
}

/**
 * Share of profile fields filled in: project basics, both couple members, and at least one gift account.
 * Pure so the percentage on the hero card is testable.
 */
export function profileCompleteness(input: { venue: string | null; city: string | null; guestCount: number | null; loveStory: string | null; totalBudget: number; members: number; giftAccounts: number }): number {
  const checks = [Boolean(input.venue), Boolean(input.city), Boolean(input.guestCount), Boolean(input.loveStory), input.totalBudget > 0, input.members >= 2, input.giftAccounts >= 1];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function Hero() {
  const { project } = useProject();
  const path = useProjectApi();
  const members = useResource<CoupleMember[]>(path("/couple-members"), { limit: 10 });
  const gifts = useResource<GiftAccount[]>(path("/gift-accounts"), { limit: 10 });
  const pct = profileCompleteness({
    venue: project.venue,
    city: project.city,
    guestCount: project.guest_count,
    loveStory: project.love_story,
    totalBudget: project.total_budget,
    members: members.meta?.total ?? members.data?.length ?? 0,
    giftAccounts: gifts.meta?.total ?? gifts.data?.length ?? 0,
  });
  const groom = members.data?.find((member) => member.role === "groom");
  const bride = members.data?.find((member) => member.role === "bride");
  return (
    <div className="mb-6 grid gap-4 rounded-2xl border border-gold/50 bg-gradient-to-br from-gold/40 to-blush/30 p-6 lg:grid-cols-[1fr_300px]">
      <div>
        <Badge tone="gold">Pasangan Vowly</Badge>
        <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight">
          {groom && bride ? `${groom.full_name} & ${bride.full_name}` : project.title}
        </h2>
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

export function ProfilView() {
  return (
    <>
      <DashHeader title="Profil Calon Mempelai & Pengaturan Pernikahan" description="Kelola data pribadi kedua mempelai, identitas hari bahagia, susunan panitia keluarga, serta preferensi akun Vowly Anda." />
      <Hero />
      <ProjectSettings />

      <div className="mb-6">
        <CrudTable<CoupleMember>
          resource="/couple-members"
          noun="mempelai"
          columns={[
            { header: "Peran", cell: (row) => (row.role === "groom" ? "Pria" : "Wanita") },
            { header: "Nama", cell: (row) => <span className="font-medium">{row.full_name}</span> },
            { header: "Panggilan", cell: (row) => row.nickname },
            { header: "Orang tua", cell: (row) => `${row.father_name} & ${row.mother_name}` },
            { header: "WhatsApp", cell: (row) => row.whatsapp },
          ]}
          fields={[
            { kind: "select", name: "role", label: "Peran", required: true, options: [{ value: "groom", label: "Mempelai pria" }, { value: "bride", label: "Mempelai wanita" }] },
            { kind: "text", name: "full_name", label: "Nama lengkap", required: true, maxLength: 150 },
            { kind: "text", name: "nickname", label: "Nama panggilan", required: true, maxLength: 60 },
            { kind: "tel", name: "whatsapp", label: "WhatsApp", required: true, maxLength: 32 },
            { kind: "text", name: "father_name", label: "Nama ayah", required: true, maxLength: 150 },
            { kind: "text", name: "mother_name", label: "Nama ibu", required: true, maxLength: 150 },
            { kind: "text", name: "birth_order", label: "Anak ke", maxLength: 120, placeholder: "Putra pertama dari 3 bersaudara" },
            { kind: "text", name: "instagram", label: "Instagram", maxLength: 60 },
          ]}
          toInitial={(row): FormValues => ({
            role: row?.role ?? "groom",
            full_name: row?.full_name ?? "",
            nickname: row?.nickname ?? "",
            whatsapp: row?.whatsapp ?? "",
            father_name: row?.father_name ?? "",
            mother_name: row?.mother_name ?? "",
            birth_order: row?.birth_order ?? "",
            instagram: row?.instagram ?? "",
          })}
          toPayload={(values, mode) => {
            const body: Record<string, unknown> = {
              full_name: text(values, "full_name"),
              nickname: text(values, "nickname"),
              whatsapp: text(values, "whatsapp"),
              father_name: text(values, "father_name"),
              mother_name: text(values, "mother_name"),
              birth_order: mode === "create" && text(values, "birth_order") === "" ? undefined : text(values, "birth_order"),
              instagram: mode === "create" && text(values, "instagram") === "" ? undefined : text(values, "instagram"),
            };
            // The role is fixed once created (one member per role), so it is only sent on create.
            if (mode === "create") body.role = text(values, "role");
            return body;
          }}
        />
      </div>

      <div className="mb-6">
        <CrudTable<GiftAccount>
          resource="/gift-accounts"
          noun="rekening"
          columns={[
            { header: "Bank", cell: (row) => <span className="font-medium">{row.bank}</span> },
            { header: "No. rekening", cell: (row) => row.account_number },
            { header: "Atas nama", cell: (row) => row.account_name },
          ]}
          fields={[
            { kind: "text", name: "bank", label: "Bank", required: true, maxLength: 60 },
            { kind: "text", name: "account_number", label: "Nomor rekening", required: true, maxLength: 40 },
            { kind: "text", name: "account_name", label: "Atas nama", required: true, maxLength: 150, span: 2 },
          ]}
          toInitial={(row): FormValues => ({ bank: row?.bank ?? "", account_number: row?.account_number ?? "", account_name: row?.account_name ?? "" })}
          toPayload={(values) => ({ bank: text(values, "bank"), account_number: text(values, "account_number"), account_name: text(values, "account_name") })}
        />
      </div>

      <ChangePassword />
    </>
  );
}
