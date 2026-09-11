import Image from "next/image";
import { HiOutlineStar, HiStar } from "react-icons/hi2";
import { Card } from "@/components/ui/card";

type TestimonialCardProps = {
  name: string;
  location: string;
  quote: string;
  rating: number;
  avatar: string;
};

export function TestimonialCard({
  name,
  location,
  quote,
  rating,
  avatar,
}: TestimonialCardProps) {
  return (
    <Card className="flex h-full flex-col items-center rounded-2xl border-card-border p-6 text-center shadow-sm shadow-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10">
      <div
        className="flex gap-1 text-warning"
        role="img"
        aria-label={`Rating ${rating} dari 5 bintang`}
      >
        {Array.from({ length: 5 }).map((_, index) =>
          index < rating ? (
            <HiStar key={index} className="size-4" aria-hidden="true" />
          ) : (
            <HiOutlineStar key={index} className="size-4" aria-hidden="true" />
          ),
        )}
      </div>

      <p className="mt-4 text-pretty text-sm leading-6 text-foreground/80 italic">
        &ldquo;{quote}&rdquo;
      </p>

      <div className="mt-6 flex flex-col items-center gap-2">
        <Image
          src={avatar}
          alt={`Foto ${name}`}
          width={44}
          height={44}
          unoptimized
          className="size-11 shrink-0 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-semibold text-foreground">{name}</p>
          <p className="text-xs tracking-wide text-muted-foreground uppercase">
            {location}
          </p>
        </div>
      </div>
    </Card>
  );
}
