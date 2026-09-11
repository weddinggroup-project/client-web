"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiCheckCircle, HiExclamationCircle } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { AuthField } from "./auth-field";
import { PasswordField } from "./password-field";

export function SignUpForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  const [isSuccess, setIsSuccess] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    const agreedToTerms = formData.get("terms") === "on";

    setError(undefined);

    if (password !== confirmPassword) {
      setError("Konfirmasi sandi tidak cocok dengan kata sandi.");
      return;
    }

    if (!agreedToTerms) {
      setError("Kamu perlu menyetujui Syarat & Ketentuan terlebih dahulu.");
      return;
    }

    setPending(true);

    // This starter doesn't wire registration to a real backend yet — we
    // simulate a successful sign-up and hand the user back to Login.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setPending(false);
    setIsSuccess(true);

    setTimeout(() => {
      router.push("/sign-in");
    }, 1500);
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <HiCheckCircle className="size-10 text-success" aria-hidden="true" />
        <p className="font-semibold text-foreground">Akun berhasil dibuat!</p>
        <p className="text-sm text-muted-foreground">
          Mengarahkan kamu ke halaman login...
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <AuthField
        label="Alamat Email"
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="nama@email.com"
      />

      <PasswordField
        label="Kata Sandi"
        id="password"
        name="password"
        required
        minLength={8}
        autoComplete="new-password"
        placeholder="Minimal 8 karakter"
      />

      <PasswordField
        label="Konfirmasi Sandi"
        id="confirmPassword"
        name="confirmPassword"
        required
        minLength={8}
        autoComplete="new-password"
        placeholder="Ulangi kata sandi"
      />

      <AuthField
        label="Nomor Telepon"
        id="phone"
        name="phone"
        type="tel"
        required
        autoComplete="tel"
        placeholder="08xxxxxxxxxx"
      />

      <label className="flex items-start gap-2.5 text-sm text-muted-foreground">
        <input
          type="checkbox"
          name="terms"
          required
          className="mt-0.5 size-4 rounded border-border accent-primary"
        />
        <span>
          Saya setuju dengan{" "}
          <Link href="#" className="font-medium text-primary hover:text-primary-hover">
            Syarat & Ketentuan
          </Link>{" "}
          serta{" "}
          <Link href="#" className="font-medium text-primary hover:text-primary-hover">
            Kebijakan Privasi
          </Link>
        </span>
      </label>

      {error ? (
        <p className="flex items-start gap-2 rounded-xl bg-error/10 p-3 text-sm leading-6 text-error">
          <HiExclamationCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}

      <Button type="submit" variant="rose" className="h-12 w-full px-8" disabled={pending}>
        {pending ? "Memproses..." : "Sign Up"}
      </Button>
    </form>
  );
}
