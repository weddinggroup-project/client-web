"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HiExclamationCircle } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/vowly/client";
import { landingPath } from "@/lib/vowly/safe-next";
import type { User } from "@/lib/vowly/types";
import { AuthField } from "./auth-field";
import { PasswordField } from "./password-field";

export function EmailPasswordForm({ next }: { next: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const formData = new FormData(event.currentTarget);
    setPending(true);
    setError(undefined);
    try {
      const { data } = await api.session<{ user: User }>("login", {
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      });
      router.replace(landingPath(data.user.role, next));
      router.refresh();
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Terjadi kesalahan. Coba lagi.");
      setPending(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <AuthField
        label="Email Address"
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="nama@email.com"
      />

      <PasswordField
        label="Password"
        id="password"
        name="password"
        required
        autoComplete="current-password"
        placeholder="Masukkan password"
        labelAside={
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-primary transition hover:text-primary-hover"
          >
            Lupa Kata Sandi?
          </Link>
        }
      />

      {error ? (
        <p className="flex items-start gap-2 rounded-xl bg-error/10 p-3 text-sm leading-6 text-error">
          <HiExclamationCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        variant="rose"
        className="h-12 w-full px-8"
        disabled={pending}
      >
        {pending ? "Memproses..." : "Login"}
      </Button>
    </form>
  );
}
