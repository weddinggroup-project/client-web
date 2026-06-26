"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/button";
import { TurnstileWidget } from "./turnstile-widget";

export function GoogleSignInButton({
  enabled,
  turnstileSiteKey,
}: {
  enabled: boolean;
  turnstileSiteKey?: string;
}) {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const [pending, setPending] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string>();

  return (
    <div className="space-y-4">
      {turnstileSiteKey ? (
        <TurnstileWidget siteKey={turnstileSiteKey} onToken={setToken} />
      ) : null}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={!enabled || !token || pending}
        onClick={async () => {
          if (!token) return;
          setPending(true);
          setError(undefined);

          const verification = await fetch("/api/turnstile/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });

          if (!verification.ok) {
            setPending(false);
            setToken(null);
            setError(t("verificationFailed"));
            return;
          }

          await signIn.social({
            provider: "google",
            callbackURL: `/${locale}/dashboard`,
            errorCallbackURL: `/${locale}/sign-in`,
          });
          setPending(false);
        }}
      >
        <FcGoogle className="size-5" aria-hidden="true" />
        {pending ? t("redirecting") : t("google")}
      </Button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
