import type { ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/** Shared underline-style look for every text input across the auth pages. */
export const authInputClassName =
  "h-11 rounded-none border-0 border-b border-border bg-transparent px-0 text-foreground shadow-none placeholder:text-muted-foreground/50 focus:border-primary focus:ring-0";

export const authLabelClassName =
  "text-xs font-semibold tracking-wider text-muted-foreground uppercase";

type AuthFieldProps = ComponentProps<typeof Input> & {
  /** Omit only when the field already has a visible label elsewhere (e.g. a shared heading above a pair of inputs) — pass `aria-label` in that case instead. */
  label?: string;
  id: string;
};

/** A single labeled text input, styled consistently across the auth forms. */
export function AuthField({ label, id, className, ...props }: AuthFieldProps) {
  return (
    <div className="space-y-2">
      {label ? (
        <Label htmlFor={id} className={authLabelClassName}>
          {label}
        </Label>
      ) : null}
      <Input id={id} className={cn(authInputClassName, className)} {...props} />
    </div>
  );
}
