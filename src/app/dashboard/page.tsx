import {
  ArrowUpRight,
  BellRing,
  CalendarClock,
  HeartHandshake,
  LayoutTemplate,
  ShoppingBag,
  WalletMinimal,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { requireSession } from "@/lib/auth/session";
import { formatRupiah, invitationTemplates, packages } from "@/features/undangan-digital/wizard/wizard-data";

const ordersTrend = [36, 52, 44, 68, 58, 84, 76, 96, 88, 112, 104, 132];

const packageShare = [
  { label: packages[0]!.name, share: 32, color: "bg-secondary-hover" },
  { label: packages[1]!.name, share: 46, color: "bg-primary" },
  { label: packages[2]!.name, share: 22, color: "bg-accent" },
];

const topTemplates = invitationTemplates.map((template, index) => ({
  name: template.name,
  used: [186, 142, 97][index],
  color: ["bg-primary", "bg-accent", "bg-secondary-hover"][index]!,
}));

const recentOrders = [
  { id: "VOW-1048", couple: "Andi & Siska", package: "Journey", status: "Lunas" },
  { id: "VOW-1047", couple: "Raka & Dinda", package: "Promise", status: "Menunggu" },
  { id: "VOW-1046", couple: "Bima & Alya", package: "Forever", status: "Lunas" },
  { id: "VOW-1045", couple: "Yudi & Citra", package: "Journey", status: "Lunas" },
];

const reminders: {
  name: string;
  detail: string;
  icon: LucideIcon;
}[] = [
  { name: "Undangan VOW-1050", detail: "Menunggu konfirmasi tamu", icon: BellRing },
  { name: "Pembayaran VOW-1047", detail: "Jatuh tempo besok", icon: WalletMinimal },
  { name: "Akad Andi & Siska", detail: "H-7 dari sekarang", icon: CalendarClock },
];

export default async function DashboardPage() {
  const session = await requireSession();

  return (
    <div className="mx-auto max-w-[1320px] space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Pendapatan" value={formatRupiah(84_200_000)} detail="+18.4% dari bulan lalu" icon={WalletMinimal} />
        <StatCard title="Pesanan Undangan" value="1.284" detail="342 menunggu pembayaran" icon={ShoppingBag} />
        <StatCard title="Pasangan Terdaftar" value="24,8k" detail="+1.204 pasangan baru" icon={HeartHandshake} />
        <StatCard title="Template Digunakan" value="486" detail="18 template baru minggu ini" icon={LayoutTemplate} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_.65fr]">
        <MetricCard title="Performa Pesanan">
          <div className="mt-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-3xl font-semibold tracking-tight">{formatRupiah(128_460_000)}</p>
              <p className="mt-1 text-sm text-neutral-500">Total pesanan kuartal ini</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
              <ArrowUpRight className="size-4" aria-hidden="true" />
              24.8%
            </span>
          </div>
          <div className="mt-6 flex h-44 items-end gap-3 border-b border-dashed border-neutral-200 pb-3">
            {ordersTrend.map((value, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <span
                  className="w-full rounded-t-xl bg-primary/85"
                  style={{ height: `${value}px` }}
                />
                <span className="text-[11px] text-neutral-400">
                  {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][index]}
                </span>
              </div>
            ))}
          </div>
        </MetricCard>

        <MetricCard title="Distribusi Paket">
          <div className="mt-5 grid place-items-center">
            <div className="relative grid size-40 place-items-center rounded-full bg-[conic-gradient(#6b3f45_0_46%,#a97078_46%_78%,#edd0d6_78%_100%)]">
              <div className="grid size-24 place-items-center rounded-full bg-white text-center">
                <span>
                  <span className="block text-2xl font-semibold">46%</span>
                  <span className="text-xs text-neutral-500">Journey</span>
                </span>
              </div>
            </div>
          </div>
          <div className="mt-5 space-y-3 text-sm">
            {packageShare.map(({ label, share, color }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-neutral-600">
                  <span className={`size-2.5 rounded-full ${color}`} />
                  {label}
                </span>
                <span className="font-semibold text-neutral-950">{share}%</span>
              </div>
            ))}
          </div>
        </MetricCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[.85fr_1fr_.85fr]">
        <MetricCard title="Template Terpopuler">
          <div className="mt-4 space-y-3">
            {topTemplates.map((template, index) => (
              <div key={template.name} className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50/80 p-3">
                <span className={`grid size-10 place-items-center rounded-xl text-sm font-semibold text-white ${template.color}`}>
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-neutral-950">{template.name}</p>
                  <p className="text-xs text-neutral-500">{template.used} kali dipakai</p>
                </div>
              </div>
            ))}
          </div>
        </MetricCard>

        <MetricCard title="Pesanan Terbaru">
          <div className="mt-4 divide-y divide-neutral-200 overflow-hidden rounded-xl border border-neutral-200">
            {recentOrders.map((order) => (
              <div key={order.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-3 text-sm">
                <div>
                  <p className="font-semibold text-neutral-950">{order.couple}</p>
                  <p className="text-xs text-neutral-500">{order.id} · {order.package}</p>
                </div>
                <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-primary">
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </MetricCard>

        <MetricCard title="Pengingat">
          <div className="mt-4 space-y-3">
            {reminders.map(({ name, detail, icon: Icon }) => (
              <div key={name} className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50/70 p-3">
                <span className="grid size-10 place-items-center rounded-xl bg-white text-amber-600">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-neutral-950">{name}</span>
                  <span className="text-xs text-neutral-500">{detail}</span>
                </span>
              </div>
            ))}
          </div>
        </MetricCard>
      </div>

      <p className="text-xs text-neutral-500">
        Masuk sebagai {session.user.email}. Data dummy untuk starter template Vowly.
      </p>
    </div>
  );
}

function MetricCard({
  title,
  className = "",
  children,
}: {
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={`relative rounded-xl border border-neutral-200/70 bg-white p-4 shadow-sm shadow-neutral-200/50 ${className}`}
    >
      <h2 className="text-lg font-semibold tracking-tight text-neutral-950">{title}</h2>
      {children}
    </section>
  );
}
