import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminShell } from "@/features/admin/admin-shell";
import { requireSession } from "@/lib/vowly/server";

export const metadata = { title: { default: "Admin", template: "%s • Admin Vowly" } };

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireSession("/admin");
  // Normal users never see the admin area (the API also rejects every admin call for them).
  if (user.role !== "admin") redirect("/dashboard");
  return <AdminShell user={user}>{children}</AdminShell>;
}
