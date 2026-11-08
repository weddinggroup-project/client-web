/** Package code highlighted as "Terpopuler". UI-only marker: the API has no such flag. */
export const POPULAR_PACKAGE_CODE = "journey";

/** Card decoration per template slug. Names and ids come from the API; colors/taglines are presentation only. */
export type TemplateStyle = { tagline: string; colors: [string, string] };

export const templateStyles: Record<string, TemplateStyle> = {
  "blush-elegance": { tagline: "Minimalis & Anggun", colors: ["#f6e4e8", "#a97078"] },
  "emerald-gold": { tagline: "Klasik & Mewah", colors: ["#1f3d33", "#c9a86a"] },
  "rustic-botanical": { tagline: "Organik & Natural", colors: ["#eee7da", "#6b3f45"] },
};

export const defaultTemplateStyle: TemplateStyle = { tagline: "Desain undangan", colors: ["#f3ede1", "#6b3f45"] };

export const preparationStages = [
  { value: "lamaran", label: "Tahap Lamaran" },
  { value: "persiapan", label: "Tahap Persiapan" },
  { value: "final", label: "Tahap Final" },
];

export const collaboratorRoles = [
  { value: "pasangan", label: "Pasangan" },
  { value: "partner", label: "Partner" },
];

export const collaboratorAccessOptions = [
  "Administrasi",
  "Manajemen Vendor",
  "Sourvenir & Barang",
  "Budget & Anggaran",
  "Tamu Undangan",
  "To-do List Ibu/Ayah",
];

export const paymentMethods: { label: string; dotColor: string }[] = [
  { label: "BCA", dotColor: "#1e5fb4" },
  { label: "Mandiri", dotColor: "#f2c200" },
  { label: "BRI", dotColor: "#00529c" },
  { label: "BNI", dotColor: "#f37021" },
  { label: "BSI", dotColor: "#128a5e" },
  { label: "GoPay", dotColor: "#00aed6" },
  { label: "DANA", dotColor: "#118ee9" },
  { label: "QRIS", dotColor: "#6b3f45" },
];

export function formatRupiah(amount: number) {
  return `Rp. ${amount.toLocaleString("id-ID")}`;
}
