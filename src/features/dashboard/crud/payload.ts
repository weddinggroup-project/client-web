import type { FormValues } from "@/components/dash/form-modal";
import { parseRupiah } from "@/lib/vowly/format";

export const text = (values: FormValues, name: string): string => String(values[name] ?? "").trim();

/**
 * Optional text/date: on create an empty value is omitted; on update it is sent as "" so the API clears the field.
 */
export function optionalText(values: FormValues, name: string, mode: "create" | "update"): string | undefined {
  const value = text(values, name);
  return value === "" && mode === "create" ? undefined : value;
}

/** Whole rupiah from a money field; empty means 0. Invalid input is left as NaN->undefined so the server reports it. */
export function money(values: FormValues, name: string): number | undefined {
  const value = text(values, name);
  if (value === "") return 0;
  const parsed = parseRupiah(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export function integer(values: FormValues, name: string): number | undefined {
  const value = text(values, name);
  if (value === "") return undefined;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : undefined;
}

export function initialText(value: string | number | null | undefined): string {
  return value === null || value === undefined ? "" : String(value);
}
