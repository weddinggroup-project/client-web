"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HiBars3, HiChevronDown, HiOutlineArrowRightOnRectangle, HiOutlineSparkles, HiXMark } from "react-icons/hi2";
import { FeedbackProvider } from "@/components/dash/feedback";
import { api } from "@/lib/vowly/client";
import { initials } from "@/lib/vowly/format";
import { cn } from "@/lib/utils";
import { countdownLabel, isActive, navSections, projectHref } from "./nav";
import { useProject } from "./project-context";

function Sidebar({ projectId, onNavigate }: { projectId: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Menu dashboard" className="flex h-full flex-col gap-6 overflow-y-auto px-3 py-5">
      {navSections.map((section) => (
        <div key={section.title}>
          <p className="px-3 text-[11px] font-semibold tracking-[0.12em] text-ink-soft uppercase">{section.title}</p>
          <ul className="mt-2 space-y-1">
            {section.items.map((item) => {
              const active = isActive(pathname, projectId, item.slug);
              const Icon = item.icon;
              return (
                <li key={item.slug || "home"}>
                  <Link
                    href={projectHref(projectId, item.slug)}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border-l-4 px-3 py-2.5 transition focus-visible:outline-2 focus-visible:outline-primary",
                      active ? "border-gold-foreground bg-blush text-ink" : "border-transparent text-ink hover:bg-gold/25",
                    )}
                  >
                    <Icon className="size-5 shrink-0" aria-hidden />
                    <span className="min-w-0">
                      <span className="block text-sm leading-5 font-medium">{item.label}</span>
                      <span className="block truncate text-[11px] leading-4 text-ink-soft">{item.sub}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function UserMenu() {
  const router = useRouter();
  const { user, project } = useProject();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    try {
      await api.session("logout");
    } finally {
      router.replace("/sign-in");
      router.refresh();
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-gold/25 focus-visible:outline-2 focus-visible:outline-primary"
      >
        <span className="grid size-9 place-items-center rounded-full bg-blush text-xs font-semibold text-blush-foreground">{initials(user.name)}</span>
        <span className="hidden text-left sm:block">
          <span className="block max-w-40 truncate text-sm leading-4 font-semibold text-ink">{user.name}</span>
          <span className="block text-[11px] leading-4 text-ink-soft">{project.is_owner ? "Pemilik proyek" : "Kolaborator"}</span>
        </span>
        <HiChevronDown className="size-4 text-ink-soft" aria-hidden />
      </button>
      {open ? (
        <div role="menu" className="absolute right-0 z-30 mt-2 w-56 rounded-xl border border-gold/50 bg-white p-1.5 shadow-xl shadow-ink/10">
          <p className="truncate px-3 py-2 text-xs text-ink-soft">{user.email}</p>
          <Link role="menuitem" href="/dashboard" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-ink hover:bg-gold/25">
            Semua proyek
          </Link>
          <button
            type="button"
            role="menuitem"
            disabled={pending}
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
          >
            <HiOutlineArrowRightOnRectangle className="size-4" aria-hidden />
            {pending ? "Keluar…" : "Keluar"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const { project, daysUntil } = useProject();
  const [drawer, setDrawer] = useState(false);

  return (
    <FeedbackProvider>
      <div className="min-h-screen bg-cream font-dash text-ink">
        {/* Desktop sidebar */}
        <aside className="fixed inset-y-0 left-0 z-20 hidden w-[260px] border-r border-gold/40 bg-white lg:block">
          <div className="flex h-16 items-center justify-between border-b border-gold/40 px-5">
            <Link href="/" className="font-serif text-2xl font-semibold text-accent">
              Vowly
            </Link>
          </div>
          <div className="h-[calc(100%-4rem)]">
            <Sidebar projectId={project.id} />
          </div>
        </aside>

        {/* Mobile drawer */}
        {drawer ? (
          <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
            <button type="button" aria-label="Tutup menu" className="absolute inset-0 bg-ink/30" onClick={() => setDrawer(false)} />
            <div className="absolute inset-y-0 left-0 w-72 bg-white shadow-2xl">
              <div className="flex h-16 items-center justify-between border-b border-gold/40 px-5">
                <span className="font-serif text-2xl font-semibold text-accent">Vowly</span>
                <button type="button" aria-label="Tutup menu" onClick={() => setDrawer(false)}>
                  <HiXMark className="size-6" aria-hidden />
                </button>
              </div>
              <div className="h-[calc(100%-4rem)]">
                <Sidebar projectId={project.id} onNavigate={() => setDrawer(false)} />
              </div>
            </div>
          </div>
        ) : null}

        <div className="lg:pl-[260px]">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-3 border-b border-gold/40 bg-white/95 px-4 backdrop-blur sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button type="button" className="lg:hidden" aria-label="Buka menu" onClick={() => setDrawer(true)}>
                <HiBars3 className="size-6" aria-hidden />
              </button>
              <p className="flex min-w-0 items-center gap-2 truncate rounded-full border border-gold/60 bg-blush/30 px-4 py-1.5 text-sm font-medium text-ink">
                <HiOutlineSparkles className="size-4 shrink-0 text-gold-foreground" aria-hidden />
                <span className="truncate">{countdownLabel(project.title, daysUntil)}</span>
              </p>
            </div>
            <UserMenu />
          </header>
          <main className="mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </FeedbackProvider>
  );
}
