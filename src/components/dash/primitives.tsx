import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** White card on the cream canvas. */
export function Panel({ className, ...props }: ComponentProps<"section">) {
  return (
    <section
      className={cn("rounded-2xl border border-gold/50 bg-white p-5 shadow-sm shadow-gold/20 sm:p-6", className)}
      {...props}
    />
  );
}

export function SectionTitle({
  eyebrow,
  title,
  aside,
}: {
  eyebrow?: string;
  title: string;
  aside?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        {eyebrow ? (
          <p className="text-[11px] font-medium tracking-[0.12em] text-ink-soft uppercase">{eyebrow}</p>
        ) : null}
        <h2 className="mt-0.5 font-serif text-xl font-semibold text-ink">{title}</h2>
      </div>
      {aside}
    </div>
  );
}

/** Page heading: small eyebrow, serif title, description, and action buttons on the right. */
export function DashHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <span className="inline-flex rounded-full bg-gold/40 px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-gold-foreground uppercase">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="mt-2 font-serif text-3xl leading-tight font-semibold tracking-tight text-ink sm:text-[32px]">
          {title}
        </h1>
        {description ? <p className="mt-2 text-sm leading-6 text-ink-soft">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

const tones = {
  neutral: "bg-muted text-ink-soft",
  gold: "bg-gold/50 text-gold-foreground",
  blush: "bg-blush/50 text-blush-foreground",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-700",
} as const;

export type Tone = keyof typeof tones;

export function Badge({ tone = "neutral", className, ...props }: ComponentProps<"span"> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone,
  icon,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gold/50 bg-white p-4 shadow-sm shadow-gold/20">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-medium tracking-[0.1em] text-ink-soft uppercase">{label}</p>
        {icon ? <span className="text-ink-soft">{icon}</span> : null}
      </div>
      <p className="mt-2 font-serif text-2xl font-semibold text-ink">{value}</p>
      {hint ? (
        <p className={cn("mt-1 text-xs", tone === "danger" ? "text-red-700" : tone === "success" ? "text-emerald-700" : "text-ink-soft")}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function ProgressBar({ value, max = 100, tone = "primary" }: { value: number; max?: number; tone?: "primary" | "gold" | "danger" }) {
  const pct = max <= 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100));
  const color = tone === "danger" ? "bg-red-500" : tone === "gold" ? "bg-gold-foreground/60" : "bg-primary";
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-gold/40" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
      <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
    </div>
  );
}

export const btn = {
  primary:
    "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blush px-4 text-sm font-semibold text-blush-foreground shadow-sm transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50",
  solid:
    "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50",
  secondary:
    "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gold/60 bg-white px-4 text-sm font-semibold text-ink shadow-sm transition hover:bg-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50",
  danger:
    "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:pointer-events-none disabled:opacity-50",
  icon: "grid size-8 place-items-center rounded-md text-ink-soft transition hover:bg-gold/30 hover:text-ink focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-40",
} as const;
