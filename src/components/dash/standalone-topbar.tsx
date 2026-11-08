"use client";

import Link from "next/link";
import { HiOutlineArrowRightOnRectangle } from "react-icons/hi2";
import { FeedbackProvider } from "./feedback";
import { LogoutButton } from "./logout-button";

const logoutClass = "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50";

/** Sign-out button for pages that have no app shell (project list, locked dashboard, wizard, invite acceptance). */
export function StandaloneLogout() {
  return (
    <FeedbackProvider>
      <LogoutButton className={logoutClass}>
        <HiOutlineArrowRightOnRectangle className="size-4" aria-hidden />
        Keluar
      </LogoutButton>
    </FeedbackProvider>
  );
}

/** Minimal top bar for shell-less pages: brand on the left, who is signed in and the sign-out button on the right. */
export function StandaloneTopbar({ name, isAdmin = false }: { name?: string; isAdmin?: boolean }) {
  return (
    <header className="flex items-center justify-between border-b border-gold/40 bg-white px-4 py-3 font-dash sm:px-8">
      <Link href="/" className="font-serif text-2xl font-semibold text-accent">
        Vowly
      </Link>
      <div className="flex items-center gap-2 text-sm">
        {name ? <span className="hidden max-w-48 truncate text-ink-soft sm:block">{name}</span> : null}
        {isAdmin ? (
          <Link href="/admin" className="rounded-lg px-3 py-1.5 font-medium text-ink hover:bg-gold/25">
            Panel admin
          </Link>
        ) : null}
        <StandaloneLogout />
      </div>
    </header>
  );
}
