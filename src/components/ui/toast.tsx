import { AlertCircle, CheckCircle2, Info, type LucideIcon } from "lucide-react";

type ToastVariant = "success" | "warning" | "info";

type ToastProps = {
  open: boolean;
  title: string;
  description: string;
  variant?: ToastVariant;
};

const variants: Record<
  ToastVariant,
  { icon: LucideIcon; tone: string }
> = {
  success: { icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-600" },
  warning: { icon: AlertCircle, tone: "bg-amber-50 text-amber-600" },
  info: { icon: Info, tone: "bg-secondary text-primary" },
};

export function Toast({
  open,
  title,
  description,
  variant = "success",
}: ToastProps) {
  if (!open) return null;

  const { icon: Icon, tone } = variants[variant];

  return (
    <div className="fixed right-5 top-5 z-[70] w-[min(420px,calc(100vw-2.5rem))] rounded-2xl border border-neutral-200 bg-white p-4 shadow-2xl shadow-neutral-900/15">
      <div className="flex gap-3">
        <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${tone}`}>
          <Icon className="size-5" aria-hidden />
        </span>
        <div>
          <p className="text-sm font-semibold text-neutral-950">{title}</p>
          <p className="mt-1 text-sm leading-5 text-neutral-600">{description}</p>
        </div>
      </div>
    </div>
  );
}
