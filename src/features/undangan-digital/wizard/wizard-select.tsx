"use client";

import ReactSelect, {
  type GroupBase,
  type Props as ReactSelectProps,
} from "react-select";
import { cn } from "@/lib/utils";

export type WizardSelectOption = {
  label: string;
  value: string;
};

export function WizardSelect<
  Option = WizardSelectOption,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(props: ReactSelectProps<Option, IsMulti, Group>) {
  return (
    <ReactSelect
      unstyled
      classNames={{
        control: ({ isFocused, isDisabled }) =>
          cn(
            "flex h-11 items-center rounded-none border-0 border-b bg-transparent px-0 text-sm transition",
            isDisabled && "cursor-not-allowed opacity-50",
            isFocused ? "border-primary" : "border-border",
          ),
        valueContainer: () => "flex-1 gap-1 px-0 py-0",
        placeholder: () => "text-muted-foreground/50",
        singleValue: () => "m-0 text-foreground",
        input: () => "m-0 p-0 text-foreground",
        indicatorSeparator: () => "hidden",
        indicatorsContainer: () => "shrink-0",
        dropdownIndicator: ({ selectProps }) =>
          cn(
            "px-1 text-muted-foreground transition-transform duration-200",
            selectProps.menuIsOpen && "rotate-180 text-primary",
          ),
        menu: () =>
          "animate-[dropdown-in_0.15s_ease-out] z-50 mt-2 overflow-hidden rounded-xl border border-card-border bg-card p-1.5 shadow-xl shadow-black/5",
        option: ({ isFocused, isSelected }) =>
          cn(
            "cursor-pointer rounded-lg px-3 py-2 text-sm transition",
            isSelected
              ? "bg-secondary font-medium text-primary"
              : isFocused
                ? "bg-muted text-foreground"
                : "text-foreground/80",
          ),
      }}
      {...props}
    />
  );
}
