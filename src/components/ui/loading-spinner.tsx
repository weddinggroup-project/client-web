import { ImSpinner2 } from "react-icons/im";
import { cn } from "@/lib/utils";

type LoadingSpinnerProps = {
  label?: string;
  className?: string;
  fullScreen?: boolean;
};

export function LoadingSpinner({
  label = "Memuat",
  className,
  fullScreen = false,
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3",
        fullScreen && "min-h-screen bg-slate-950 text-white",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <ImSpinner2 className="size-5 animate-spin text-blue-400" aria-hidden="true" />
      <span className={cn("text-sm", fullScreen ? "text-slate-300" : "text-slate-600")}>
        {label}
      </span>
    </div>
  );
}
