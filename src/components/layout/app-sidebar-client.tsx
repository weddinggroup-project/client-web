"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Grid2X2,
  LayoutTemplate,
  LogOut,
  Mail,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  UserRound,
  type LucideIcon,
} from "lucide-react";

// Only real, working destinations — no dead links to keep the menu clean.
const mainItems = [
  { href: "/dashboard", label: "Overview", icon: Grid2X2, active: true },
  { href: "/dashboard/orders", label: "Orders", icon: Mail },
  { href: "/dashboard/products", label: "Products", icon: LayoutTemplate },
] as const;

const generalItems = [
  { href: "/dashboard/profile", label: "Profile", icon: UserRound },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

const otherItems = [
  { href: "/", label: "Log out", icon: LogOut },
] as const;

export function AppSidebarClient() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`hidden min-h-screen shrink-0 border-r border-slate-200/80 bg-white py-5 transition-[width,padding] duration-300 lg:flex lg:flex-col ${
        collapsed ? "w-[86px] px-3" : "w-64 px-5"
      }`}
    >
      <div className="relative flex items-center justify-between gap-2">
        <Link
          href="/dashboard"
          className={`flex min-w-0 items-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus ${
            collapsed ? "justify-center" : "gap-3"
          }`}
          aria-label="Vowly dashboard"
        >
          {collapsed ? (
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary font-serif text-lg font-semibold text-primary">
              V
            </span>
          ) : (
            <span className="truncate font-serif text-xl font-semibold text-accent">
              Vowly
            </span>
          )}
        </Link>
        <button
          type="button"
          className={`grid size-8 shrink-0 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-500 shadow-sm shadow-neutral-200/70 transition hover:border-primary/30 hover:bg-secondary hover:text-primary ${
            collapsed ? "absolute -right-7 top-1 z-40" : ""
          }`}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed((value) => !value)}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-4" aria-hidden="true" />
          ) : (
            <PanelLeftClose className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>

      <nav className="mt-8 space-y-7" aria-label="Dashboard">
        <SidebarGroup
          title="Main Menu"
          items={mainItems}
          collapsed={collapsed}
          pathname={pathname}
        />
        <SidebarGroup
          title="General"
          items={generalItems}
          collapsed={collapsed}
          pathname={pathname}
        />
      </nav>

      <nav className="mt-auto space-y-3 pt-8" aria-label="Account">
        {!collapsed ? (
          <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            Others
          </p>
        ) : null}
        <div className="space-y-2">
          {otherItems.map(({ href, label, icon: Icon }) => (
            <SidebarItem
              key={label}
              href={href}
              label={label}
              icon={Icon}
              collapsed={collapsed}
            />
          ))}
        </div>
      </nav>
    </aside>
  );
}

function SidebarGroup({
  title,
  items,
  collapsed,
  pathname,
}: {
  title: string;
  items: readonly {
    href: string;
    label: string;
    icon: LucideIcon;
    active?: boolean;
    badge?: string;
  }[];
  collapsed: boolean;
  pathname: string;
}) {
  return (
    <div>
      {!collapsed ? (
        <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
          {title}
        </p>
      ) : null}
      <div className="mt-3 space-y-1.5">
        {items.map(({ href, label, icon: Icon, active, badge }) => (
          <SidebarItem
            key={label}
            href={href}
            label={label}
            icon={Icon}
            collapsed={collapsed}
            active={isActivePath(pathname, href, active)}
            badge={badge}
          />
        ))}
      </div>
    </div>
  );
}

function SidebarItem({
  href,
  label,
  icon: Icon,
  collapsed,
  active,
  badge,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  collapsed: boolean;
  active?: boolean;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={`relative flex items-center rounded-xl text-sm font-medium transition ${
        collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5"
      } ${
        active
          ? "bg-secondary/90 text-primary"
          : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950"
      }`}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      {!collapsed ? (
        <span className="min-w-0 flex-1 truncate">{label}</span>
      ) : null}
      {badge ? (
        <span
          className={`grid place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground shadow-lg shadow-primary/20 ${
            collapsed ? "absolute right-1 top-1 size-4 text-[9px]" : "size-6"
          }`}
        >
          {badge}
        </span>
      ) : null}
    </Link>
  );
}

function isActivePath(pathname: string, href: string, fallback?: boolean) {
  if (href === "/dashboard") {
    return pathname === "/dashboard" ? Boolean(fallback) : false;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
