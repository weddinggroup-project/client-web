"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownUp,
  ChevronLeft,
  ChevronRight,
  Clock3,
  PackageCheck,
  Search,
  SlidersHorizontal,
  Truck,
} from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { DatePicker } from "@/components/ui/date-picker";
import { PageHeader } from "@/components/ui/page-header";
import { Select, type SelectOption } from "@/components/ui/select";
import { StatCard } from "@/components/ui/stat-card";
import { Toast } from "@/components/ui/toast";

type OrderStatus = "Pending" | "In transit" | "Delivered" | "Delayed";

type Order = {
  id: string;
  customer: string;
  route: string;
  status: OrderStatus;
  courier: string;
  items: number;
  weight: string;
  eta: string;
  value: string;
  createdAt: Date;
};

const orders: Order[] = [
  {
    id: "ORD-1048",
    customer: "White Bengala Box",
    route: "Los Angeles -> San Diego",
    status: "In transit",
    courier: "Darrell Steward",
    items: 240,
    weight: "44 lbs",
    eta: "Today, 14:30",
    value: "$8,240",
    createdAt: new Date("2026-07-08"),
  },
  {
    id: "ORD-1047",
    customer: "Northstar Retail",
    route: "Phoenix -> Denver",
    status: "Delivered",
    courier: "Leslie Alexander",
    items: 128,
    weight: "21 lbs",
    eta: "Jul 06, 09:10",
    value: "$4,910",
    createdAt: new Date("2026-07-06"),
  },
  {
    id: "ORD-1046",
    customer: "Urban Mono",
    route: "Seattle -> Portland",
    status: "Pending",
    courier: "Jacob Jones",
    items: 86,
    weight: "18 lbs",
    eta: "Tomorrow",
    value: "$2,620",
    createdAt: new Date("2026-07-09"),
  },
  {
    id: "ORD-1045",
    customer: "Maverick Supply",
    route: "Austin -> Dallas",
    status: "Delayed",
    courier: "Courtney Henry",
    items: 164,
    weight: "32 lbs",
    eta: "Jul 07, 16:20",
    value: "$5,780",
    createdAt: new Date("2026-07-07"),
  },
  {
    id: "ORD-1044",
    customer: "Luma Market",
    route: "Miami -> Orlando",
    status: "In transit",
    courier: "Robert Fox",
    items: 92,
    weight: "17 lbs",
    eta: "Today, 18:00",
    value: "$3,420",
    createdAt: new Date("2026-07-08"),
  },
  {
    id: "ORD-1043",
    customer: "Alta Hardware",
    route: "Chicago -> Madison",
    status: "Delivered",
    courier: "Jenny Wilson",
    items: 310,
    weight: "58 lbs",
    eta: "Jul 05, 11:40",
    value: "$11,300",
    createdAt: new Date("2026-07-05"),
  },
  {
    id: "ORD-1042",
    customer: "Verde Studio",
    route: "Boston -> New York",
    status: "Pending",
    courier: "Guy Hawkins",
    items: 73,
    weight: "12 lbs",
    eta: "Jul 08, 08:20",
    value: "$1,920",
    createdAt: new Date("2026-07-08"),
  },
  {
    id: "ORD-1041",
    customer: "Keystone Labs",
    route: "Las Vegas -> Reno",
    status: "In transit",
    courier: "Theresa Webb",
    items: 215,
    weight: "39 lbs",
    eta: "Today, 20:45",
    value: "$7,860",
    createdAt: new Date("2026-07-08"),
  },
];

const statusOptions: SelectOption[] = [
  { label: "All orders", value: "all" },
  { label: "Pending", value: "Pending" },
  { label: "In transit", value: "In transit" },
  { label: "Delivered", value: "Delivered" },
  { label: "Delayed", value: "Delayed" },
];

const pageSize = 5;

export function OrdersDashboard() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<SelectOption>(statusOptions[0]!);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [openDateFilter, setOpenDateFilter] = useState<"start" | "end" | null>(null);
  const [alert, setAlert] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus = status.value === "all" || order.status === status.value;
      const matchesSearch =
        !normalizedQuery ||
        [order.id, order.customer, order.route, order.courier]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesDateRange = isWithinDateRange(order.createdAt, startDate, endDate);

      return matchesStatus && matchesSearch && matchesDateRange;
    });
  }, [endDate, query, startDate, status]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const visibleOrders = filteredOrders.slice((page - 1) * pageSize, page * pageSize);
  const hasActiveFilters =
    query.trim() !== "" || status.value !== "all" || Boolean(startDate) || Boolean(endDate);
  const columns: DataTableColumn<Order>[] = [
    {
      key: "order",
      header: "Order",
      cell: (order) => (
        <div>
          <p className="font-semibold text-neutral-950">{order.id}</p>
          <p className="mt-0.5 text-xs text-neutral-500">
            {order.customer} • {order.items} items
          </p>
        </div>
      ),
    },
    {
      key: "route",
      header: "Route",
      cell: (order) => <p className="text-neutral-700">{order.route}</p>,
    },
    {
      key: "courier",
      header: "Courier",
      cell: (order) => <p className="text-neutral-600">{order.courier}</p>,
    },
    {
      key: "status",
      header: "Status",
      cell: (order) => <StatusBadge status={order.status} />,
    },
    {
      key: "eta",
      header: "ETA",
      cell: (order) => <p className="text-neutral-600">{order.eta}</p>,
    },
    {
      key: "value",
      header: "Value",
      headerClassName: "text-right",
      className: "text-right",
      cell: (order) => (
        <p className="font-semibold text-neutral-950">{order.value}</p>
      ),
    },
  ];

  function showAlert(message: string) {
    setAlert(message);
    window.setTimeout(() => setAlert(null), 2600);
  }

  function updateStatus(option: SelectOption | null) {
    if (!option) return;
    setStatus(option);
    setPage(1);
  }

  function updateQuery(value: string) {
    setQuery(value);
    setPage(1);
  }

  function updateStartDate(date: Date | undefined) {
    setStartDate(date);
    if (date && endDate && startOfDay(endDate) < startOfDay(date)) {
      setEndDate(undefined);
      showAlert("End date was cleared because it cannot be earlier than start date.");
    }
    setPage(1);
  }

  function updateEndDate(date: Date | undefined) {
    if (date && startDate && startOfDay(date) < startOfDay(startDate)) {
      showAlert("End date cannot be earlier than start date.");
      return;
    }

    setEndDate(date);
    setPage(1);
  }

  function clearFilters() {
    setQuery("");
    setStatus(statusOptions[0]!);
    setStartDate(undefined);
    setEndDate(undefined);
    setOpenDateFilter(null);
    setPage(1);
  }

  return (
    <div className="mx-auto max-w-[1320px] space-y-5">
      <Toast
        open={Boolean(alert)}
        title="Filter date updated"
        description={alert ?? ""}
        variant="warning"
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Total orders" value="1,284" detail="+12.4% this month" icon={PackageCheck} />
        <StatCard title="In transit" value="342" detail="28 active routes" icon={Truck} />
        <StatCard title="Pending" value="86" detail="14 awaiting pickup" icon={Clock3} />
        <StatCard title="Avg. value" value="$6.8k" detail="Across all shipments" icon={ArrowDownUp} />
      </div>

      <section className="rounded-xl border border-neutral-200/70 bg-white p-4 shadow-sm shadow-neutral-200/50">
        <PageHeader
          title="Order List"
          description="Dummy orders for the starter template."
        />

        <div className="mt-4 rounded-xl border border-neutral-200/70 bg-neutral-50/70 p-3">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(260px,1fr)_180px_210px_210px_auto] xl:items-end">
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Search
              </span>
              <span className="flex h-10 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 text-neutral-500 shadow-sm shadow-neutral-200/50 transition focus-within:border-blue-300 focus-within:ring-3 focus-within:ring-blue-100">
                <Search className="size-4 shrink-0" aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => updateQuery(event.target.value)}
                  placeholder="Order, route, courier..."
                  className="min-w-0 flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
                />
              </span>
            </label>
            <div className="space-y-1.5">
              <label
                htmlFor="orders-status-filter"
                className="text-xs font-semibold uppercase tracking-wide text-neutral-400"
              >
                Status
              </label>
              <Select<SelectOption>
                instanceId="orders-status-filter"
                inputId="orders-status-filter"
                options={statusOptions}
                value={status}
                isSearchable={false}
                onChange={updateStatus}
                classNames={orderSelectClassNames}
              />
            </div>
            <div className="space-y-1.5">
              <span className="block text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Start date
              </span>
              <DatePicker
                value={startDate}
                onChange={updateStartDate}
                placeholder="Start date"
                open={openDateFilter === "start"}
                onOpenChange={(open) => setOpenDateFilter(open ? "start" : null)}
              />
            </div>
            <div className="space-y-1.5">
              <span className="block text-xs font-semibold uppercase tracking-wide text-neutral-400">
                End date
              </span>
              <DatePicker
                value={endDate}
                onChange={updateEndDate}
                placeholder="End date"
                open={openDateFilter === "end"}
                onOpenChange={(open) => setOpenDateFilter(open ? "end" : null)}
                disabled={startDate ? { before: startDate } : undefined}
              />
            </div>
            {hasActiveFilters ? (
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-600 shadow-sm shadow-neutral-200/50 transition hover:bg-neutral-50"
                onClick={clearFilters}
              >
                <SlidersHorizontal className="size-4" aria-hidden="true" />
                Clear filter
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-4">
          <DataTable
            columns={columns}
            rows={visibleOrders}
            getRowKey={(order) => order.id}
            emptyMessage="No orders match the current filters."
          />
        </div>

        <div className="mt-4 flex flex-col gap-3 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {filteredOrders.length ? (page - 1) * pageSize + 1 : 0}-
            {Math.min(page * pageSize, filteredOrders.length)} of {filteredOrders.length} orders
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-neutral-200 px-3 font-medium text-neutral-600 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              Prev
            </button>
            <span className="rounded-xl bg-neutral-100 px-3 py-2 text-xs font-semibold text-neutral-700">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-neutral-200 px-3 font-medium text-neutral-600 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={page === totalPages}
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            >
              Next
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function isWithinDateRange(date: Date, startDate?: Date, endDate?: Date) {
  const current = startOfDay(date).getTime();
  const start = startDate ? startOfDay(startDate).getTime() : Number.NEGATIVE_INFINITY;
  const end = endDate ? endOfDay(endDate).getTime() : Number.POSITIVE_INFINITY;

  return current >= start && current <= end;
}

function startOfDay(date: Date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function endOfDay(date: Date) {
  const value = new Date(date);
  value.setHours(23, 59, 59, 999);
  return value;
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const styles: Record<OrderStatus, string> = {
    Pending: "bg-amber-50 text-amber-700",
    "In transit": "bg-sky-50 text-sky-700",
    Delivered: "bg-emerald-50 text-emerald-700",
    Delayed: "bg-rose-50 text-rose-700",
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}

const orderSelectClassNames = {
  control: ({ isFocused }: { isFocused: boolean }) =>
    `min-h-10 rounded-xl border bg-white text-sm transition ${
      isFocused
        ? "border-blue-300 ring-3 ring-blue-100"
        : "border-neutral-200"
    }`,
  valueContainer: () => "gap-1 px-3",
  placeholder: () => "text-neutral-400",
  singleValue: () => "text-neutral-950",
  input: () => "text-neutral-950",
  indicatorSeparator: () => "hidden",
  dropdownIndicator: () => "px-2 text-neutral-400 hover:text-neutral-700",
  menu: () =>
    "z-50 mt-2 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-1.5 shadow-xl shadow-neutral-200/80",
  option: ({ isFocused, isSelected }: { isFocused: boolean; isSelected: boolean }) =>
    `cursor-pointer rounded-xl px-3 py-2 text-sm ${
      isSelected
        ? "bg-blue-50 text-blue-700"
        : isFocused
          ? "bg-neutral-100 text-neutral-950"
          : "text-neutral-600"
    }`,
};
