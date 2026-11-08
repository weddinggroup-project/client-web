import type { Invitation } from "@/lib/vowly/types";

export type PermissionLevel = "read" | "write";

/**
 * Wizard access labels (Figma) → API modules. Labels without a dedicated API module map to the closest one;
 * "read" is added where a module is useless without seeing another (vendors need the rundown).
 */
const accessModules: Record<string, Record<string, PermissionLevel>> = {
  Administrasi: { documents: "write", profile: "write" },
  "Manajemen Vendor": { vendors: "write", sessions: "read" },
  "Sourvenir & Barang": { checklist: "write" },
  "Budget & Anggaran": { budget: "write" },
  "Tamu Undangan": { guests: "write", deliveries: "write" },
  "To-do List Ibu/Ayah": { checklist: "write" },
};

/** Permission map for the invite request, or undefined to let the API apply the role default. */
export function accessToPermissions(labels: string[]): Record<string, PermissionLevel> | undefined {
  const result: Record<string, PermissionLevel> = {};
  for (const label of labels) {
    for (const [module, level] of Object.entries(accessModules[label] ?? {})) {
      // write wins over read when two labels touch the same module.
      if (result[module] !== "write") result[module] = level;
    }
  }
  return Object.keys(result).length > 0 ? result : undefined;
}

/** The wizard's "Partner" role is the API's `panitia_vendor`. */
export function roleToApi(role: string): "pasangan" | "panitia_vendor" {
  return role === "pasangan" ? "pasangan" : "panitia_vendor";
}

export type AddressParts = { address: string; village: string; district: string; city: string; province: string; postalCode: string };

/** The API stores one address string; the wizard collects its parts, so they are joined (max 500 chars). */
export function composeAddress(parts: AddressParts): string {
  const segments = [
    parts.address.trim(),
    parts.village && `Kel. ${parts.village}`,
    parts.district && `Kec. ${parts.district}`,
    parts.city,
    [parts.province, parts.postalCode].filter(Boolean).join(" "),
  ].filter(Boolean);
  return segments.join(", ").slice(0, 500);
}

export function subdomainError(subdomain: string): string | undefined {
  const value = subdomain.trim();
  if (value.length < 6 || value.length > 18) return "URL undangan harus 6 sampai 18 karakter.";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) return "URL undangan hanya boleh huruf kecil, angka, dan tanda hubung.";
  return undefined;
}

export function invitationBody(details: { groomName: string; brideName: string; invitationTitle: string; eventDate: string; preparationStage: string }) {
  return {
    groom_name: details.groomName.trim(),
    bride_name: details.brideName.trim(),
    title: details.invitationTitle.trim(),
    event_date: details.eventDate,
    stage: details.preparationStage,
  };
}

/** Wizard step to resume at for an existing, unpaid project. */
export function resumeStep(project: Pick<Invitation, "template_id" | "venue">): "location" | "template" | "summary" {
  if (project.template_id) return "summary";
  return project.venue ? "template" : "location";
}
