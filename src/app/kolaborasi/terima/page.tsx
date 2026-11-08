import { AcceptForm } from "@/features/collaboration/accept-form";
import { StandaloneTopbar } from "@/components/dash/standalone-topbar";
import { requireSession } from "@/lib/vowly/server";

export const metadata = { title: "Terima Undangan Kolaborasi" };

export default async function AcceptCollaborationPage() {
  // The token is pasted into the form, never carried in the URL, so it stays out of history and logs.
  const user = await requireSession("/kolaborasi/terima");
  return (
    <>
    <StandaloneTopbar name={user.name} isAdmin={user.role === "admin"} />
    <main className="mx-auto grid min-h-[calc(100vh-3.5rem)] max-w-md place-items-center px-6">
      <div className="w-full text-center">
        <h1 className="font-serif text-2xl font-bold text-foreground">Terima undangan kolaborasi</h1>
        <p className="mt-2 text-sm text-muted-foreground">Masukkan token yang dibagikan pemilik proyek untuk bergabung.</p>
        <AcceptForm initialToken="" email={user.email} />
      </div>
    </main>
    </>
  );
}
