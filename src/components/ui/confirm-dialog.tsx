"use client";

import { AlertCircle, X } from "lucide-react";
import type { ReactNode } from "react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  if (!open) return null;

  const confirmClass =
    variant === "danger"
      ? "bg-rose-600 text-white hover:bg-rose-700"
      : "bg-blue-700 text-white hover:bg-blue-800";

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-neutral-950/30 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl shadow-neutral-900/20">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-rose-50 text-rose-600">
            <AlertCircle className="size-5" aria-hidden />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-neutral-950">{title}</h2>
            <div className="mt-1 text-sm leading-6 text-neutral-500">
              {description}
            </div>
          </div>
          <button
            type="button"
            className="ml-auto text-neutral-400 transition hover:text-neutral-700"
            aria-label="Close confirmation"
            onClick={onClose}
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            className="h-10 rounded-xl border border-neutral-200 px-4 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50"
            onClick={onClose}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`h-10 rounded-xl px-4 text-sm font-semibold transition ${confirmClass}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
