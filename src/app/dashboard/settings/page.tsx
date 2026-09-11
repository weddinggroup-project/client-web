import {
  Bell,
  CreditCard,
  KeyRound,
  LockKeyhole,
  MapPinned,
  ReceiptText,
  ShieldCheck,
  SlidersHorizontal,
  Store,
  UserCog,
  UsersRound,
} from "lucide-react";
import { requireSession } from "@/lib/auth/session";

const adminSections = [
  {
    title: "Operasional Platform",
    description: "Konfigurasi identitas platform, paket default, dan aturan pemesanan.",
    icon: Store,
    items: ["Nama platform: Vowly", "Mata uang: IDR", "Zona waktu: Asia/Jakarta"],
  },
  {
    title: "Akses Admin",
    description: "Kontrol kebijakan akses owner, admin, dan konsultan pernikahan.",
    icon: ShieldCheck,
    items: ["Persetujuan owner diperlukan", "Role template aktif", "Audit trail tersimpan"],
  },
  {
    title: "Keamanan",
    description: "Pengaturan password, MFA, dan sesi untuk siap produksi.",
    icon: LockKeyhole,
    items: ["MFA direkomendasikan", "Sesi aktif 7 hari", "Tinjauan perangkat aktif"],
  },
];

const policyRows = [
  { label: "Notifikasi pesanan baru", value: "Aktif", icon: Bell },
  { label: "Verifikasi pembayaran manual", value: "Diperlukan", icon: CreditCard },
  { label: "Zona wilayah tersedia", value: "34 provinsi", icon: MapPinned },
  { label: "SLA respon konsultan", value: "24 jam", icon: UserCog },
];

export default async function SettingsPage() {
  await requireSession();

  return (
    <div className="mx-auto max-w-[1320px] space-y-5">
      <section className="rounded-xl border border-neutral-200/70 bg-white p-5 shadow-sm shadow-neutral-200/50">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
              Pengaturan Platform
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Konfigurasi admin untuk operasional, akses, dan kebijakan platform Vowly.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-sm font-semibold text-primary">
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            Kontrol admin
          </span>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-3">
        {adminSections.map(({ title, description, icon: Icon, items }) => (
          <section
            key={title}
            className="rounded-xl border border-neutral-200/70 bg-white p-5 shadow-sm shadow-neutral-200/50"
          >
            <span className="grid size-11 place-items-center rounded-xl bg-secondary text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-semibold text-neutral-950">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-500">{description}</p>
            <div className="mt-5 space-y-2">
              {items.map((item) => (
                <div
                  key={item}
                  className="rounded-xl bg-neutral-50 px-3 py-2 text-sm font-medium text-neutral-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <section className="rounded-xl border border-neutral-200/70 bg-white p-5 shadow-sm shadow-neutral-200/50">
          <h3 className="text-lg font-semibold tracking-tight text-neutral-950">
            Kebijakan Operasional
          </h3>
          <p className="mt-1 text-sm text-neutral-500">
            Pengaturan dummy yang mencerminkan alur kerja admin platform wedding planner.
          </p>
          <div className="mt-5 overflow-hidden rounded-xl border border-neutral-200">
            <div className="divide-y divide-neutral-200">
              {policyRows.map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center justify-between gap-4 px-4 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-neutral-50 text-neutral-500">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="truncate text-sm font-semibold text-neutral-950">
                      {label}
                    </span>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-neutral-200/70 bg-white p-5 shadow-sm shadow-neutral-200/50">
          <h3 className="text-lg font-semibold tracking-tight text-neutral-950">
            Kesiapan Admin
          </h3>
          <div className="mt-5 space-y-3">
            {[
              { title: "Grup role", value: "4", icon: UsersRound },
              { title: "API keys", value: "2 draft", icon: KeyRound },
              { title: "Dokumen billing", value: "Siap", icon: ReceiptText },
            ].map(({ title, value, icon: Icon }) => (
              <div key={title} className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50/80 p-4">
                <span className="inline-flex items-center gap-3 text-sm font-semibold text-neutral-950">
                  <Icon className="size-4 text-neutral-500" aria-hidden="true" />
                  {title}
                </span>
                <span className="text-sm font-semibold text-primary">{value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
