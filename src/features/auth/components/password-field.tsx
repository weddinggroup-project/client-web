"use client";

import { useId, useState, type ComponentProps } from "react";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { authInputClassName, authLabelClassName } from "./auth-field";

type PasswordFieldProps = Omit<ComponentProps<typeof Input>, "type" | "id"> & {
  label: string;
  id?: string;
  /** Extra content rendered next to the label, e.g. a "forgot password" link. */
  labelAside?: React.ReactNode;
};

/** A labeled password input with a show/hide toggle, reused across the auth forms. */
export function PasswordField({
  label,
  id,
  labelAside,
  className,
  ...props
}: PasswordFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={inputId} className={authLabelClassName}>
          {label}
        </Label>
        {labelAside}
      </div>

      <div className="relative">
        <Input
          id={inputId}
          type={isVisible ? "text" : "password"}
          className={cn(authInputClassName, "pr-9", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setIsVisible((visible) => !visible)}
          aria-label={isVisible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          className="absolute top-1/2 right-0 -translate-y-1/2 p-1 text-muted-foreground transition hover:text-foreground"
        >
          {isVisible ? (
            <HiEyeSlash className="size-4" aria-hidden="true" />
          ) : (
            <HiEye className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
