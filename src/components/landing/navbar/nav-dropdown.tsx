"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { HiChevronDown } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/components/landing/landing-data";

type NavDropdownProps = {
  label: string;
  submenu: NonNullable<NavItem["submenu"]>;
};

/**
 * Desktop nav item that reveals a submenu on click (not hover), so it stays
 * usable on touch devices and with the keyboard. Closes on outside click,
 * Escape, or when a submenu item is selected.
 */
export function NavDropdown({ label, submenu }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleOutsideClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="group inline-flex items-center gap-1 py-1 text-sm font-medium text-foreground/80 transition hover:text-foreground focus-visible:rounded focus-visible:outline-2 focus-visible:outline-focus"
      >
        <span className="relative">
          {label}
          <span
            className={cn(
              "absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100",
              isOpen && "scale-x-100",
            )}
          />
        </span>
        <HiChevronDown
          className={cn("size-4 transition-transform duration-200", isOpen && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label={label}
          className="animate-[dropdown-in_0.18s_ease-out] absolute top-full left-1/2 z-20 mt-3 w-64 -translate-x-1/2 rounded-xl border border-card-border bg-card p-2 shadow-xl shadow-black/5 ring-1 ring-black/5"
        >
          {submenu.map((subItem) => (
            <Link
              key={subItem.label}
              href={subItem.href}
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm text-foreground/80 transition duration-150 hover:translate-x-0.5 hover:bg-muted hover:text-foreground"
            >
              {subItem.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
