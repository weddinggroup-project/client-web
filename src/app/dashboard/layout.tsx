import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { requireSession } from "@/lib/auth/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();

  return (
    <div className="flex min-h-screen bg-[#f7f9fc] text-slate-950">
      <AppSidebar />
      <div className="min-w-0 flex-1">
        <AppHeader session={session} />
        <main className="px-4 py-5 sm:px-5 lg:px-6">{children}</main>
      </div>
    </div>
  );
}
