"use client";

import { FormEvent, useState } from "react";
import { KeyRound, PencilLine, X } from "lucide-react";
import { Toast } from "@/components/ui/toast";

type ProfileActionsProps = {
  name: string;
  email: string;
};

type ModalMode = "profile" | "password";

export function ProfileActions({ name, email }: ProfileActionsProps) {
  const [modal, setModal] = useState<ModalMode | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  }

  function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setModal(null);
    showToast("Profile changes saved to dummy state.");
  }

  function submitPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setModal(null);
    showToast("Password update simulated successfully.");
  }

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800"
          onClick={() => setModal("profile")}
        >
          <PencilLine className="size-4" aria-hidden="true" />
          Edit profile
        </button>
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
          onClick={() => setModal("password")}
        >
          <KeyRound className="size-4" aria-hidden="true" />
          Change password
        </button>
      </div>

      <Toast
        open={Boolean(toast)}
        title="Admin profile updated"
        description={toast ?? ""}
      />

      {modal ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-neutral-950/30 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setModal(null);
            }
          }}
        >
          <section className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl shadow-neutral-900/20">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-neutral-950">
                  {modal === "profile" ? "Edit Profile" : "Change Password"}
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  {modal === "profile"
                    ? "Update dummy admin identity for this starter template."
                    : "Simulate a password change flow for the admin account."}
                </p>
              </div>
              <button
                type="button"
                className="grid size-9 place-items-center rounded-xl text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
                aria-label="Close modal"
                onClick={() => setModal(null)}
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            {modal === "profile" ? (
              <form className="mt-5 space-y-4" onSubmit={submitProfile}>
                <ProfileField label="Full name" defaultValue={name} />
                <ProfileField label="Email" defaultValue={email} type="email" />
                <ProfileField label="Role" defaultValue="Owner" />
                <ModalActions onCancel={() => setModal(null)} submitLabel="Save profile" />
              </form>
            ) : (
              <form className="mt-5 space-y-4" onSubmit={submitPassword}>
                <ProfileField label="Current password" type="password" placeholder="Current password" />
                <ProfileField label="New password" type="password" placeholder="New password" />
                <ProfileField label="Confirm password" type="password" placeholder="Confirm password" />
                <ModalActions onCancel={() => setModal(null)} submitLabel="Update password" />
              </form>
            )}
          </section>
        </div>
      ) : null}
    </>
  );
}

function ProfileField({
  label,
  defaultValue,
  type = "text",
  placeholder,
}: {
  label: string;
  defaultValue?: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-neutral-700">{label}</span>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-neutral-200 px-3 text-sm outline-none transition focus:border-blue-300 focus:ring-3 focus:ring-blue-100"
      />
    </label>
  );
}

function ModalActions({
  onCancel,
  submitLabel,
}: {
  onCancel: () => void;
  submitLabel: string;
}) {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <button
        type="button"
        className="h-10 rounded-xl border border-neutral-200 px-4 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50"
        onClick={onCancel}
      >
        Cancel
      </button>
      <button
        type="submit"
        className="h-10 rounded-xl bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800"
      >
        {submitLabel}
      </button>
    </div>
  );
}
