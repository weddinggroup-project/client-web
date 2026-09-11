import Link from "next/link";
import { cn } from "@/lib/utils";

/** Brand mark shared across the sign-in, sign-up, and forgot-password pages. */
export function AuthLogo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-block rounded-md font-serif text-3xl font-semibold text-accent transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus",
        className,
      )}
      aria-label="Vowly home"
    >
      Vowly
    </Link>
  );
}
