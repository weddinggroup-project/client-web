"use client";

import { FormEvent, useState } from "react";
import { HiCheckCircle } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { AuthField } from "./auth-field";

export function ForgotPasswordForm() {
  const [pending, setPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    setPending(true);

    // This starter doesn't wire password recovery to a real backend yet —
    // we simulate the request being sent successfully.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setPending(false);
    setIsSuccess(true);
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <HiCheckCircle className="size-10 text-success" aria-hidden="true" />
        <p className="font-semibold text-foreground">Instruksi terkirim!</p>
        <p className="text-sm text-muted-foreground">
          Cek email atau SMS kamu untuk melanjutkan pemulihan akun.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <AuthField
        label="Email / No Telp."
        id="identifier"
        name="identifier"
        required
        autoComplete="email"
        placeholder="nama@email.com atau 08xxxxxxxxxx"
      />

      <Button type="submit" variant="rose" className="h-12 w-full px-8" disabled={pending}>
        {pending ? "Mengirim..." : "Kirim"}
      </Button>
    </form>
  );
}
