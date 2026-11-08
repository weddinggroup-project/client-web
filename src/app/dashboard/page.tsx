import Link from "next/link";
import { redirect } from "next/navigation";
import { btn } from "@/components/dash/primitives";
import { apiServer, requireSession } from "@/lib/vowly/server";
import { formatDate } from "@/lib/vowly/format";
import type { Invitation } from "@/lib/vowly/types";

export const metadata = { title: "Proyek Saya" };

export default async function DashboardIndex() {
  const user = await requireSession("/dashboard");
  const result = await apiServer<Invitation[]>("/invitations", { query: { limit: 50 } });
  if (!result.ok) throw new Error(result.message);

  const projects = result.data;
  // An admin without any wedding project belongs in the admin area, not an empty planner.
  if (user.role === "admin" && projects.length === 0) redirect("/admin");
  if (projects.length === 1 && projects[0]) redirect(`/dashboard/${projects[0].id}`);

  return (
    <main className="mx-auto min-h-screen max-w-3xl bg-cream px-4 py-12 font-dash text-ink">
      <h1 className="font-serif text-3xl font-semibold text-accent">Halo, {user.name}</h1>
      <p className="mt-1 text-sm text-ink-soft">Pilih proyek pernikahan yang ingin dikelola.</p>

      {projects.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-gold/50 bg-white p-8 text-center">
          <p className="font-semibold">Belum ada proyek pernikahan</p>
          <p className="mt-1 text-sm text-ink-soft">Buat proyek dan pilih paket untuk membuka dashboard Wedding Planner.</p>
          <Link href="/undangan-digital" className={`${btn.primary} mt-5`}>
            Mulai pesan paket
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {projects.map((project) => (
            <li key={project.id}>
              <Link
                href={`/dashboard/${project.id}`}
                className="flex items-center justify-between rounded-xl border border-gold/50 bg-white p-4 transition hover:bg-blush/30"
              >
                <span>
                  <span className="block font-semibold">{project.title}</span>
                  <span className="block text-xs text-ink-soft">{formatDate(project.event_date)}</span>
                </span>
                <span className="text-xs text-ink-soft">{project.is_owner ? "Pemilik" : "Kolaborator"}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
