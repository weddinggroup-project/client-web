"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  HiArrowRight,
  HiEnvelope,
  HiExclamationCircle,
  HiLockClosed,
} from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const dummyAdmin = {
  email: "admin@gmail.com",
  password: "Admin123",
};

export function EmailPasswordForm({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabled || pending) return;

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    setPending(true);
    setError(undefined);

    if (email !== dummyAdmin.email || password !== dummyAdmin.password) {
      setPending(false);
      setError("Email atau password tidak valid.");
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <HiEnvelope
            className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-neutral-400"
            aria-hidden="true"
          />
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={dummyAdmin.email}
            placeholder="admin@gmail.com"
            className="h-12 rounded-2xl border-slate-200 bg-slate-50/60 pl-10 shadow-none focus-visible:outline-blue-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="password">Password</Label>
          <button
            type="button"
            className="text-sm font-medium text-blue-700 transition hover:text-blue-800"
          >
            Reset Password
          </button>
        </div>
        <div className="relative">
          <HiLockClosed
            className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-neutral-400"
            aria-hidden="true"
          />
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="current-password"
            defaultValue={dummyAdmin.password}
            placeholder="Admin123"
            className="h-12 rounded-2xl border-slate-200 bg-slate-50/60 pl-10 shadow-none focus-visible:outline-blue-500"
          />
        </div>
      </div>

      <label className="flex w-fit items-center gap-2 text-sm text-neutral-600">
        <input
          type="checkbox"
          className="size-4 rounded border-neutral-300 accent-blue-600"
          defaultChecked
        />
        Remember Password
      </label>

      {error ? (
        <p className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm leading-6 text-red-700">
          <HiExclamationCircle
            className="mt-0.5 size-5 shrink-0"
            aria-hidden="true"
          />
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        className="h-12 w-full rounded-2xl bg-[#1559d8] text-white shadow-lg shadow-blue-600/20 hover:bg-[#0f46b5]"
        disabled={!enabled || pending}
      >
        {pending ? "Memproses..." : "Masuk dengan email"}
        <HiArrowRight className="size-4" aria-hidden="true" />
      </Button>
    </form>
  );
}
