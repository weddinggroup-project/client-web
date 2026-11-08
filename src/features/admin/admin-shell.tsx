"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HiBars3, HiOutlineArrowRightOnRectangle, HiOutlineCube, HiOutlineHome, HiOutlinePaintBrush, HiOutlineTicket, HiOutlineUsers, HiXMark } from "react-icons/hi2";
import type { IconType } from "react-icons";
import { FeedbackProvider } from "@/components/dash/feedback";
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
  const [drawer, setDrawer] = useState(false);

  async function logout() {
    try {
      await api.session("logout");
    } finally {
      router.replace("/sign-in");
      router.refresh();
    }
  }

  return (
    <FeedbackProvider>
      <div className="min-h-screen bg-cream font-dash text-ink">
        <aside className="fixed inset-y-0 left-0 z-20 hidden w-[260px] border-r border-gold/40 bg-white lg:block">
          <div className="flex h-16 items-center gap-2 border-b border-gold/40 px-5">
            <Link href="/admin" className="font-serif text-2xl font-semibold text-accent">
              Vowly
            </Link>
            <span className="rounded-full bg-gold/50 px-2 py-0.5 text-[11px] font-semibold text-gold-foreground">Admin</span>
          </div>
          <Nav />
        </aside>

        {drawer ? (
          <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu admin">
            <button type="button" aria-label="Tutup menu" className="absolute inset-0 bg-ink/30" onClick={() => setDrawer(false)} />
            <div className="absolute inset-y-0 left-0 w-72 bg-white shadow-2xl">
              <div className="flex h-16 items-center justify-between border-b border-gold/40 px-5">
                <span className="font-serif text-2xl font-semibold text-accent">Vowly Admin</span>
                <button type="button" aria-label="Tutup menu" onClick={() => setDrawer(false)}>
                  <HiXMark className="size-6" aria-hidden />
                </button>
              </div>
              <Nav onNavigate={() => setDrawer(false)} />
            </div>
          </div>
        ) : null}

        <div className="lg:pl-[260px]">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-3 border-b border-gold/40 bg-white/95 px-4 backdrop-blur sm:px-6">
            <div className="flex items-center gap-3">
              <button type="button" className="lg:hidden" aria-label="Buka menu" onClick={() => setDrawer(true)}>
                <HiBars3 className="size-6" aria-hidden />
              </button>
              <p className="rounded-full border border-gold/60 bg-blush/30 px-4 py-1.5 text-sm font-medium">Panel Administrasi Vowly</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-right sm:block">
                <span className="block max-w-48 truncate text-sm leading-4 font-semibold">{user.name}</span>
                <span className="block text-[11px] leading-4 text-ink-soft">{user.email}</span>
              </span>
              <span className="grid size-9 place-items-center rounded-full bg-blush text-xs font-semibold text-blush-foreground">{initials(user.name)}</span>
              <button type="button" onClick={() => void logout()} className="rounded-lg p-2 text-red-700 hover:bg-red-50" aria-label="Keluar">
                <HiOutlineArrowRightOnRectangle className="size-5" aria-hidden />
              </button>
            </div>
          </header>
          <main className="mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </FeedbackProvider>
  );
}
