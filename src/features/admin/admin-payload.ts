import type { FormValues } from "@/components/dash/form-modal";
import { text } from "../dashboard/crud/payload";

/** One feature per line in the textarea → trimmed, non-empty array (the API allows up to 20, 200 chars each). */
export function parseFeatures(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Date input (YYYY-MM-DD) → RFC 3339 instant in UTC; empty → undefined. `end` uses the last second of the day. */
export function dateToInstant(date: string, edge: "start" | "end"): string | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return undefined;
  return `${date}T${edge === "start" ? "00:00:00" : "23:59:59"}Z`;
}

/** Password is required when creating a user; on update an empty value means "leave unchanged" (so it is omitted). */
export function userPayload(values: FormValues, mode: "create" | "update") {
  const password = text(values, "password");
  return {
    name: text(values, "name"),
    email: text(values, "email"),
    role: text(values, "role"),
    ...(mode === "create" || password !== "" ? { password } : {}),
  };
}

export function voucherPayload(values: FormValues) {
  const quota = text(values, "quota");
  const from = dateToInstant(text(values, "valid_from"), "start");
  const until = dateToInstant(text(values, "valid_until"), "end");
  return {
    code: text(values, "code").toUpperCase(),
    kind: text(values, "kind"),
    discount_type: text(values, "discount_type"),
    amount: Number(text(values, "amount").replace(/[.\s]/g, "")),
    ...(quota !== "" ? { quota: Number(quota) } : {}),
    ...(from ? { valid_from: from } : {}),
    ...(until ? { valid_until: until } : {}),
    is_active: values.is_active === true,
  };
}
