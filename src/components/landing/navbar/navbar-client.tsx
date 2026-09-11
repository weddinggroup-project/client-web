"use client";

import { useState } from "react";
import Link from "next/link";
import { HiChevronDown, HiOutlineXMark, HiOutlineBars3 } from "react-icons/hi2";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { navLinks } from "@/components/landing/landing-data";
import { NavDropdown } from "./nav-dropdown";

export function NavbarClient({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);

  const authHref = isAuthenticated ? "/dashboard" : "/sign-in";
  const authLabel = isAuthenticated ? "Dashboard" : "Login";

  function closeMobileMenu() {
    setIsMenuOpen(false);
    setOpenMobileSubmenu(null);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <Container className="flex h-20 items-center justify-between py-3">
        <Link
          href="/"
          className="rounded-md font-serif text-3xl font-semibold text-accent transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
          aria-label="Vowly home"
        >
          Vowly
        </Link>

        <nav
          className="hidden items-center gap-12 md:flex"
          aria-label="Main navigation"
        >
          {navLinks.map((item) =>
            item.submenu ? (
              <NavDropdown key={item.label} label={item.label} submenu={item.submenu} />
            ) : (
              <a
                key={item.href}
                href={item.href}
                className="group relative py-1 text-sm font-medium text-foreground/80 transition hover:text-foreground focus-visible:rounded focus-visible:outline-2 focus-visible:outline-focus"
              >
                {item.label}
                <span className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </a>
            ),
          )}
        </nav>

        <div className="flex items-center gap-3">
          <ButtonLink
            href={authHref}
            variant="rose"
            className="hidden h-11 px-7 text-sm uppercase sm:inline-flex"
          >
            {authLabel}
          </ButtonLink>

          <button
            type="button"
            className="grid size-10 place-items-center rounded-full text-foreground transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-focus md:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? (
              <HiOutlineXMark className="size-6" aria-hidden="true" />
            ) : (
              <HiOutlineBars3 className="size-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </Container>

      {isMenuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile navigation"
          className="border-t border-border bg-background px-5 py-4 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((item) => (
              <li key={item.href}>
                {item.submenu ? (
                  <MobileSubmenuItem
                    label={item.label}
                    submenu={item.submenu}
                    isOpen={openMobileSubmenu === item.label}
                    onToggle={() =>
                      setOpenMobileSubmenu((current) =>
                        current === item.label ? null : item.label,
                      )
                    }
                    onSelect={closeMobileMenu}
                  />
                ) : (
                  <a
                    href={item.href}
                    className="block py-2.5 text-sm font-medium text-foreground/70 transition hover:text-foreground"
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </a>
                )}
              </li>
            ))}
            <li>
              <ButtonLink
                href={authHref}
                variant="rose"
                className="mt-3 h-10 w-full px-6 text-xs uppercase tracking-wide"
              >
                {authLabel}
              </ButtonLink>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

type MobileSubmenuItemProps = {
  label: string;
  submenu: { href: string; label: string }[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: () => void;
};

/** Accordion-style expand for a nav item's submenu inside the mobile drawer. */
function MobileSubmenuItem({
  label,
  submenu,
  isOpen,
  onToggle,
  onSelect,
}: MobileSubmenuItemProps) {
  return (
    <div>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="flex w-full items-center justify-between py-2.5 text-sm font-medium text-foreground/70 transition hover:text-foreground"
      >
        {label}
        <HiChevronDown
          className={cn("size-4 transition-transform duration-200", isOpen && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className="flex flex-col gap-1 border-l border-border pb-1 pl-4">
          {submenu.map((subItem) => (
            <a
              key={subItem.label}
              href={subItem.href}
              onClick={onSelect}
              className="py-1.5 text-sm text-muted-foreground transition hover:text-foreground"
            >
              {subItem.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
