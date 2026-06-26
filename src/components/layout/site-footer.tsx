import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Logo } from "./logo";

export async function SiteFooter() {
  const t = await getTranslations("Footer");

  return (
    <footer className="border-t border-white/10 bg-slate-950 py-10 text-slate-400">
      <Container className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <Logo />
        <p className="text-sm">{t("tagline")}</p>
      </Container>
    </footer>
  );
}
