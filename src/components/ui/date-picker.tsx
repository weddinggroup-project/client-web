"use client";

import { useState } from "react";
import { format } from "date-fns";
import { enUS, id as idLocale } from "date-fns/locale";
import { HiOutlineCalendarDays } from "react-icons/hi2";
import { DayPicker } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DatePickerProps = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  locale?: "id" | "en";
  placeholder?: string;
};

export function DatePicker({
  value,
  onChange,
  locale = "id",
  placeholder = "Pilih tanggal",
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        className={cn(
          "w-full justify-start rounded-xl px-3 font-normal",
          !value && "text-slate-400",
        )}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <HiOutlineCalendarDays className="size-4" aria-hidden="true" />
        {value
          ? format(value, "PPP", { locale: locale === "id" ? idLocale : enUS })
          : placeholder}
      </Button>
      {open ? (
        <div className="absolute left-0 top-full z-50 mt-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
          <DayPicker
            mode="single"
            selected={value}
            locale={locale === "id" ? idLocale : enUS}
            onSelect={(date) => {
              onChange?.(date);
              if (date) setOpen(false);
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
