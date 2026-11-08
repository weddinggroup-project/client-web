const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
const number = new Intl.NumberFormat("id-ID");

/** "Rp 450.000.000" */
export function formatRupiah(amount: number): string {
  return rupiah.format(amount).replace(/ /g, " ");
}

export function formatNumber(value: number): string {
  return number.format(value);
}

/** Compact amount for charts: 285.500.000 -> "Rp 285,5 jt". */
export function formatRupiahShort(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 1_000_000_000) return `Rp ${(amount / 1_000_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} M`;
  if (abs >= 1_000_000) return `Rp ${(amount / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} jt`;
  return formatRupiah(amount);
}

const dateLong = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const dateShort = new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });

/** "26 November 2026" from "2026-11-26" (a plain calendar date, no timezone shift). */
export function formatDate(date: string | null | undefined, style: "long" | "short" = "long"): string {
  if (!date) return "-";
  const parsed = new Date(`${date.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return "-";
  return (style === "long" ? dateLong : dateShort).format(parsed);
}

const relative = new Intl.RelativeTimeFormat("id-ID", { numeric: "auto" });

/** "2 jam yang lalu" style time for the activity timeline. */
export function formatRelative(iso: string, now: Date = new Date()): string {
  const diffSeconds = Math.round((new Date(iso).getTime() - now.getTime()) / 1000);
  const abs = Math.abs(diffSeconds);
  if (abs < 60) return "baru saja";
  if (abs < 3600) return relative.format(Math.round(diffSeconds / 60), "minute");
  if (abs < 86_400) return relative.format(Math.round(diffSeconds / 3600), "hour");
  return relative.format(Math.round(diffSeconds / 86_400), "day");
}

/** Two-letter initials for avatars. */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "")).toUpperCase() || "?";
}

/** Digits of an Indonesian number as typed by a user are kept for display; the API normalizes them. */
export function formatPhone(phone: string): string {
  return phone || "-";
}

/** Whole rupiah from a text input like "15.000.000" or "15000000". Returns NaN for anything else. */
export function parseRupiah(text: string): number {
  const digits = text.replace(/[.\s]/g, "").replace(/^Rp/i, "");
  if (digits === "") return Number.NaN;
  return /^\d+$/.test(digits) ? Number(digits) : Number.NaN;
}
