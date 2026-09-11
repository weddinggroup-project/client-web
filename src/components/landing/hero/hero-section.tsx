"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  HiChevronDown,
  HiChevronLeft,
  HiChevronRight,
  HiOutlineSparkles,
} from "react-icons/hi2";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { heroSlides } from "@/components/landing/landing-data";

const AUTOPLAY_INTERVAL_MS = 6000;

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = heroSlides[activeIndex] ?? heroSlides[0]!;

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((index) => (index + 1) % heroSlides.length);
    }, AUTOPLAY_INTERVAL_MS);

    return () => clearInterval(timer);
  }, []);

  function goToPrevious() {
    setActiveIndex((index) => (index === 0 ? heroSlides.length - 1 : index - 1));
  }

  function goToNext() {
    setActiveIndex((index) => (index + 1) % heroSlides.length);
  }

  return (
    <section className="relative isolate flex min-h-[calc(100dvh-5rem)] items-end overflow-hidden">
      {heroSlides.map((slide, index) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          priority={index === 0}
          sizes="100vw"
          unoptimized
          className={cn(
            "object-cover transition-opacity duration-1000 ease-in-out",
            index === activeIndex ? "opacity-100" : "opacity-0",
          )}
        />
      ))}

      <div
        className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-black/10"
        aria-hidden="true"
      />

      <Container className="relative pb-16 sm:pb-20">
        <div key={activeIndex} className="max-w-xl animate-[hero-headline-in_0.7s_ease-out]">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-white uppercase backdrop-blur">
            <HiOutlineSparkles className="size-3.5" aria-hidden="true" />
            Wedding Planner Terpercaya
          </span>

          <h1 className="mt-5 font-serif text-4xl leading-[1.15] font-bold text-white sm:text-6xl">
            {activeSlide.headline}
          </h1>

          <p className="mt-5 max-w-md text-pretty text-base leading-7 text-white/85 sm:text-lg">
            Atur vendor, budget, dan tamu undangan dalam satu tempat — Vowly
            bikin persiapan pernikahanmu lebih tenang, tanpa ribet.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href="/sign-in" variant="rose" className="h-12 px-8">
              Mulai Rencanakan
            </ButtonLink>
            <ButtonLink href="#layanan" variant="outline-light" className="h-12 px-8">
              Lihat Layanan
            </ButtonLink>
          </div>
        </div>
      </Container>

      <button
        type="button"
        onClick={goToPrevious}
        aria-label="Slide sebelumnya"
        className="absolute top-1/2 left-3 z-10 -translate-y-1/2 p-2 text-white/80 transition hover:text-white sm:left-6"
      >
        <HiChevronLeft className="size-8" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={goToNext}
        aria-label="Slide berikutnya"
        className="absolute top-1/2 right-3 z-10 -translate-y-1/2 p-2 text-white/80 transition hover:text-white sm:right-6"
      >
        <HiChevronRight className="size-8" aria-hidden="true" />
      </button>

      <div className="absolute inset-x-0 bottom-14 z-10 flex items-center justify-center gap-2">
        {heroSlides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Lihat slide ${index + 1}`}
            aria-current={index === activeIndex}
            className={cn(
              "h-2 rounded-full transition-all",
              index === activeIndex ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80",
            )}
          />
        ))}
      </div>

      <a
        href="#konten"
        aria-label="Gulir ke bawah"
        className="absolute inset-x-0 bottom-4 z-10 mx-auto grid size-8 animate-bounce place-items-center text-white/70 transition hover:text-white"
      >
        <HiChevronDown className="size-6" aria-hidden="true" />
      </a>
    </section>
  );
}
