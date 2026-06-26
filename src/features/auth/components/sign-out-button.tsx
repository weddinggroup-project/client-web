"use client";

import { LogOut } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { signOut } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const t = useTranslations("Auth");
  const locale = useLocale();

  return (
    <Button
      type="button"
      variant="ghost"
      className="w-full justify-start"
      onClick={() =>
        signOut({
          fetchOptions: {
            onSuccess: () => {
              window.location.href = `/${locale}`;
            },
          },
        })
      }
    >
      <LogOut className="size-4" aria-hidden="true" />
      {t("signOut")}
    </Button>
  );
}
