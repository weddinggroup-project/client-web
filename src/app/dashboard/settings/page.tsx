import {
  Bell,
  CreditCard,
  Globe2,
  KeyRound,
  LockKeyhole,
  ReceiptText,
  ShieldCheck,
  SlidersHorizontal,
  Store,
  Truck,
  UsersRound,
} from "lucide-react";
import { requireSession } from "@/lib/auth/session";

const adminSections = [
  {
    title: "Store Operation",
    description: "Configure storefront identity, checkout defaults, and fulfillment rules.",
    icon: Store,
    items: ["Store name: Ganipedia Commerce", "Currency: USD", "Timezone: Asia/Jakarta"],
  },
  {
    title: "Admin Access",
    description: "Control owner, admin, finance, and warehouse access policies.",
    icon: ShieldCheck,
    items: ["Owner approval required", "Role templates enabled", "Audit trail retained"],
  },
  {
    title: "Security",
    description: "Prepare production-grade password, MFA, and session settings.",
    icon: LockKeyhole,
    items: ["MFA recommended", "7 day session window", "Device review enabled"],
  },
];

const policyRows = [
  { label: "Low stock notifications", value: "Enabled", icon: Bell },
  { label: "Manual payout review", value: "Required", icon: CreditCard },
  { label: "International shipping zones", value: "3 zones", icon: Globe2 },
  { label: "Fulfillment SLA", value: "24 hours", icon: Truck },
];

export default async function SettingsPage() {
  await requireSession();

  return (
    <div className="mx-auto max-w-[1320px] space-y-5">
      <section className="rounded-xl border border-neutral-200/70 bg-white p-5 shadow-sm shadow-neutral-200/50">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
              Store Settings
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Admin configuration for ecommerce operations, access, and policies.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            Admin controls
          </span>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-3">
        {adminSections.map(({ title, description, icon: Icon, items }) => (
          <section
            key={title}
            className="rounded-xl border border-neutral-200/70 bg-white p-5 shadow-sm shadow-neutral-200/50"
          >
            <span className="grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
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
            Operational Policies
          </h3>
          <p className="mt-1 text-sm text-neutral-500">
            Dummy settings that mirror admin workflows in ecommerce back offices.
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
            Admin Readiness
          </h3>
          <div className="mt-5 space-y-3">
            {[
              { title: "Role groups", value: "4", icon: UsersRound },
              { title: "API keys", value: "2 draft", icon: KeyRound },
              { title: "Billing docs", value: "Ready", icon: ReceiptText },
            ].map(({ title, value, icon: Icon }) => (
              <div key={title} className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50/80 p-4">
                <span className="inline-flex items-center gap-3 text-sm font-semibold text-neutral-950">
                  <Icon className="size-4 text-neutral-500" aria-hidden="true" />
                  {title}
                </span>
                <span className="text-sm font-semibold text-blue-700">{value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
