"use client";

import { Languages } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const nextLocale = locale === "id" ? "en" : "id";

  return (
    <button
      type="button"
      className="inline-flex h-10 items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 text-sm text-slate-200 transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-blue-400"
      onClick={() => router.replace(pathname, { locale: nextLocale })}
      aria-label={locale === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
    >
      <Languages className="size-4" aria-hidden="true" />
      {nextLocale.toUpperCase()}
    </button>
  );
}
