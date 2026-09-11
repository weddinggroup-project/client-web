export type Package = {
  id: string;
  name: string;
  price: number;
  isPopular?: boolean;
  features: string[];
};

export const packages: Package[] = [
  {
    id: "promise",
    name: "Promise",
    price: 220_000,
    features: [
      "Dashboard Wedding Planner",
      "Budget Tracker",
      "Manajemen Guest List",
      "To do List checklist",
    ],
  },
  {
    id: "journey",
    name: "Journey",
    price: 350_000,
    isPopular: true,
    features: [
      "Dashboard Wedding Planner",
      "Budget Tracker",
      "Manajemen Guest List",
      "To do List checklist",
      "AI Assistant",
      "Reminder otomatis",
    ],
  },
  {
    id: "forever",
    name: "Forever",
    price: 690_000,
    features: [
      "Dashboard Wedding Planner",
      "Budget Tracker",
      "Manajemen Guest List",
      "To do List checklist",
      "AI Assistant",
      "Reminder otomatis",
      "Personal Bride Assistant",
    ],
  },
];

export type InvitationTemplate = {
  id: string;
  name: string;
  tagline: string;
  colors: [string, string];
};

export const invitationTemplates: InvitationTemplate[] = [
  {
    id: "blush-elegance",
    name: "Blush Elegance",
    tagline: "Minimalis & Anggun",
    colors: ["#f6e4e8", "#a97078"],
  },
  {
    id: "emerald-gold",
    name: "Emerald Gold",
    tagline: "Klasik & Mewah",
    colors: ["#1f3d33", "#c9a86a"],
  },
  {
    id: "rustic-botanical",
    name: "Rustic Botanical",
    tagline: "Organik & Natural",
    colors: ["#eee7da", "#6b3f45"],
  },
];

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
