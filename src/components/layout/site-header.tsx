import { getLocale, getTranslations } from "next-intl/server";
import { FaGithub } from "react-icons/fa6";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { getSession } from "@/lib/auth/session";
import { siteConfig } from "@/lib/site";
import { LocaleSwitcher } from "./locale-switcher";
import { Logo } from "./logo";

export async function SiteHeader() {
  const [t, locale, session] = await Promise.all([
    getTranslations("Navigation"),
    getLocale(),
    getSession(),
  ]);
  const navigation = [
    { href: "#features", label: t("foundation") },
    { href: "#architecture", label: t("structure") },
    { href: "#components", label: t("components") },
    { href: "#quality", label: t("quality") },
  ];

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <Container className="flex h-20 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-slate-300 transition hover:text-white focus-visible:rounded focus-visible:outline-2 focus-visible:outline-blue-400"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ButtonLink
            href={session ? `/${locale}/dashboard` : `/${locale}/sign-in`}
            variant="secondary"
            className="h-10 px-4"
          >
            {session ? t("dashboard") : t("signIn")}
          </ButtonLink>
          <ButtonLink
            href={siteConfig.links.github}
            variant="secondary"
            className="hidden size-10 px-0 lg:inline-flex"
            aria-label="GitHub"
          >
            <FaGithub className="size-4" aria-hidden="true" />
          </ButtonLink>
        </div>
      </Container>
    </header>
  );
}
