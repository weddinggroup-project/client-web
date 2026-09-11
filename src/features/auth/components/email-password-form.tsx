"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HiExclamationCircle } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { AuthField } from "./auth-field";
import { PasswordField } from "./password-field";

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
    <form className="space-y-5" onSubmit={onSubmit}>
      <AuthField
        label="Email Address"
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        defaultValue={dummyAdmin.email}
        placeholder="nama@email.com"
      />

      <PasswordField
        label="Password"
        id="password"
        name="password"
        required
        minLength={8}
        autoComplete="current-password"
        defaultValue={dummyAdmin.password}
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
        disabled={!enabled || pending}
      >
        {pending ? "Memproses..." : "Login"}
      </Button>
    </form>
  );
}
