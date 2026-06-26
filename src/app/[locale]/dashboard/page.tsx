import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { requireSession } from "@/lib/auth/session";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [session, t, authT] = await Promise.all([
    requireSession(locale),
    getTranslations("Dashboard"),
    getTranslations("Auth"),
  ]);

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
        {t("title")}
      </h1>
      <p className="mt-2 text-slate-600">{t("description")}</p>
      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_280px]">
        <Card>
          <p className="text-lg font-semibold text-slate-950">
            {t("welcome", { name: session.user.name })}
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {authT("protected")}
          </p>
        </Card>
        <Card className="h-fit">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Session
          </p>
          <SignOutButton />
        </Card>
      </div>
    </div>
  );
}
