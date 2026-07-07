import { requireSession } from "@/lib/auth/session";
import { OrdersDashboard } from "@/features/orders/components/orders-dashboard";

export default async function OrdersPage() {
  await requireSession();

  return <OrdersDashboard />;
}
