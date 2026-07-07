"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  Clock3,
  LogOut,
  Menu,
  PackageCheck,
  Search,
  Settings,
  UserRound,
} from "lucide-react";

type AppHeaderClientProps = {
  user: {
    name: string;
    email: string;
  };
};

const notifications = [
  {
    title: "Low stock alert",
    description: "Walnut Desk Tray has 5 units left",
    time: "2m ago",
    icon: PackageCheck,
  },
  {
    title: "Pending payout",
    description: "$8,420 scheduled for review",
    time: "18m ago",
    icon: Clock3,
  },
  {
    title: "Order #ORD-1048 paid",
    description: "Ready for fulfillment",
    time: "1h ago",
    icon: CheckCircle2,
  },
];

export function AppHeaderClient({ user }: AppHeaderClientProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const title = getPageTitle(pathname);
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setShowNotifications(false);
      }

      if (profileRef.current && !profileRef.current.contains(target)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-neutral-200/80 bg-white/90 px-4 backdrop-blur sm:px-5 lg:h-[72px] lg:px-6">
      <div className="flex min-w-0 items-center gap-3 lg:gap-5">
        <button
          type="button"
          className="grid size-9 place-items-center rounded-full border border-neutral-200 text-neutral-500 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="size-4" aria-hidden="true" />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
            {title}
          </h1>
          <p className="hidden text-sm text-neutral-500 sm:block">
            {getPageDescription(pathname)}
          </p>
        </div>
      </div>

      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <label className="hidden h-10 w-[230px] items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 text-neutral-500 shadow-sm shadow-neutral-200/70 transition focus-within:border-blue-300 focus-within:ring-3 focus-within:ring-blue-100 md:flex">
          <Search className="size-4 shrink-0" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search store data..."
            className="min-w-0 flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
          />
        </label>
        <div ref={notificationsRef} className="relative">
          <button
            type="button"
            className="relative grid size-10 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-500 shadow-sm shadow-neutral-200/80 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            aria-label="Notifications"
            onClick={() => {
              setShowNotifications((value) => !value);
              setShowProfileMenu(false);
            }}
          >
            <Bell className="size-4" aria-hidden="true" />
            <span className="absolute right-3 top-2.5 size-1.5 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>
          {showNotifications ? (
            <div className="absolute right-0 top-12 z-50 w-[320px] overflow-hidden rounded-2xl border border-neutral-200 bg-white p-2 shadow-2xl shadow-neutral-300/60">
              <div className="flex items-center justify-between px-2 py-2">
                <p className="text-sm font-semibold text-neutral-950">Notifications</p>
                <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-600">
                  3 new
                </span>
              </div>
              <div className="space-y-1">
                {notifications.map(({ title: itemTitle, description, time, icon: Icon }) => (
                  <button
                    key={itemTitle}
                    type="button"
                    className="flex w-full gap-3 rounded-xl px-2 py-2.5 text-left transition hover:bg-neutral-50"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-neutral-900">
                        {itemTitle}
                      </span>
                      <span className="block truncate text-xs text-neutral-500">
                        {description}
                      </span>
                    </span>
                    <span className="shrink-0 text-[11px] text-neutral-400">{time}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div ref={profileRef} className="relative hidden sm:block">
          <button
            type="button"
            className="flex min-w-[210px] items-center gap-2 rounded-full px-1.5 py-1 transition hover:bg-neutral-100"
            aria-label="Open profile menu"
            onClick={() => {
              setShowProfileMenu((value) => !value);
              setShowNotifications(false);
            }}
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-blue-700 text-xs font-semibold text-white">
              {initials}
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="block truncate text-sm font-semibold text-neutral-950">
                {user.name}
              </span>
              <span className="block truncate text-xs text-neutral-500">Store Manager</span>
            </span>
            <ChevronDown className="size-4 shrink-0 text-neutral-400" aria-hidden="true" />
          </button>

          {showProfileMenu ? (
            <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-1.5 shadow-2xl shadow-neutral-300/60">
              <ProfileMenuLink
                href="/dashboard/profile"
                icon={UserRound}
                label="Profile"
                onNavigate={() => setShowProfileMenu(false)}
              />
              <ProfileMenuLink
                href="/dashboard/settings"
                icon={Settings}
                label="Settings"
                onNavigate={() => setShowProfileMenu(false)}
              />
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                onClick={() => setShowProfileMenu(false)}
              >
                <LogOut className="size-4" aria-hidden="true" />
                Log out
              </button>
            </div>
          ) : null}
        </div>

        <div className="grid size-9 place-items-center rounded-full bg-blue-700 text-xs font-semibold text-white sm:hidden">
          {initials}
        </div>
      </div>
    </header>
  );
}

function ProfileMenuLink({
  href,
  icon: Icon,
  label,
  onNavigate,
}: {
  href: "/dashboard/profile" | "/dashboard/settings";
  icon: typeof UserRound;
  label: string;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-950"
    >
      <Icon className="size-4" aria-hidden="true" />
      {label}
    </Link>
  );
}

function getPageTitle(pathname: string) {
  if (pathname.startsWith("/dashboard/orders")) return "Orders";
  if (pathname.startsWith("/dashboard/products")) return "Products";
  if (pathname.startsWith("/dashboard/profile")) return "Profile";
  if (pathname.startsWith("/dashboard/settings")) return "Settings";
  return "Overview";
}

function getPageDescription(pathname: string) {
  if (pathname.startsWith("/dashboard/orders")) return "Review ecommerce orders and fulfillment.";
  if (pathname.startsWith("/dashboard/products")) return "Manage catalog, stock, and product status.";
  if (pathname.startsWith("/dashboard/profile")) return "Admin account, permissions, and access summary.";
  if (pathname.startsWith("/dashboard/settings")) return "Store configuration and operational controls.";
  return "Monitor ecommerce performance and store health.";
}
