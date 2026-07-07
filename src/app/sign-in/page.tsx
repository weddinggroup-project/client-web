import { redirect } from "next/navigation";
import {
  HiArrowTrendingUp,
  HiOutlineChartBarSquare,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineCube,
  HiOutlineShoppingBag,
} from "react-icons/hi2";
import type { IconType } from "react-icons";
import { EmailPasswordForm } from "@/features/auth/components/email-password-form";
import { getSession } from "@/lib/auth/session";

const metrics = [
  { label: "Orders", value: "248", icon: HiOutlineShoppingBag },
  { label: "Ready", value: "96%", icon: HiOutlineCheckCircle },
  { label: "Stock", value: "1.2k", icon: HiOutlineCube },
];

const activities = [
  { title: "Packed", detail: "124 orders", icon: HiOutlineShoppingBag },
  { title: "Reviewed", detail: "18 min avg", icon: HiOutlineClock },
  { title: "Revenue", detail: "+18.4%", icon: HiArrowTrendingUp },
];

export default async function SignInPage() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#dceff3] text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[1.12fr_.88fr]">
        <section className="relative hidden overflow-hidden bg-[#edf4f7] px-12 py-10 lg:flex lg:flex-col xl:px-16">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,.62)_0_24%,transparent_24%),radial-gradient(circle_at_16%_82%,rgba(14,165,233,.14),transparent_28%),radial-gradient(circle_at_84%_18%,rgba(37,99,235,.12),transparent_30%)]" />
          <div className="pointer-events-none absolute left-14 top-28 size-7 rotate-12 rounded-lg border border-rose-200" />
          <div className="pointer-events-none absolute right-16 top-36 size-16 rotate-45 rounded-2xl border border-sky-200" />

          <div className="relative z-10 max-w-2xl pt-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Admin starter
            </p>
            <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.06] tracking-[-0.04em] text-[#061936] xl:text-5xl">
              Kelola toko online dari satu panel yang fokus.
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-500">
              Login dummy untuk melihat dashboard, order, product CRUD, profile, dan settings tanpa setup backend.
            </p>
          </div>

          <div className="relative z-10 mt-10 flex flex-1 items-center">
            <div className="relative mx-auto h-[430px] w-full max-w-[680px]">
              <div className="absolute left-1/2 top-10 size-72 -translate-x-1/2 rounded-[52px] bg-[#ffd8d1] shadow-2xl shadow-slate-300/60 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)]" />
              <div className="absolute left-1/2 top-24 grid size-44 -translate-x-1/2 place-items-center rounded-full bg-white/70 shadow-xl shadow-slate-300/45 backdrop-blur">
                <HiOutlineChartBarSquare className="size-20 text-blue-600" aria-hidden="true" />
              </div>

              <div className="absolute bottom-8 left-0 grid w-52 gap-3">
                {metrics.map(({ label, value, icon: Icon }) => (
                  <VisualMetric key={label} label={label} value={value} icon={Icon} />
                ))}
              </div>

              <div className="absolute bottom-8 right-0 w-72 rounded-3xl border border-white bg-white/85 p-4 shadow-xl shadow-slate-300/45 backdrop-blur">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-950">Today flow</p>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    Live
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {activities.map(({ title, detail, icon: Icon }) => (
                    <div key={title} className="flex items-center gap-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-50 text-slate-500">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-slate-950">{title}</span>
                        <span className="text-xs text-slate-500">{detail}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center bg-[#fbfdff] px-6 py-10 sm:px-10 lg:px-14">
          <div className="w-full max-w-md rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-2xl shadow-slate-200/70 sm:p-8">
            <div className="mb-8">
              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                Admin access
              </span>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-neutral-950">
                Login
              </h2>
              <p className="mt-3 text-sm leading-6 text-neutral-500">
                Masuk dengan akun dummy admin untuk mengelola dashboard starter.
              </p>
            </div>

            <EmailPasswordForm enabled />

            <p className="mt-4 rounded-2xl border border-sky-100 bg-sky-50 px-3 py-2 text-sm leading-6 text-blue-800">
              Dummy admin: <span className="font-semibold">admin@gmail.com</span> /{" "}
              <span className="font-semibold">Admin123</span>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function VisualMetric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: IconType;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white bg-white/85 p-3 shadow-lg shadow-slate-300/40 backdrop-blur">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span>
        <span className="block text-lg font-semibold leading-none text-slate-950">
          {value}
        </span>
        <span className="text-xs font-medium text-slate-500">{label}</span>
      </span>
    </div>
  );
}
