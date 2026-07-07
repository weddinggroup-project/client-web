import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string;
  detail: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  className?: string;
};

export function StatCard({
  title,
  value,
  detail,
  icon: Icon,
  className,
}: StatCardProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-neutral-200/70 bg-white p-4 shadow-sm shadow-neutral-200/50",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-neutral-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
            {value}
          </p>
        </div>
        <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
          <Icon className="size-5" aria-hidden />
        </span>
      </div>
      <p className="mt-3 text-xs font-medium text-neutral-500">{detail}</p>
    </section>
  );
}
