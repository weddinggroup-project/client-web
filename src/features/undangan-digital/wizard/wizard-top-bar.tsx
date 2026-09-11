import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi2";
import { cn } from "@/lib/utils";

type WizardTopBarProps = {
  onBack?: () => void;
  className?: string;
};

export function WizardTopBar({ onBack, className }: WizardTopBarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-6 py-5 sm:px-10",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Kembali ke langkah sebelumnya"
            className="grid size-8 place-items-center rounded-full text-foreground/70 transition hover:bg-muted hover:text-foreground"
          >
            <HiArrowLeft className="size-4" aria-hidden="true" />
          </button>
        ) : null}

        <Link
          href="/"
          className="font-serif text-xl font-semibold text-accent"
          aria-label="Vowly home"
        >
          Vowly
        </Link>
      </div>

      <span className="text-xs font-medium text-muted-foreground">Panduan</span>
    </div>
  );
}
