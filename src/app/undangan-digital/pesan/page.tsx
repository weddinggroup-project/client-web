import { OrderWizard } from "@/features/undangan-digital/wizard/order-wizard";
import { requireSession } from "@/lib/vowly/server";

export const metadata = {
  title: "Pesan Undangan Digital",
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function PesanUndanganDigitalPage({ searchParams }: { searchParams: Promise<{ project?: string }> }) {
  const { project } = await searchParams;
  const resumeProjectId = project && UUID.test(project) ? project : undefined;
  await requireSession(resumeProjectId ? `/undangan-digital/pesan?project=${resumeProjectId}` : "/undangan-digital/pesan");
  return <OrderWizard resumeProjectId={resumeProjectId} />;
}
