import {
  BadgeCheck,
  Clock3,
  KeyRound,
  Mail,
  MapPin,
  MonitorCog,
  ShieldCheck,
} from "lucide-react";
import { requireSession } from "@/lib/auth/session";
import { ProfileActions } from "@/features/profile/components/profile-actions";

const accessMatrix = [
  { area: "Products", permission: "Create, edit, archive", level: "Owner" },
  { area: "Orders", permission: "Refund, fulfill, export", level: "Admin" },
  { area: "Customers", permission: "View profile and tags", level: "Admin" },
  { area: "Settings", permission: "Billing, roles, security", level: "Owner" },
];

export default async function ProfilePage() {
  const session = await requireSession();
  const initials = session.user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="mx-auto max-w-[1180px] space-y-5">
      <section className="rounded-xl border border-neutral-200/70 bg-white p-6 shadow-sm shadow-neutral-200/50">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid size-16 shrink-0 place-items-center rounded-xl bg-blue-700 text-lg font-semibold text-white shadow-lg shadow-blue-700/20">
              {initials}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
                  {session.user.name}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  <BadgeCheck className="size-3.5" aria-hidden="true" />
                  Verified admin
                </span>
              </div>
              <p className="mt-1 text-sm text-neutral-500">
                Primary administrator for Ganipedia online store operations.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-neutral-600">
                <InfoPill icon={Mail} label={session.user.email} />
                <InfoPill icon={MapPin} label="Jakarta, Indonesia" />
                <InfoPill icon={Clock3} label="UTC+7 Admin" />
              </div>
            </div>
          </div>
          <ProfileActions name={session.user.name} email={session.user.email} />
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <section className="rounded-xl border border-neutral-200/70 bg-white p-6 shadow-sm shadow-neutral-200/50">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-neutral-950">
                Role & Permissions
              </h3>
              <p className="mt-1 text-sm text-neutral-500">
                Starter permission map for the admin account.
              </p>
            </div>
            <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
          </div>

          <div className="mt-5 overflow-hidden rounded-xl border border-neutral-200">
            <div className="hidden grid-cols-[.8fr_1.2fr_.6fr] gap-4 bg-neutral-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-400 md:grid">
              <span>Module</span>
              <span>Permission</span>
              <span>Level</span>
            </div>
            <div className="divide-y divide-neutral-200">
              {accessMatrix.map((item) => (
                <div
                  key={item.area}
                  className="grid gap-2 px-4 py-4 text-sm md:grid-cols-[.8fr_1.2fr_.6fr] md:items-center md:gap-4"
                >
                  <span className="font-semibold text-neutral-950">{item.area}</span>
                  <span className="text-neutral-600">{item.permission}</span>
                  <span className="w-fit rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    {item.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-neutral-200/70 bg-white p-6 shadow-sm shadow-neutral-200/50">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-neutral-950">
              Account Security
            </h3>
            <p className="mt-1 text-sm text-neutral-500">
              Dummy settings prepared for production flows.
            </p>
          </div>
          <div className="mt-5 space-y-3">
            {[
              { title: "Password", detail: "Last changed 14 days ago", icon: KeyRound },
              { title: "Session", detail: "Bypass enabled for template preview", icon: MonitorCog },
              { title: "Two-step login", detail: "Ready to connect to provider", icon: ShieldCheck },
            ].map(({ title, detail, icon: Icon }) => (
              <div key={title} className="flex gap-3 rounded-xl border border-neutral-100 bg-neutral-50/70 p-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white text-blue-700">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-neutral-950">{title}</p>
                  <p className="mt-0.5 text-xs leading-5 text-neutral-500">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function InfoPill({
  icon: Icon,
  label,
}: {
  icon: typeof Mail;
  label: string;
}) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2 rounded-xl border border-neutral-200/70 bg-neutral-50 px-3 py-2">
      <Icon className="size-4 shrink-0 text-neutral-400" aria-hidden="true" />
      <span className="truncate">{label}</span>
    </span>
  );
}
