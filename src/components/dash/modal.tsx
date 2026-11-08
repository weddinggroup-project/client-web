"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { HiXMark } from "react-icons/hi2";
import { btn } from "./primitives";

/**
 * Accessible modal built on the native <dialog> element: focus is trapped, Escape closes, and the page behind is
 * inert. Backdrop clicks close it too.
 */
export function Modal({
  open,
  title,
  description,
  onClose,
  children,
  wide = false,
}: {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="modal-title"
      onClose={onClose}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className={`m-auto w-[calc(100%-2rem)] ${wide ? "max-w-2xl" : "max-w-lg"} rounded-2xl border border-gold/50 bg-white p-0 text-ink shadow-2xl backdrop:bg-ink/30 backdrop:backdrop-blur-sm`}
    >
      {open ? (
        <div className="max-h-[85vh] overflow-y-auto p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="modal-title" className="font-serif text-xl font-semibold">
                {title}
              </h2>
              {description ? <p className="mt-1 text-sm text-ink-soft">{description}</p> : null}
            </div>
            <button type="button" className={btn.icon} aria-label="Tutup" onClick={onClose}>
              <HiXMark className="size-5" aria-hidden />
            </button>
          </div>
          <div className="mt-4">{children}</div>
        </div>
      ) : null}
    </dialog>
  );
}
