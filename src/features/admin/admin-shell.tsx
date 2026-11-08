"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HiOutlineArrowRightOnRectangle, HiOutlineCube, HiOutlineHome, HiOutlinePaintBrush, HiOutlineTicket, HiOutlineUsers } from "react-icons/hi2";
import type { IconType } from "react-icons";
import { AppShell, Breadcrumbs } from "@/components/dash/app-shell";
import { api } from "@/lib/vowly/client";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/vowly/format";
import type { User } from "@/lib/vowly/types";

type AdminItem = { href: string; label: string; sub: string; icon: IconType };

const items: AdminItem[] = [
  { href: "/admin", label: "Ringkasan", sub: "Statistik platform", icon: HiOutlineHome },
  { href: "/admin/pengguna", label: "Pengguna", sub: "Akun & peran", icon: HiOutlineUsers },
  { href: "/admin/paket", label: "Paket", sub: "Harga & fitur", icon: HiOutlineCube },
  { href: "/admin/template", label: "Template", sub: "Desain undangan", icon: HiOutlinePaintBrush },
  { href: "/admin/voucher", label: "Voucher", sub: "Voucher & referral", icon: HiOutlineTicket },
];

export function isAdminActive(pathname: string, href: string): boolean {
  return href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);
}

function Nav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Menu admin" className="space-y-1 px-3 py-5">
      <p className="px-3 pb-1 text-[11px] font-semibold tracking-[0.12em] text-ink-soft uppercase">Administrasi</p>
      {items.map((item) => {
        const active = isAdminActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn("flex items-center gap-3 rounded-lg border-l-4 px-3 py-2.5 transition", active ? "border-gold-foreground bg-blush text-ink" : "border-transparent hover:bg-gold/25")}
          >
            <Icon className="size-5 shrink-0" aria-hidden />
            <span>
              <span className="block text-sm leading-5 font-medium">{item.label}</span>
              <span className="block text-[11px] leading-4 text-ink-soft">{item.sub}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({ user, children }: { user: User; children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const active = items.find((item) => isAdminActive(pathname, item.href));

  async function logout() {
    try {
      await api.session("logout");
    } finally {
      router.replace("/sign-in");
      router.refresh();
    }
  }

  return (
    <AppShell
      homeHref="/admin"
      badge="Admin"
      pill="Panel Administrasi Vowly • Kelola pengguna & katalog"
      breadcrumbs={<Breadcrumbs items={[{ label: "Beranda", href: "/admin" }, { label: "Administrasi", href: "/admin" }, ...(active && active.href !== "/admin" ? [{ label: active.label }] : [{ label: "Ringkasan" }])]} />}
      renderNav={(onNavigate) => <Nav onNavigate={onNavigate} />}
      user={
        <>
          <span className="grid size-10 place-items-center rounded-full bg-blush text-xs font-semibold text-blush-foreground ring-2 ring-gold/50">{initials(user.name)}</span>
          <span className="hidden text-left sm:block">
            <span className="block max-w-44 truncate text-sm leading-4 font-semibold">{user.name}</span>
            <span className="block text-[11px] leading-4 text-ink-soft">Administrator</span>
          </span>
          <button type="button" onClick={() => void logout()} className="rounded-lg p-2 text-red-700 hover:bg-red-50" aria-label="Keluar">
            <HiOutlineArrowRightOnRectangle className="size-5" aria-hidden />
          </button>
        </>
      }
    >
      {children}
    </AppShell>
  );
}
