"use client";

import { useEffect, useRef, useState } from "react";
import { format, parseISO } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { HiOutlineCalendarDays } from "react-icons/hi2";
import { DayPicker } from "react-day-picker";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  authInputClassName,
  authLabelClassName,
} from "@/features/auth/components/auth-field";

type WizardDateFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function WizardDateField({
  id,
  label,
  value,
  onChange,
  placeholder = "Pilih tanggal",
}: WizardDateFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedDate = value ? parseISO(value) : undefined;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleOutsideClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative space-y-2">
      <Label htmlFor={id} className={authLabelClassName}>
        {label}
      </Label>

      <button
        type="button"
        id={id}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className={cn(
          authInputClassName,
          "flex w-full items-center justify-between text-left",
          !selectedDate && "text-muted-foreground/50",
        )}
      >
        {selectedDate
          ? format(selectedDate, "d MMMM yyyy", { locale: idLocale })
          : placeholder}
        <HiOutlineCalendarDays
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className="animate-[dropdown-in_0.15s_ease-out] absolute z-50 mt-2 rounded-xl border border-card-border bg-card p-3 shadow-xl shadow-black/5">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              onChange(date ? format(date, "yyyy-MM-dd") : "");
              setIsOpen(false);
            }}
            startMonth={new Date(2024, 0)}
            endMonth={new Date(2030, 11)}
            locale={idLocale}
            classNames={{
              month_caption:
                "flex items-center justify-center text-sm font-semibold text-foreground mb-2",
              nav: "absolute inset-x-0 top-0 flex items-center justify-between px-1",
              button_previous:
                "grid size-7 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground",
              button_next:
                "grid size-7 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground",
              chevron: "size-4 fill-current",
              weekday: "text-xs font-medium text-muted-foreground",
              day: "size-9 rounded-lg text-sm transition hover:bg-secondary hover:text-primary",
              selected:
                "rounded-lg bg-primary font-semibold text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              today: "font-semibold text-primary",
              outside: "text-muted-foreground/40",
              disabled:
                "cursor-not-allowed text-muted-foreground/30 hover:bg-transparent",
            }}
          />
        </div>
      )}
    </div>
  );
}
