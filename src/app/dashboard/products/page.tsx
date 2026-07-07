import { requireSession } from "@/lib/auth/session";
import { ProductsDashboard } from "@/features/products/components/products-dashboard";

export default async function ProductsPage() {
  await requireSession();

  return <ProductsDashboard />;
}
