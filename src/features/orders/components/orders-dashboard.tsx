"use client";

import { useMemo, useState } from "react";
import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Search,
  SlidersHorizontal,
  Wallet,
} from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { DatePicker } from "@/components/ui/date-picker";
import { PageHeader } from "@/components/ui/page-header";
import { Select, type SelectOption } from "@/components/ui/select";
import { StatCard } from "@/components/ui/stat-card";
import { Toast } from "@/components/ui/toast";
import { formatRupiah, packages } from "@/features/undangan-digital/wizard/wizard-data";

type OrderStatus = "Menunggu Pembayaran" | "Diproses" | "Selesai" | "Dibatalkan";

type Order = {
  id: string;
  couple: string;
  packageName: string;
  status: OrderStatus;
  consultant: string;
  guests: number;
  eventDate: string;
  total: string;
  createdAt: Date;
};

const orders: Order[] = [
  { id: "VOW-1048", couple: "Andi & Siska", packageName: "Journey", status: "Diproses", consultant: "Rina Kartika", guests: 250, eventDate: "12 Des 2026", total: formatRupiah(350_000), createdAt: new Date("2026-07-08") },
  { id: "VOW-1047", couple: "Raka & Dinda", packageName: "Promise", status: "Menunggu Pembayaran", consultant: "Budi Santoso", guests: 120, eventDate: "20 Jan 2027", total: formatRupiah(220_000), createdAt: new Date("2026-07-06") },
  { id: "VOW-1046", couple: "Bima & Alya", packageName: "Forever", status: "Selesai", consultant: "Maya Puspita", guests: 400, eventDate: "05 Nov 2026", total: formatRupiah(690_000), createdAt: new Date("2026-07-09") },
  { id: "VOW-1045", couple: "Yudi & Citra", packageName: "Journey", status: "Selesai", consultant: "Andra Wijaya", guests: 300, eventDate: "18 Okt 2026", total: formatRupiah(350_000), createdAt: new Date("2026-07-07") },
  { id: "VOW-1044", couple: "Fajar & Intan", packageName: "Promise", status: "Diproses", consultant: "Sari Dewi", guests: 90, eventDate: "22 Feb 2027", total: formatRupiah(220_000), createdAt: new Date("2026-07-08") },
  { id: "VOW-1043", couple: "Dimas & Ayu", packageName: "Forever", status: "Selesai", consultant: "Fitri Handayani", guests: 500, eventDate: "14 Sep 2026", total: formatRupiah(690_000), createdAt: new Date("2026-07-05") },
  { id: "VOW-1042", couple: "Rian & Putri", packageName: "Promise", status: "Dibatalkan", consultant: "Doni Pratama", guests: 80, eventDate: "01 Mar 2027", total: formatRupiah(220_000), createdAt: new Date("2026-07-08") },
  { id: "VOW-1041", couple: "Bayu & Nadia", packageName: "Journey", status: "Diproses", consultant: "Lina Marlina", guests: 260, eventDate: "09 Jan 2027", total: formatRupiah(350_000), createdAt: new Date("2026-07-08") },
];

const statusOptions: SelectOption[] = [
  { label: "Semua pesanan", value: "all" },
  { label: "Menunggu Pembayaran", value: "Menunggu Pembayaran" },
  { label: "Diproses", value: "Diproses" },
  { label: "Selesai", value: "Selesai" },
  { label: "Dibatalkan", value: "Dibatalkan" },
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
        [order.id, order.couple, order.packageName, order.consultant]
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
      header: "Pesanan",
      cell: (order) => (
        <div>
          <p className="font-semibold text-neutral-950">{order.couple}</p>
          <p className="mt-0.5 text-xs text-neutral-500">
            {order.id} • {order.guests} tamu
          </p>
        </div>
      ),
    },
    {
      key: "package",
      header: "Paket",
      cell: (order) => <p className="text-neutral-700">{order.packageName}</p>,
    },
    {
      key: "consultant",
      header: "Konsultan",
      cell: (order) => <p className="text-neutral-600">{order.consultant}</p>,
    },
    {
      key: "status",
      header: "Status",
      cell: (order) => <StatusBadge status={order.status} />,
    },
    {
      key: "eventDate",
      header: "Tanggal Acara",
      cell: (order) => <p className="text-neutral-600">{order.eventDate}</p>,
    },
    {
      key: "total",
      header: "Total",
      headerClassName: "text-right",
      className: "text-right",
      cell: (order) => (
        <p className="font-semibold text-neutral-950">{order.total}</p>
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
      showAlert("Tanggal akhir dihapus karena tidak boleh lebih awal dari tanggal mulai.");
    }
    setPage(1);
  }

  function updateEndDate(date: Date | undefined) {
    if (date && startDate && startOfDay(date) < startOfDay(startDate)) {
      showAlert("Tanggal akhir tidak boleh lebih awal dari tanggal mulai.");
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
        title="Filter tanggal diperbarui"
        description={alert ?? ""}
        variant="warning"
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Total pesanan" value="1.284" detail="+12.4% bulan ini" icon={CalendarCheck} />
        <StatCard title="Diproses" value="342" detail="28 pesanan aktif" icon={Clock3} />
        <StatCard title="Menunggu pembayaran" value="86" detail="14 menunggu konfirmasi" icon={SlidersHorizontal} />
        <StatCard title="Rata-rata nilai" value={formatRupiah(340_000)} detail={`Dari ${packages.length} paket tersedia`} icon={Wallet} />
      </div>

      <section className="rounded-xl border border-neutral-200/70 bg-white p-4 shadow-sm shadow-neutral-200/50">
        <PageHeader
          title="Daftar Pesanan"
          description="Data pesanan undangan digital dummy untuk starter template Vowly."
        />

        <div className="mt-4 rounded-xl border border-neutral-200/70 bg-neutral-50/70 p-3">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(260px,1fr)_180px_210px_210px_auto] xl:items-end">
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Cari
              </span>
              <span className="flex h-10 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 text-neutral-500 shadow-sm shadow-neutral-200/50 transition focus-within:border-primary/40 focus-within:ring-3 focus-within:ring-secondary">
                <Search className="size-4 shrink-0" aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => updateQuery(event.target.value)}
                  placeholder="Pesanan, pasangan, konsultan..."
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
                Tanggal mulai
              </span>
              <DatePicker
                value={startDate}
                onChange={updateStartDate}
                placeholder="Tanggal mulai"
                open={openDateFilter === "start"}
                onOpenChange={(open) => setOpenDateFilter(open ? "start" : null)}
              />
            </div>
            <div className="space-y-1.5">
              <span className="block text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Tanggal akhir
              </span>
              <DatePicker
                value={endDate}
                onChange={updateEndDate}
                placeholder="Tanggal akhir"
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
                Hapus filter
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-4">
          <DataTable
            columns={columns}
            rows={visibleOrders}
            getRowKey={(order) => order.id}
            emptyMessage="Tidak ada pesanan yang cocok dengan filter saat ini."
          />
        </div>

        <div className="mt-4 flex flex-col gap-3 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Menampilkan {filteredOrders.length ? (page - 1) * pageSize + 1 : 0}-
            {Math.min(page * pageSize, filteredOrders.length)} dari {filteredOrders.length} pesanan
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-neutral-200 px-3 font-medium text-neutral-600 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              Sebelumnya
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
              Berikutnya
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
    "Menunggu Pembayaran": "bg-amber-50 text-amber-700",
    Diproses: "bg-sky-50 text-sky-700",
    Selesai: "bg-emerald-50 text-emerald-700",
    Dibatalkan: "bg-rose-50 text-rose-700",
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
        ? "border-primary/40 ring-3 ring-secondary"
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
        ? "bg-secondary text-primary"
        : isFocused
          ? "bg-neutral-100 text-neutral-950"
          : "text-neutral-600"
    }`,
};
