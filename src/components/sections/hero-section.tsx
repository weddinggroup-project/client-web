import {
  HiArrowRight,
  HiCheckCircle,
  HiCube,
  HiShoppingBag,
  HiUsers,
} from "react-icons/hi2";
import type { IconType } from "react-icons";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

function DashboardPreview() {
  const statCards: { label: string; value: string; icon: IconType }[] = [
    { label: "Revenue", value: "$84.2k", icon: HiShoppingBag },
    { label: "Orders", value: "1,284", icon: HiCube },
    { label: "Customers", value: "24.8k", icon: HiUsers },
  ];

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-2xl shadow-blue-100/70">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div>
          <p className="text-sm font-semibold text-neutral-950">Ganipedia Admin</p>
          <p className="mt-1 text-xs text-neutral-500">E-commerce starter workspace</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          Live preview
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-neutral-200 bg-neutral-50/80 p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-neutral-500">{label}</p>
              <Icon className="size-4 text-blue-600" aria-hidden="true" />
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
        <div className="rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-neutral-950">Sales performance</p>
            <span className="text-xs font-semibold text-emerald-700">+24.8%</span>
          </div>
          <div className="mt-5 flex h-36 items-end gap-2">
            {[42, 58, 50, 76, 66, 92, 84, 112].map((height, index) => (
              <span
                key={index}
                className="flex-1 rounded-t-lg bg-blue-600/80"
                style={{ height }}
              />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 p-4">
          <p className="text-sm font-semibold text-neutral-950">Recent orders</p>
          <div className="mt-4 space-y-2">
            {[
              ["ORD-1048", "Paid", "$248"],
              ["ORD-1047", "Packed", "$129"],
              ["ORD-1046", "Pending", "$84"],
            ].map(([order, status, amount]) => (
              <div key={order} className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2">
                <span>
                  <span className="block text-xs font-semibold text-neutral-950">{order}</span>
                  <span className="text-[11px] text-neutral-500">{status}</span>
                </span>
                <span className="text-sm font-semibold text-neutral-950">{amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  const checks = [
    "Dashboard admin tersedia",
    "Order dan CRUD product",
    "Auth email/password",
  ];

  return (
    <section className="relative isolate overflow-hidden bg-[#f7f9fc] pb-24 pt-36 text-neutral-950 sm:pt-44">
      <div className="absolute inset-x-0 top-0 h-80 bg-[linear-gradient(180deg,#eef5ff,rgba(247,249,252,0))]" />
      <Container className="relative grid items-center gap-14 lg:grid-cols-[1.02fr_.98fr]">
        <div className="max-w-3xl">
          <Badge className="border-blue-200 bg-blue-50 text-blue-700">
            <span className="size-1.5 rounded-full bg-blue-600" />
            Ganipedia E-commerce Starter
          </Badge>
          <h1 className="mt-7 text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-7xl">
            Admin commerce yang clean,
            <span className="block text-blue-700">
              siap dibentuk jadi toko online.
            </span>
          </h1>
          <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-neutral-600 sm:text-xl">
            Starter Next.js modern dengan auth email/password, route lokal, dummy order, CRUD product, analytics dashboard, dan layout admin yang rapi.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#architecture">
              Lihat struktur dashboard
              <HiArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="#components" variant="secondary">
              Lihat komponen UI
            </ButtonLink>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-neutral-600">
            {checks.map((check) => (
              <li key={check} className="flex items-center gap-2">
                <HiCheckCircle className="size-4 text-emerald-500" aria-hidden="true" />
                {check}
              </li>
            ))}
          </ul>
        </div>
        <div className="mx-auto w-full max-w-2xl lg:mx-0">
          <DashboardPreview />
        </div>
      </Container>
    </section>
  );
}
