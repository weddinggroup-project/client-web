import type { IconType } from "react-icons";
import { Card } from "@/components/ui/card";

type SolutionCardProps = {
  icon: IconType;
  title: string;
  description: string;
};

export function SolutionCard({ icon: Icon, title, description }: SolutionCardProps) {
  return (
    <Card className="group flex h-full flex-col items-center rounded-2xl border-card-border p-6 text-center shadow-sm shadow-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-secondary text-accent transition-transform duration-300 group-hover:scale-110">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <h3 className="mt-5 text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
    </Card>
  );
}
