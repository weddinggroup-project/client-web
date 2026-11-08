import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/features/dashboard/dashboard-shell";
import { ProjectProvider } from "@/features/dashboard/project-context";
import { btn } from "@/components/dash/primitives";
import { StandaloneTopbar } from "@/components/dash/standalone-topbar";
import { apiServer, requireSession } from "@/lib/vowly/server";
import type { Home, Invitation } from "@/lib/vowly/types";

export const metadata = { title: "Dashboard" };

export default async function ProjectLayout({ children, params }: { children: ReactNode; params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const user = await requireSession(`/dashboard/${projectId}`);

  const project = await apiServer<Invitation>(`/invitations/${projectId}`);
  if (!project.ok) {
    if (project.status === 404 || project.status === 400) notFound();
    throw new Error(project.message);
  }

  // The Home endpoint doubles as the paid-order gate: 403 means the dashboard is still locked.
  const home = await apiServer<Home>(`/invitations/${projectId}/home`);
  if (!home.ok && home.status === 403) {
    return (
      <div className="min-h-screen bg-cream font-dash text-ink">
      <StandaloneTopbar name={user.name} isAdmin={user.role === "admin"} />
      <main className="grid min-h-[calc(100vh-3.5rem)] place-items-center px-4">
        <div className="max-w-md rounded-2xl border border-gold/50 bg-white p-8 text-center shadow-sm">
          <h1 className="font-serif text-2xl font-semibold text-accent">Dashboard belum dibuka</h1>
          <p className="mt-3 text-sm text-ink-soft">
            Dashboard untuk &quot;{project.data.title}&quot; terbuka setelah pembayaran pesanan selesai. Lanjutkan pembayaran untuk mulai merencanakan.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Link href={`/undangan-digital/pesan?project=${project.data.id}`} className={btn.primary}>
              Lanjutkan pembayaran
            </Link>
            <Link href="/dashboard" className={btn.secondary}>
              Semua proyek
            </Link>
          </div>
        </div>
      </main>
      </div>
    );
  }
  if (!home.ok) throw new Error(home.message);

  return (
    <ProjectProvider value={{ project: project.data, user, daysUntil: home.data.days_until_event }}>
      <DashboardShell>{children}</DashboardShell>
    </ProjectProvider>
  );
}
