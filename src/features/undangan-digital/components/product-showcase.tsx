"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiChevronLeft, HiChevronRight, HiOutlineMapPin } from "react-icons/hi2";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { productShowcaseSlides } from "../undangan-digital-data";

export function ProductShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = productShowcaseSlides[activeIndex] ?? productShowcaseSlides[0]!;

  function goToPrevious() {
    setActiveIndex((index) =>
      index === 0 ? productShowcaseSlides.length - 1 : index - 1,
    );
  }

  function goToNext() {
    setActiveIndex((index) => (index + 1) % productShowcaseSlides.length);
  }

  return (
    <section className="bg-muted py-20 sm:py-24">
      <Container>
        <h2 className="text-center font-serif text-2xl font-bold text-foreground sm:text-3xl">
          Beragam Fitur Yang Dapat Membantu Persiapan Kamu
        </h2>

        <div className="mx-auto mt-12 flex max-w-3xl items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={goToPrevious}
            aria-label="Fitur sebelumnya"
            className="shrink-0 p-1 text-primary transition hover:text-primary-hover sm:p-2"
          >
            <HiChevronLeft className="size-6 sm:size-8" aria-hidden="true" />
          </button>

          <div className="flex min-w-0 flex-1 flex-col items-center gap-6 rounded-2xl border border-card-border bg-background px-5 py-8 text-center shadow-sm shadow-black/5 sm:flex-row sm:px-12 sm:text-left">
            <DeviceFrame slide={activeSlide} />

            <div className="max-w-xs">
              <h3 className="font-serif text-xl font-semibold text-accent">
                {activeSlide.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {activeSlide.description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={goToNext}
            aria-label="Fitur berikutnya"
            className="shrink-0 p-1 text-primary transition hover:text-primary-hover sm:p-2"
          >
            <HiChevronRight className="size-6 sm:size-8" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          {productShowcaseSlides.map((slide, index) => (
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

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Kamu bisa lihat dulu paket yang tersedia
          </p>
          <Link
            href="/undangan-digital/pesan"
            className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-primary px-8 text-xs font-semibold tracking-wide text-primary-foreground uppercase shadow-lg shadow-primary/20 transition hover:scale-[1.02] hover:bg-primary-hover active:scale-[0.98]"
          >
            Lihat Paket
          </Link>
        </div>
      </Container>
    </section>
  );
}

function DeviceFrame({
  slide,
}: {
  slide: (typeof productShowcaseSlides)[number];
}) {
  const isPhone = slide.frame === "phone";

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-[1.75rem] border-4 border-foreground/80 bg-foreground/5 shadow-inner",
        isPhone ? "h-44 w-24" : "h-40 w-32",
      )}
    >
      {slide.image ? (
        <Image
          src={slide.image.src}
          alt={slide.image.alt}
          fill
          unoptimized
          sizes="150px"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(160deg,#eef0e6_0%,#dfe6d8_100%)]">
          <div
            className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(107,63,69,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(107,63,69,0.15)_1px,transparent_1px)] [background-size:12px_12px]"
            aria-hidden="true"
          />
          <HiOutlineMapPin
            className="absolute top-1/2 left-1/2 size-7 -translate-x-1/2 -translate-y-1/2 text-primary"
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}
