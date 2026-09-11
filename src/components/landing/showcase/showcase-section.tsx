"use client";

import { useState } from "react";
import Image from "next/image";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { showcaseSlides } from "@/components/landing/landing-data";

export function ShowcaseSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = showcaseSlides[activeIndex] ?? showcaseSlides[0]!;

  function goToPrevious() {
    setActiveIndex((index) => (index === 0 ? showcaseSlides.length - 1 : index - 1));
  }

  function goToNext() {
    setActiveIndex((index) => (index === showcaseSlides.length - 1 ? 0 : index + 1));
  }

  return (
    <section className="bg-background py-20 sm:py-28">
      <Container>
        <h2 className="text-center font-serif text-2xl font-bold text-foreground sm:text-3xl">
          Beragam Fitur Yang Dapat Membantu Persiapan Kamu
        </h2>

        <div className="relative mx-auto mt-12 max-w-3xl">
          <div className="group relative aspect-video overflow-hidden rounded-2xl border border-card-border shadow-xl shadow-black/10">
            {showcaseSlides.map((slide, index) => (
              <Image
                key={slide.title}
                src={slide.image.src}
                alt={slide.image.alt}
                fill
                sizes="(min-width: 768px) 768px, 100vw"
                unoptimized
                className={cn(
                  "object-cover transition-[opacity,transform] duration-700 ease-in-out group-hover:scale-105",
                  index === activeIndex ? "opacity-100" : "opacity-0",
                )}
              />
            ))}

            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Fitur sebelumnya"
              className="absolute top-1/2 left-3 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-primary shadow-md backdrop-blur transition hover:bg-white"
            >
              <HiChevronLeft className="size-5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={goToNext}
              aria-label="Fitur berikutnya"
              className="absolute top-1/2 right-3 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-primary shadow-md backdrop-blur transition hover:bg-white"
            >
              <HiChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-8 text-center">
            <h3 className="font-serif text-2xl font-semibold text-accent">
              {activeSlide.title}
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-pretty text-sm leading-7 text-muted-foreground">
              {activeSlide.description}
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            {showcaseSlides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Lihat ${slide.title}`}
                aria-current={index === activeIndex}
                className={cn(
                  "h-2 rounded-full transition-all",
                  index === activeIndex
                    ? "w-6 bg-primary"
                    : "w-2 bg-border hover:bg-secondary-hover",
                )}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
