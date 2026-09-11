import Link from "next/link";
import { HiChevronRight } from "react-icons/hi2";
import { Card } from "@/components/ui/card";
import type { HelpCategory } from "../help-center-data";

export function HelpCategoryCard({
  icon: Icon,
  title,
  description,
  count,
  href,
}: HelpCategory) {
  return (
    <Card className="group h-full rounded-2xl border-card-border p-6 shadow-sm shadow-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10">
      <span className="grid size-12 place-items-center rounded-full bg-secondary text-accent transition-transform duration-300 group-hover:scale-110">
        <Icon className="size-6" aria-hidden="true" />
      </span>

      <h3 className="mt-5 text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>

      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition group-hover:text-primary"
      >
        {count}
        <HiChevronRight
          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </Link>
    </Card>
  );
}
