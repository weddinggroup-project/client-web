"use client";

import { useState, type FormEvent } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { AuthField } from "@/features/auth/components/auth-field";
import { collaboratorAccessOptions, collaboratorRoles } from "./wizard-data";
import type { Collaborator } from "./order-wizard";

type InviteCollaboratorModalProps = {
  onClose: () => void;
  onInvite: (collaborator: Collaborator) => void;
};

export function InviteCollaboratorModal({
  onClose,
  onInvite,
}: InviteCollaboratorModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(collaboratorRoles[0]!.value);
  const [accessList, setAccessList] = useState<string[]>([]);

  function toggleAccess(option: string) {
    setAccessList((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option],
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) return;

    onInvite({ name: email.split("@")[0] ?? email, email });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md animate-[modal-in_0.2s_ease-out] rounded-2xl bg-background p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-foreground">
              Kirim Undangan Kolaborasi
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Undang tim pernikahanmu atau pasangan untuk persiapan yang lebih
              matang dan berkesan.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <HiOutlineXMark className="size-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <AuthField
            label="Kirim Undangan Ke Email"
            id="collaboratorEmail"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="contoh@email.com"
          />

          <div>
            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Berikan Sebagai
            </p>
            <div className="mt-3 flex gap-4">
              {collaboratorRoles.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 text-sm text-foreground/80"
                >
                  <input
                    type="radio"
                    name="collaboratorRole"
                    value={option.value}
                    checked={role === option.value}
                    onChange={() => setRole(option.value)}
                    className="size-4 accent-primary"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Berikan Akses
            </p>
            <div className="mt-3 grid grid-cols-2 gap-y-2 text-sm text-foreground/80">
              {collaboratorAccessOptions.map((option) => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={accessList.includes(option)}
                    onChange={() => toggleAccess(option)}
                    className="size-4 rounded border-border accent-primary"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Tutup
            </Button>
            <Button type="submit" variant="rose">
              Kirim Undangan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
