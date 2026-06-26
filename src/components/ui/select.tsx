"use client";

import ReactSelect, {
  type GroupBase,
  type Props as ReactSelectProps,
} from "react-select";

export type SelectOption = {
  label: string;
  value: string;
};

export function Select<
  Option = SelectOption,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(props: ReactSelectProps<Option, IsMulti, Group>) {
  return (
    <ReactSelect
      unstyled
      classNames={{
        control: ({ isFocused }) =>
          `min-h-11 rounded-xl border bg-white px-1 text-sm transition ${
            isFocused
              ? "border-blue-500 ring-3 ring-blue-100"
              : "border-slate-300"
          }`,
        valueContainer: () => "gap-1 px-2",
        placeholder: () => "text-slate-400",
        singleValue: () => "text-slate-950",
        input: () => "text-slate-950",
        indicatorSeparator: () => "bg-slate-200",
        dropdownIndicator: () => "px-2 text-slate-500 hover:text-slate-800",
        menu: () =>
          "z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-xl",
        option: ({ isFocused, isSelected }) =>
          `cursor-pointer rounded-lg px-3 py-2 text-sm ${
            isSelected
              ? "bg-blue-600 text-white"
              : isFocused
                ? "bg-blue-50 text-blue-950"
                : "text-slate-700"
          }`,
      }}
      {...props}
    />
  );
}
