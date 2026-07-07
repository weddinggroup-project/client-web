import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link, { type LinkProps } from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-blue-700 text-white shadow-lg shadow-blue-700/20 hover:bg-blue-800",
  secondary:
    "border border-neutral-200 bg-white text-neutral-800 shadow-sm shadow-neutral-200/60 hover:bg-neutral-50",
  outline:
    "border border-slate-300 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50",
  ghost: "text-slate-700 hover:bg-slate-100 hover:text-slate-950",
  destructive: "bg-red-600 text-white hover:bg-red-700",
} as const;

type ButtonVariant = keyof typeof variants;

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: LinkProps & {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
}) {
  return (
    <Link
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
