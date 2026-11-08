"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/vowly/client";
import type { AcceptInvite } from "@/lib/vowly/types";

export function AcceptForm({ initialToken, email }: { initialToken: string; email: string }) {
  const router = useRouter();
  const [token, setToken] = useState(initialToken);
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (pending || token.trim() === "") return;
    setPending(true);
    setError(undefined);
    try {
      const { data } = await api.post<AcceptInvite>("/collaborations/accept", { token: token.trim() });
      router.replace(`/dashboard/${data.invitation_id}`);
    } catch (cause) {
      // The API answers every failure the same way on purpose, so the message is generic.
      setError(cause instanceof ApiError ? cause.message : "Terjadi kesalahan. Coba lagi.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-4 text-left">
      <p className="text-sm text-muted-foreground">
        Masuk sebagai <strong className="text-foreground">{email}</strong>. Undangan hanya berlaku bila email ini sama dengan email yang diundang.
      </p>
      <div>
        <label htmlFor="token" className="mb-1.5 block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Token undangan
        </label>
        <input
          id="token"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          autoComplete="off"
          spellCheck={false}
          maxLength={200}
          required
          className="h-11 w-full rounded-lg border border-border bg-background px-3 font-mono text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
      {error ? (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <Button type="submit" variant="rose" className="h-12 w-full" disabled={pending}>
        {pending ? "Memproses…" : "Terima undangan"}
      </Button>
    </form>
  );
}
