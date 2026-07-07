import Link from "next/link";
import { FaGithub } from "react-icons/fa6";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { getSession } from "@/lib/auth/session";
import { siteConfig } from "@/lib/site";

export async function SiteHeader() {
  const session = await getSession();
  const navigation = [
    { href: "#features", label: "Fondasi" },
    { href: "#architecture", label: "Struktur" },
    { href: "#components", label: "Komponen" },
    { href: "#quality", label: "Kualitas" },
  ];

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <Container className="flex h-20 items-center justify-between">
        <Link
          href="/"
          className="rounded-md text-xl font-semibold tracking-tight text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400"
          aria-label="Ganipedia home"
        >
          gani<span className="text-blue-600">pedia</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-neutral-500 transition hover:text-neutral-950 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-blue-400"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ButtonLink
            href={session ? "/dashboard" : "/sign-in"}
            variant="secondary"
            className="h-10 px-4"
          >
            {session ? "Dashboard" : "Masuk"}
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
