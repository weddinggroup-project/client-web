import Link from "next/link";
import { Container } from "@/components/ui/container";
import {
  footerSocialLinks,
  footerSupportLinks,
} from "@/components/landing/landing-data";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-muted">
      <Container className="py-16">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <h3 className="text-xs font-semibold tracking-[0.18em] text-foreground uppercase">
              Profil Kami
            </h3>
            <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
              Vowly membantu calon pengantin merencanakan pernikahan impian
              dengan lebih mudah, terorganisir, dan minim stres.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-[0.18em] text-foreground uppercase">
              Media Sosial
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {footerSocialLinks.map(({ href, label, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="group inline-flex items-center gap-2.5 text-sm text-muted-foreground transition hover:text-foreground"
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-full border border-card-border bg-background transition group-hover:border-primary group-hover:bg-secondary group-hover:text-primary">
                      <Icon className="size-3.5" aria-hidden="true" />
                    </span>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-[0.18em] text-foreground uppercase">
              Support
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {footerSupportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      <div className="border-t border-card-border bg-muted py-5 text-center text-xs text-muted-foreground">
        © {year} Vowly. All rights reserved.
      </div>
    </footer>
  );
}
