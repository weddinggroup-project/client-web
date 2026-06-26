import { Gauge, Home, Settings, ShieldCheck } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "./logo";

export async function AppSidebar() {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("Navigation"),
  ]);
  const items = [
    { href: "/dashboard", label: t("dashboard"), icon: Gauge },
    { href: "/", label: "Landing", icon: Home },
  ] as const;

  return (
    <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-slate-950 p-5 text-white lg:block">
      <Logo />
      <nav className="mt-10 space-y-1" aria-label="Dashboard">
        {items.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            locale={locale}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/8 hover:text-white"
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="mt-10 border-t border-white/10 pt-6">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="size-4 text-emerald-400" aria-hidden="true" />
          Better Auth session
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <Settings className="size-4" aria-hidden="true" />
          {locale.toUpperCase()} locale
        </div>
      </div>
    </aside>
  );
}
