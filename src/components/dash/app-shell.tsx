"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { HiBars3, HiChevronRight, HiOutlineSparkles, HiXMark } from "react-icons/hi2";
import { FeedbackProvider } from "./feedback";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-3 flex flex-wrap items-center gap-1 text-xs text-ink-soft">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-1">
          {index > 0 ? <HiChevronRight className="size-3" aria-hidden /> : null}
          {item.href && index < items.length - 1 ? (
            <Link href={item.href} className="hover:text-ink">
              {item.label}
            </Link>
          ) : (
            <span aria-current={index === items.length - 1 ? "page" : undefined} className={index === items.length - 1 ? "font-medium text-primary" : undefined}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

/**
 * Chrome shared by the planner dashboard and the admin area, matching the Figma shell: a sidebar with the brand and a
 * badge, and a header with the menu toggle, brand, a centred pill, and the user chip. The sidebar collapses on desktop
 * and becomes a drawer on small screens.
 */
export function AppShell({
  homeHref,
  badge,
  pill,
  user,
  breadcrumbs,
  renderNav,
  children,
}: {
  homeHref: string;
  badge?: string;
  pill: ReactNode;
  user: ReactNode;
  breadcrumbs: ReactNode;
  renderNav: (onNavigate?: () => void) => ReactNode;
  children: ReactNode;
}) {
  const [drawer, setDrawer] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  function toggle() {
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches) setCollapsed((value) => !value);
    else setDrawer((value) => !value);
  }

  const brand = (
    <Link href={homeHref} className="font-serif text-2xl font-semibold text-accent">
      Vowly
    </Link>
  );

  return (
    <FeedbackProvider>
      <div className="min-h-screen bg-cream font-dash text-ink">
        {!collapsed ? (
          <aside className="fixed inset-y-0 left-0 z-20 hidden w-[260px] border-r border-gold/40 bg-white lg:block">
            <div className="flex h-16 items-center justify-between border-b border-gold/40 px-5">
              {brand}
              {badge ? <span className="rounded-full bg-gold/60 px-3 py-1 text-xs font-semibold text-gold-foreground">{badge}</span> : null}
            </div>
            <div className="h-[calc(100%-4rem)] overflow-y-auto">{renderNav()}</div>
          </aside>
        ) : null}

        {drawer ? (
          <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
            <button type="button" aria-label="Tutup menu" className="absolute inset-0 bg-ink/30" onClick={() => setDrawer(false)} />
            <div className="absolute inset-y-0 left-0 w-72 bg-white shadow-2xl">
              <div className="flex h-16 items-center justify-between border-b border-gold/40 px-5">
                {brand}
                <button type="button" aria-label="Tutup menu" onClick={() => setDrawer(false)}>
                  <HiXMark className="size-6" aria-hidden />
                </button>
              </div>
              <div className="h-[calc(100%-4rem)] overflow-y-auto">{renderNav(() => setDrawer(false))}</div>
            </div>
          </div>
        ) : null}

        <div className={collapsed ? "" : "lg:pl-[260px]"}>
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-3 border-b border-gold/40 bg-white/95 px-4 backdrop-blur sm:px-6">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <button type="button" aria-label="Buka atau tutup menu" aria-expanded={!collapsed} onClick={toggle} className="rounded-lg p-1.5 hover:bg-gold/25">
                <HiBars3 className="size-6" aria-hidden />
              </button>
              <span className="hidden sm:block">{collapsed ? brand : <span className="font-serif text-2xl font-semibold text-accent/80">Vowly</span>}</span>
              <p className="mx-auto flex min-w-0 items-center gap-2 truncate rounded-full border border-gold/70 bg-blush/20 px-5 py-1.5 text-sm font-medium">
                <HiOutlineSparkles className="size-4 shrink-0 text-gold-foreground" aria-hidden />
                <span className="truncate">{pill}</span>
              </p>
            </div>
            <div className="flex items-center gap-3 border-l border-gold/40 pl-4">{user}</div>
          </header>
          <div className="relative">
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top_right,rgba(244,194,194,0.35),transparent_60%),radial-gradient(ellipse_at_top_left,rgba(232,224,186,0.35),transparent_55%)]" />
            <main className="relative mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6 lg:px-8">
              {breadcrumbs}
              {children}
            </main>
          </div>
        </div>
      </div>
    </FeedbackProvider>
  );
}
