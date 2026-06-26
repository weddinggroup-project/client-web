import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { GoogleSignInButton } from "@/features/auth/components/google-sign-in-button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/layout/logo";
import { loginConfigured, serverEnv } from "@/lib/env";
import { getSession } from "@/lib/auth/session";

export default async function SignInPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, session] = await Promise.all([getTranslations("Auth"), getSession()]);

  if (session) {
    redirect(`/${locale}/dashboard`);
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-slate-950 p-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,.28),transparent_42%)]" />
      <Card className="relative w-full max-w-md p-8">
        <div className="[&_a]:text-slate-950">
          <Logo />
        </div>
        <h1 className="mt-8 text-3xl font-semibold tracking-tight text-slate-950">
          {t("title")}
        </h1>
        <p className="mt-3 leading-7 text-slate-600">{t("description")}</p>
        <div className="mt-8">
          <GoogleSignInButton
            enabled={loginConfigured}
            turnstileSiteKey={serverEnv.TURNSTILE_SITE_KEY}
          />
        </div>
        {!loginConfigured ? (
          <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-900">
            {t("notConfigured")}
          </p>
        ) : null}
      </Card>
    </main>
  );
}
