import type { IconType } from "react-icons";
import {
  HiOutlineBuildingStorefront,
  HiOutlineClipboardDocumentCheck,
  HiOutlineEnvelope,
  HiOutlineFolder,
  HiOutlineHeart,
  HiOutlineHome,
  HiOutlineSparkles,
  HiOutlineUserCircle,
  HiOutlineUserGroup,
  HiOutlineWallet,
} from "react-icons/hi2";

export type NavItem = { slug: string; label: string; sub: string; icon: IconType };

/** Sidebar structure from the Figma "Dashboard Revisi": MAIN MENU, ASSISTANT, ACCOUNT. */
export const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: "Main Menu",
    items: [
      { slug: "", label: "Home", sub: "Main Dashboard", icon: HiOutlineHome },
      { slug: "persiapan", label: "Persiapan", sub: "Timeline & Milestone", icon: HiOutlineHeart },
      { slug: "budget", label: "Budget", sub: "Anggaran & Pengeluaran", icon: HiOutlineWallet },
      { slug: "tamu", label: "Guest List", sub: "Tamu & RSVP", icon: HiOutlineUserGroup },
      { slug: "checklist", label: "Checklist", sub: "Daftar Tugas", icon: HiOutlineClipboardDocumentCheck },
      { slug: "dokumen", label: "Dokumen", sub: "KUA & Kontrak Penting", icon: HiOutlineFolder },
      { slug: "vendor", label: "Vendor", sub: "Direktori & Status", icon: HiOutlineBuildingStorefront },
      { slug: "undangan", label: "Undangan", sub: "Template & Status Kirim", icon: HiOutlineEnvelope },
    ],
  },
  { title: "Assistant", items: [{ slug: "ai-agent", label: "AI Assistant", sub: "Konsultasi & Ide Konsep", icon: HiOutlineSparkles }] },
  { title: "Account", items: [{ slug: "profil", label: "Profile", sub: "Biodata & Pengaturan", icon: HiOutlineUserCircle }] },
];

export function projectHref(projectId: string, slug: string): string {
  return slug ? `/dashboard/${projectId}/${slug}` : `/dashboard/${projectId}`;
}

/** Whether the nav item for `slug` is the current page. Home matches only the exact project root. */
export function isActive(pathname: string, projectId: string, slug: string): boolean {
  const href = projectHref(projectId, slug);
  return slug ? pathname === href || pathname.startsWith(`${href}/`) : pathname === href;
}

/** Text of the header pill: "Dimas & Sarah • 128 Hari Menuju Akad & Resepsi". */
export function countdownLabel(title: string, daysUntil: number | null): string {
  if (daysUntil === null) return title;
  if (daysUntil > 0) return `${title} • ${daysUntil} Hari Menuju Akad & Resepsi`;
  if (daysUntil === 0) return `${title} • Hari ini hari bahagia`;
  return `${title} • Acara telah berlalu`;
}
