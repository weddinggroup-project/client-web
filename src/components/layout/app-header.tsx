import { getLocale } from "next-intl/server";
import type { AuthSession } from "@/lib/auth/auth";
import { LocaleSwitcher } from "./locale-switcher";

export async function AppHeader({ session }: { session: AuthSession }) {
  await getLocale();
  const initials = session.user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
      <p className="text-sm font-medium text-slate-500">Ganipedia Console</p>
      <div className="flex items-center gap-3">
        <div className="[&_button]:border-slate-200 [&_button]:bg-white [&_button]:text-slate-700 [&_button]:hover:bg-slate-50">
          <LocaleSwitcher />
        </div>
        <div className="grid size-9 place-items-center rounded-full bg-blue-600 text-xs font-semibold text-white">
          {initials}
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-slate-950">{session.user.name}</p>
          <p className="text-xs text-slate-500">{session.user.email}</p>
        </div>
      </div>
    </header>
  );
}
