"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { HiChevronDown, HiOutlineCalendarDays } from "react-icons/hi2";
import ReactSelect, {
  components as selectComponents,
  type DropdownIndicatorProps,
  type SingleValue,
} from "react-select";
import { DayPicker, type DropdownProps, type Matcher } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DatePickerProps = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: Matcher | Matcher[];
};

export function DatePicker({
  value,
  onChange,
  placeholder = "Pilih tanggal",
  open: controlledOpen,
  onOpenChange,
  disabled,
}: DatePickerProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const pickerRef = useRef<HTMLDivElement>(null);

  const updateOpen = useCallback((value: boolean) => {
    setUncontrolledOpen(value);
    onOpenChange?.(value);
  }, [onOpenChange]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!pickerRef.current?.contains(event.target as Node)) {
        updateOpen(false);
      }
    }

    if (open) {
      document.addEventListener("pointerdown", handlePointerDown);
    }

    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open, updateOpen]);

  return (
    <div ref={pickerRef} className="relative">
      <Button
        type="button"
        variant="outline"
        className={cn(
          "w-full justify-start rounded-xl px-3 font-normal",
          !value && "text-slate-400",
        )}
        aria-expanded={open}
        onClick={() => updateOpen(!open)}
      >
        <HiOutlineCalendarDays className="size-4" aria-hidden="true" />
        {value ? format(value, "PPP", { locale: idLocale }) : placeholder}
      </Button>
      {open ? (
        <div className="absolute left-0 top-full z-50 mt-2 w-[min(340px,calc(100vw-2rem))] rounded-xl border border-neutral-200 bg-white p-3 shadow-xl shadow-neutral-200/80">
          <DayPicker
            mode="single"
            captionLayout="dropdown"
            startMonth={new Date(2020, 0)}
            endMonth={new Date(2032, 11)}
            className={cn(
              "text-sm text-neutral-700",
              "[&_.rdp-root]:m-0",
              "[&_.rdp-months]:max-w-full",
              "[&_.rdp-month]:w-full",
              "[&_.rdp-month_grid]:w-full",
              "[&_.rdp-dropdown]:appearance-none",
              "[&_.rdp-dropdown]:bg-[linear-gradient(45deg,transparent_50%,#64748b_50%),linear-gradient(135deg,#64748b_50%,transparent_50%)]",
              "[&_.rdp-dropdown]:bg-[position:calc(100%-15px)_50%,calc(100%-10px)_50%]",
              "[&_.rdp-dropdown]:bg-[size:5px_5px,5px_5px]",
              "[&_.rdp-dropdown]:bg-no-repeat",
            )}
            classNames={{
              month_caption: "mb-3",
              dropdowns: "grid w-full grid-cols-2 gap-2",
              dropdown_root: "relative",
              caption_label: "sr-only",
              dropdown:
                "h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 pr-8 text-sm font-semibold text-neutral-800 shadow-sm outline-none transition hover:border-neutral-300 hover:bg-white focus:border-blue-400 focus:ring-3 focus:ring-blue-100",
              chevron: "hidden",
              weekday: "px-2 py-2 text-xs font-semibold text-neutral-400",
              day: "size-9 rounded-lg text-sm transition hover:bg-blue-50 hover:text-blue-700",
              selected: "rounded-lg bg-blue-600 font-semibold text-white hover:bg-blue-600 hover:text-white",
              today: "font-semibold text-blue-700",
              disabled: "cursor-not-allowed text-neutral-300 hover:bg-transparent hover:text-neutral-300",
            }}
            selected={value}
            disabled={disabled}
            components={{
              Dropdown: DatePickerDropdown,
            }}
            locale={idLocale}
            onSelect={(date) => {
              onChange?.(date);
              if (date) updateOpen(false);
            }}
          />
        </div>
      ) : null}
    </div>
  );
}

type DatePickerDropdownOption = {
  value: number;
  label: string;
  isDisabled?: boolean;
};

function DatePickerDropdown({
  options,
  value,
  onChange,
  disabled,
  "aria-label": ariaLabel,
}: DropdownProps) {
  const selectOptions: DatePickerDropdownOption[] =
    options?.map((option) => ({
      value: option.value,
      label: option.label,
      isDisabled: option.disabled,
    })) ?? [];
  const selectedOption =
    selectOptions.find((option) => option.value === Number(value)) ?? null;

  return (
    <ReactSelect<DatePickerDropdownOption, false>
      unstyled
      aria-label={ariaLabel}
      isDisabled={disabled}
      isSearchable={false}
      options={selectOptions}
      value={selectedOption}
      components={{
        DropdownIndicator: DatePickerDropdownIndicator,
        IndicatorSeparator: null,
      }}
      onChange={(option: SingleValue<DatePickerDropdownOption>) => {
        if (!option) return;

        onChange?.({
          target: { value: String(option.value) },
        } as React.ChangeEvent<HTMLSelectElement>);
      }}
      classNames={{
        control: ({ isFocused, menuIsOpen }) =>
          cn(
            "min-h-10 rounded-lg border bg-white text-sm font-semibold text-neutral-800 shadow-sm transition",
            isFocused || menuIsOpen
              ? "border-blue-400 ring-3 ring-blue-100"
              : "border-neutral-200 hover:border-neutral-300",
          ),
        valueContainer: () => "px-3",
        singleValue: () => "text-neutral-900",
        dropdownIndicator: ({ selectProps }) =>
          cn(
            "px-3 text-neutral-500 transition-transform duration-200",
            selectProps.menuIsOpen && "rotate-180 text-blue-600",
          ),
        menu: () =>
          "z-[60] mt-2 overflow-hidden rounded-xl border border-neutral-200 bg-white p-1.5 shadow-xl shadow-neutral-200/80",
        option: ({ isFocused, isSelected }) =>
          cn(
            "cursor-pointer rounded-lg px-3 py-2 text-sm font-medium",
            isSelected
              ? "bg-blue-50 text-blue-700"
              : isFocused
                ? "bg-neutral-100 text-neutral-950"
                : "text-neutral-600",
          ),
      }}
    />
  );
}

function DatePickerDropdownIndicator(
  props: DropdownIndicatorProps<DatePickerDropdownOption, false>,
) {
  return (
    <selectComponents.DropdownIndicator {...props}>
      <HiChevronDown className="size-4" aria-hidden="true" />
    </selectComponents.DropdownIndicator>
  );
}
