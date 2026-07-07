import {
  ArrowUpRight,
  BadgeDollarSign,
  Boxes,
  CreditCard,
  PackageCheck,
  ShoppingBag,
  Star,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { requireSession } from "@/lib/auth/session";

const salesTrend = [36, 52, 44, 68, 58, 84, 76, 96, 88, 112, 104, 132];
const topProducts = [
  { name: "Luna Knit Sweater", sold: 428, revenue: "$18,420", color: "bg-blue-500" },
  { name: "Aero Daily Backpack", sold: 316, revenue: "$14,860", color: "bg-sky-500" },
  { name: "Nordic Desk Lamp", sold: 274, revenue: "$10,970", color: "bg-teal-500" },
];
const recentOrders = [
  { id: "ORD-1048", customer: "Maya Putri", status: "Paid", amount: "$248.00" },
  { id: "ORD-1047", customer: "Noah Smith", status: "Shipped", amount: "$129.40" },
  { id: "ORD-1046", customer: "Ari Wibowo", status: "Pending", amount: "$84.20" },
  { id: "ORD-1045", customer: "Lea Tan", status: "Paid", amount: "$412.90" },
];
const inventoryAlerts: {
  name: string;
  detail: string;
  icon: LucideIcon;
}[] = [
  { name: "Everyday Tote", detail: "Only 8 left", icon: PackageCheck },
  { name: "Ceramic Mug Set", detail: "Reorder today", icon: CreditCard },
  { name: "Canvas Sneaker", detail: "Backorder risk", icon: Star },
];

export default async function DashboardPage() {
  const session = await requireSession();

  return (
    <div className="mx-auto max-w-[1320px] space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Net Revenue" value="$84.2k" detail="+18.4% vs last month" icon={BadgeDollarSign} />
        <StatCard title="Orders" value="1,284" detail="342 waiting fulfillment" icon={ShoppingBag} />
        <StatCard title="Customers" value="24.8k" detail="+1,204 new buyers" icon={UsersRound} />
        <StatCard title="Products" value="486" detail="18 low stock items" icon={Boxes} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_.65fr]">
        <MetricCard title="Sales Performance">
          <div className="mt-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-3xl font-semibold tracking-tight">$128,460</p>
              <p className="mt-1 text-sm text-neutral-500">Gross sales this quarter</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
              <ArrowUpRight className="size-4" aria-hidden="true" />
              24.8%
            </span>
          </div>
          <div className="mt-6 flex h-44 items-end gap-3 border-b border-dashed border-neutral-200 pb-3">
            {salesTrend.map((value, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <span
                  className="w-full rounded-t-xl bg-blue-500/85"
                  style={{ height: `${value}px` }}
                />
                <span className="text-[11px] text-neutral-400">
                  {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][index]}
                </span>
              </div>
            ))}
          </div>
        </MetricCard>

        <MetricCard title="Channel Split">
          <div className="mt-5 grid place-items-center">
            <div className="relative grid size-40 place-items-center rounded-full bg-[conic-gradient(#2563eb_0_58%,#14b8a6_58%_82%,#e5e7eb_82%_100%)]">
              <div className="grid size-24 place-items-center rounded-full bg-white text-center">
                <span>
                  <span className="block text-2xl font-semibold">58%</span>
                  <span className="text-xs text-neutral-500">Online</span>
                </span>
              </div>
            </div>
          </div>
          <div className="mt-5 space-y-3 text-sm">
            {[
              ["Online store", "58%", "bg-blue-500"],
              ["Marketplace", "24%", "bg-teal-500"],
              ["Retail POS", "18%", "bg-neutral-300"],
            ].map(([label, value, color]) => (
              <div key={label} className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-neutral-600">
                  <span className={`size-2.5 rounded-full ${color}`} />
                  {label}
                </span>
                <span className="font-semibold text-neutral-950">{value}</span>
              </div>
            ))}
          </div>
        </MetricCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[.85fr_1fr_.85fr]">
        <MetricCard title="Top Products">
          <div className="mt-4 space-y-3">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50/80 p-3">
                <span className={`grid size-10 place-items-center rounded-xl text-sm font-semibold text-white ${product.color}`}>
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-neutral-950">{product.name}</p>
                  <p className="text-xs text-neutral-500">{product.sold} sold</p>
                </div>
                <p className="font-semibold text-neutral-950">{product.revenue}</p>
              </div>
            ))}
          </div>
        </MetricCard>

        <MetricCard title="Recent Orders">
          <div className="mt-4 divide-y divide-neutral-200 overflow-hidden rounded-xl border border-neutral-200">
            {recentOrders.map((order) => (
              <div key={order.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-3 text-sm">
                <div>
                  <p className="font-semibold text-neutral-950">{order.id}</p>
                  <p className="text-xs text-neutral-500">{order.customer}</p>
                </div>
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                  {order.status}
                </span>
                <p className="font-semibold text-neutral-950">{order.amount}</p>
              </div>
            ))}
          </div>
        </MetricCard>

        <MetricCard title="Inventory Alerts">
          <div className="mt-4 space-y-3">
            {inventoryAlerts.map(({ name, detail, icon: Icon }) => (
              <div key={name} className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50/70 p-3">
                <span className="grid size-10 place-items-center rounded-xl bg-white text-amber-600">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-neutral-950">{name}</span>
                  <span className="text-xs text-neutral-500">{detail}</span>
                </span>
              </div>
            ))}
          </div>
        </MetricCard>
      </div>

      <p className="text-xs text-neutral-500">
        Logged in as {session.user.email}. Dummy e-commerce data for starter template.
      </p>
    </div>
  );
}

function MetricCard({
  title,
  className = "",
  children,
}: {
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={`relative rounded-xl border border-neutral-200/70 bg-white p-4 shadow-sm shadow-neutral-200/50 ${className}`}
    >
      <h2 className="text-lg font-semibold tracking-tight text-neutral-950">{title}</h2>
      {children}
    </section>
  );
}
