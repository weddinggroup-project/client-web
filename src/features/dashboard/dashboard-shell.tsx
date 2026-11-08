"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiChevronDown, HiOutlineArrowRightOnRectangle } from "react-icons/hi2";
import { AppShell, Breadcrumbs } from "@/components/dash/app-shell";
import { LogoutButton } from "@/components/dash/logout-button";
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
  const { user, project } = useProject();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-lg px-1.5 py-1 transition hover:bg-gold/25 focus-visible:outline-2 focus-visible:outline-primary"
      >
        <span className="grid size-10 place-items-center rounded-full bg-blush text-xs font-semibold text-blush-foreground ring-2 ring-gold/50">{initials(user.name)}</span>
        <span className="hidden text-left sm:block">
          <span className="block max-w-44 truncate text-sm leading-4 font-semibold text-ink">{project.title}</span>
          <span className="block text-[11px] leading-4 text-ink-soft">{project.is_owner ? "Akad & Resepsi" : "Kolaborator"}</span>
        </span>
        <HiChevronDown className="size-4 text-ink-soft" aria-hidden />
      </button>
      {open ? (
        <div role="menu" className="absolute right-0 z-30 mt-2 w-60 rounded-xl border border-gold/50 bg-white p-1.5 shadow-xl shadow-ink/10">
          <p className="px-3 pt-2 text-sm font-semibold">{user.name}</p>
          <p className="truncate px-3 pb-2 text-xs text-ink-soft">{user.email}</p>
          <Link role="menuitem" href="/dashboard" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-ink hover:bg-gold/25">
            Semua proyek
          </Link>
          {user.role === "admin" ? (
            <Link role="menuitem" href="/admin" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-ink hover:bg-gold/25">
              Panel admin
            </Link>
          ) : null}
          <LogoutButton className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50 disabled:opacity-50">
            <HiOutlineArrowRightOnRectangle className="size-4" aria-hidden />
            Keluar
          </LogoutButton>
        </div>
      ) : null}
    </div>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const { project, daysUntil } = useProject();
  const pathname = usePathname();
  const active = navSections.flatMap((section) => section.items).find((item) => isActive(pathname, project.id, item.slug));
  const crumbs = [
    { label: "Beranda", href: projectHref(project.id, "") },
    ...(active && active.slug ? [{ label: active.label }, { label: active.sub }] : [{ label: "Main Dashboard" }]),
  ];

  return (
    <AppShell
      homeHref="/"
      pill={countdownLabel(project.title, daysUntil)}
      user={<UserMenu />}
      breadcrumbs={<Breadcrumbs items={crumbs} />}
      renderNav={(onNavigate) => <Sidebar projectId={project.id} onNavigate={onNavigate} />}
      sidebarFooter={
        <LogoutButton className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50">
          <HiOutlineArrowRightOnRectangle className="size-5 shrink-0" aria-hidden />
          Keluar
        </LogoutButton>
      }
    >
      {children}
    </AppShell>
  );
}
