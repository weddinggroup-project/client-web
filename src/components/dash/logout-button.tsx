"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/vowly/client";
import { useFeedback } from "./feedback";

/** Signs the user out after a confirmation: clears the session cookie, then returns to the sign-in page. */
export function LogoutButton({ className, children, label = "Keluar" }: { className?: string; children?: ReactNode; label?: string }) {
  const router = useRouter();
  const feedback = useFeedback();
  const [pending, setPending] = useState(false);

  async function logout() {
    if (pending) return;
    const ok = await feedback.confirm({ title: "Keluar dari Vowly?", description: "Anda perlu masuk lagi untuk membuka dashboard.", confirmLabel: "Keluar", danger: true });
    if (!ok) return;
    setPending(true);
    try {
      await api.session("logout");
    } finally {
      router.replace("/sign-in");
      router.refresh();
    }
  }

  return (
    <button type="button" onClick={() => void logout()} disabled={pending} className={className}>
      {children ?? (pending ? "Keluar…" : label)}
    </button>
  );
}
