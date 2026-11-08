"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Toast } from "@/components/ui/toast";

type ToastState = { title: string; description: string; variant: "success" | "warning" | "info" } | null;
type ConfirmOptions = { title: string; description: string; confirmLabel?: string; danger?: boolean };

type Feedback = {
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const FeedbackContext = createContext<Feedback | null>(null);

/** Toasts and promise-based confirmation dialogs for the whole dashboard. */
export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>(null);
  const [confirmState, setConfirmState] = useState<(ConfirmOptions & { resolve: (ok: boolean) => void }) | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const show = useCallback((state: Exclude<ToastState, null>) => {
    setToast(state);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 4000);
  }, []);

  const value = useMemo<Feedback>(
    () => ({
      success: (title, description = "") => show({ title, description, variant: "success" }),
      error: (title, description = "") => show({ title, description, variant: "warning" }),
      confirm: (options) => new Promise<boolean>((resolve) => setConfirmState({ ...options, resolve })),
    }),
    [show],
  );

  function settle(ok: boolean) {
    confirmState?.resolve(ok);
    setConfirmState(null);
  }

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      <div aria-live="polite">
        <Toast open={toast !== null} title={toast?.title ?? ""} description={toast?.description ?? ""} variant={toast?.variant} />
      </div>
      <ConfirmDialog
        open={confirmState !== null}
        title={confirmState?.title ?? ""}
        description={confirmState?.description ?? ""}
        confirmLabel={confirmState?.confirmLabel ?? "Ya, lanjutkan"}
        cancelLabel="Batal"
        variant={confirmState?.danger ? "danger" : "default"}
        onConfirm={() => settle(true)}
        onClose={() => settle(false)}
      />
    </FeedbackContext.Provider>
  );
}

export function useFeedback(): Feedback {
  const value = useContext(FeedbackContext);
  if (!value) throw new Error("useFeedback must be used inside <FeedbackProvider>");
  return value;
}
