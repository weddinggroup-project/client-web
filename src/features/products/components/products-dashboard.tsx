"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Edit3,
  LayoutTemplate,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { DatePicker } from "@/components/ui/date-picker";
import { PageHeader } from "@/components/ui/page-header";
import { Select, type SelectOption } from "@/components/ui/select";
import { StatCard } from "@/components/ui/stat-card";
import { Toast } from "@/components/ui/toast";
import { formatRupiah } from "@/features/undangan-digital/wizard/wizard-data";

type TemplateStatus = "Aktif" | "Draft" | "Diarsipkan";
type TemplateModalMode = "create" | "edit";

type InvitationTemplate = {
  id: string;
  name: string;
  code: string;
  style: string;
  price: number;
  used: number;
  status: TemplateStatus;
  createdAt: Date;
};

type TemplateForm = Omit<InvitationTemplate, "id">;

const initialTemplates: InvitationTemplate[] = [
  { id: "TPL-1001", name: "Blush Elegance", code: "BLE-001", style: "Minimalis", price: 45_000, used: 42, status: "Aktif", createdAt: new Date("2026-07-01") },
  { id: "TPL-1002", name: "Emerald Gold", code: "EGD-002", style: "Klasik", price: 65_000, used: 18, status: "Aktif", createdAt: new Date("2026-07-02") },
  { id: "TPL-1003", name: "Rustic Botanical", code: "RBT-003", style: "Rustic", price: 55_000, used: 7, status: "Draft", createdAt: new Date("2026-07-03") },
  { id: "TPL-1004", name: "Ivory Romance", code: "IVR-004", style: "Klasik", price: 40_000, used: 0, status: "Diarsipkan", createdAt: new Date("2026-07-04") },
  { id: "TPL-1005", name: "Golden Hour", code: "GLH-005", style: "Modern", price: 70_000, used: 26, status: "Aktif", createdAt: new Date("2026-07-05") },
  { id: "TPL-1006", name: "Modern Minimalist", code: "MDM-006", style: "Minimalis", price: 38_000, used: 15, status: "Aktif", createdAt: new Date("2026-07-06") },
  { id: "TPL-1007", name: "Tropical Paradise", code: "TRP-007", style: "Modern", price: 29_000, used: 5, status: "Draft", createdAt: new Date("2026-07-07") },
  { id: "TPL-1008", name: "Sakura Bloom", code: "SKB-008", style: "Minimalis", price: 54_000, used: 31, status: "Aktif", createdAt: new Date("2026-07-08") },
];

const emptyForm: TemplateForm = {
  name: "",
  code: "",
  style: "Minimalis",
  price: 0,
  used: 0,
  status: "Aktif",
  createdAt: new Date("2026-07-06"),
};

const styleOptions: SelectOption[] = [
  { label: "Minimalis", value: "Minimalis" },
  { label: "Klasik", value: "Klasik" },
  { label: "Rustic", value: "Rustic" },
  { label: "Modern", value: "Modern" },
];

const statusOptions: SelectOption[] = [
  { label: "Aktif", value: "Aktif" },
  { label: "Draft", value: "Draft" },
  { label: "Diarsipkan", value: "Diarsipkan" },
];

const filterOptions: SelectOption[] = [
  { label: "Semua template", value: "all" },
  ...statusOptions,
];

const pageSize = 5;

export function ProductsDashboard() {
  const shellRef = useRef<HTMLDivElement>(null);
  const [templates, setTemplates] = useState<InvitationTemplate[]>(initialTemplates);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<SelectOption>(filterOptions[0]!);
  const [form, setForm] = useState<TemplateForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<TemplateModalMode | null>(null);
  const [alert, setAlert] = useState<string | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<InvitationTemplate | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    shellRef.current?.setAttribute("data-hydrated", "true");
  }, []);

  const filteredTemplates = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return templates.filter((template) => {
      const matchesFilter = filter.value === "all" || template.status === filter.value;
      const matchesSearch =
        !normalizedQuery ||
        [template.name, template.code, template.style]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesFilter && matchesSearch;
    });
  }, [filter, templates, query]);

  const totalPages = Math.max(1, Math.ceil(filteredTemplates.length / pageSize));
  const visibleTemplates = filteredTemplates.slice((page - 1) * pageSize, page * pageSize);
  const showingFrom = filteredTemplates.length ? (page - 1) * pageSize + 1 : 0;
  const showingTo = Math.min(page * pageSize, filteredTemplates.length);
  const hasActiveFilters = query.trim() !== "" || filter.value !== "all";
  const columns: DataTableColumn<InvitationTemplate>[] = [
    {
      key: "template",
      header: "Template",
      cell: (template) => (
        <div>
          <p className="font-semibold text-neutral-950">{template.name}</p>
          <p className="mt-0.5 text-xs text-neutral-500">{template.code}</p>
        </div>
      ),
    },
    {
      key: "style",
      header: "Gaya Desain",
      cell: (template) => <p className="text-neutral-600">{template.style}</p>,
    },
    {
      key: "price",
      header: "Harga",
      cell: (template) => (
        <p className="font-semibold text-neutral-950">{formatRupiah(template.price)}</p>
      ),
    },
    {
      key: "used",
      header: "Dipakai",
      cell: (template) => (
        <p className={template.used <= 8 ? "font-semibold text-amber-700" : "text-neutral-600"}>
          {template.used}x
        </p>
      ),
    },
    {
      key: "date",
      header: "Dibuat",
      cell: (template) => (
        <p className="text-neutral-600">{formatTemplateDate(template.createdAt)}</p>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (template) => <StatusBadge status={template.status} />,
    },
    {
      key: "actions",
      header: "Aksi",
      headerClassName: "text-right",
      className: "text-right",
      cell: (template) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="grid size-9 place-items-center rounded-xl border border-neutral-200 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950"
            aria-label={`Edit ${template.name}`}
            onClick={() => openEditModal(template)}
          >
            <Edit3 className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-xl border border-rose-100 text-rose-500 transition hover:bg-rose-50"
            aria-label={`Delete ${template.name}`}
            onClick={() => setTemplateToDelete(template)}
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>
      ),
    },
  ];

  function showAlert(message: string) {
    setAlert(message);
    window.setTimeout(() => setAlert(null), 2400);
  }

  function openCreateModal() {
    setForm({ ...emptyForm, createdAt: new Date("2026-07-06") });
    setEditingId(null);
    setModalMode("create");
  }

  function openEditModal(template: InvitationTemplate) {
    setEditingId(template.id);
    setForm({
      name: template.name,
      code: template.code,
      style: template.style,
      price: template.price,
      used: template.used,
      status: template.status,
      createdAt: template.createdAt,
    });
    setModalMode("edit");
  }

  function closeTemplateModal() {
    setModalMode(null);
    setEditingId(null);
    setForm(emptyForm);
  }

  function submitTemplate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim() || !form.code.trim()) {
      showAlert("Nama template dan kode wajib diisi.");
      return;
    }

    if (modalMode === "edit" && editingId) {
      setTemplates((items) =>
        items.map((item) => (item.id === editingId ? { ...item, ...form } : item)),
      );
      showAlert("Template berhasil diperbarui.");
      closeTemplateModal();
      return;
    }

    const nextId = `TPL-${getNextTemplateNumber(templates)}`;
    setTemplates((items) => [{ id: nextId, ...form }, ...items]);
    setPage(1);
    showAlert("Template berhasil ditambahkan.");
    closeTemplateModal();
  }

  function confirmDelete() {
    if (!templateToDelete) return;

    setTemplates((items) => items.filter((item) => item.id !== templateToDelete.id));
    setPage(1);
    showAlert(`${templateToDelete.name} dihapus.`);
    setTemplateToDelete(null);
  }

  function updateQuery(value: string) {
    setQuery(value);
    setPage(1);
  }

  function updateFilter(option: SelectOption | null) {
    if (!option) return;
    setFilter(option);
    setPage(1);
  }

  function clearFilters() {
    setQuery("");
    setFilter(filterOptions[0]!);
    setPage(1);
  }

  return (
    <div ref={shellRef} data-testid="products-shell" className="mx-auto max-w-[1320px] space-y-5">
      <Toast
        open={Boolean(alert)}
        title="Katalog diperbarui"
        description={alert ?? ""}
        variant={alert?.includes("wajib diisi") ? "warning" : "success"}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Total template" value={String(templates.length)} detail="Katalog dummy" icon={LayoutTemplate} />
        <StatCard title="Aktif" value={String(templates.filter((item) => item.status === "Aktif").length)} detail="Siap dipakai" icon={CheckCircle2} />
        <StatCard title="Kurang populer" value={String(templates.filter((item) => item.used <= 8).length)} detail="Perlu dipromosikan" icon={AlertCircle} />
        <StatCard title="Minggu ini" value={String(templates.filter((item) => item.createdAt >= new Date("2026-07-01")).length)} detail="Baru ditambahkan" icon={CheckCircle2} />
      </div>

      <section className="rounded-xl border border-neutral-200/70 bg-white p-4 shadow-sm shadow-neutral-200/50">
        <PageHeader
          title="Katalog Template"
          description="Kelola template undangan dummy dengan modal CRUD, filter, dan pagination."
          action={
            <button
              type="button"
              className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
              onClick={openCreateModal}
            >
              <Plus className="size-4" aria-hidden="true" />
              Template baru
            </button>
          }
        />

        <div className="mt-4 rounded-xl border border-neutral-200/70 bg-neutral-50/70 p-3">
          <div className="grid gap-3 xl:grid-cols-[minmax(260px,1fr)_190px_auto] xl:items-end">
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
                  placeholder="Nama, kode, gaya desain..."
                  className="min-w-0 flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
                />
              </span>
            </label>
            <div className="space-y-1.5">
              <label
                htmlFor="template-filter"
                className="text-xs font-semibold uppercase tracking-wide text-neutral-400"
              >
                Status
              </label>
              <Select<SelectOption>
                instanceId="template-filter"
                inputId="template-filter"
                options={filterOptions}
                value={filter}
                isSearchable={false}
                onChange={updateFilter}
                classNames={templateSelectClassNames}
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
            rows={visibleTemplates}
            getRowKey={(template) => template.id}
            emptyMessage="Tidak ada template yang cocok dengan filter saat ini."
          />
        </div>

        <div className="mt-4 flex flex-col gap-3 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Menampilkan {showingFrom}-{showingTo} dari {filteredTemplates.length} template
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

      {modalMode ? (
        <TemplateModal
          mode={modalMode}
          form={form}
          onClose={closeTemplateModal}
          onSubmit={submitTemplate}
          onFormChange={setForm}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(templateToDelete)}
        title="Hapus template?"
        description={
          <>
            Ini akan menghapus <strong>{templateToDelete?.name}</strong> dari katalog dummy.
          </>
        }
        confirmLabel="Hapus template"
        variant="danger"
        onClose={() => setTemplateToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function TemplateModal({
  mode,
  form,
  onClose,
  onSubmit,
  onFormChange,
}: {
  mode: TemplateModalMode;
  form: TemplateForm;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onFormChange: (form: TemplateForm | ((value: TemplateForm) => TemplateForm)) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-neutral-950/30 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl shadow-neutral-900/20">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-neutral-950">
              {mode === "edit" ? "Edit Template" : "Tambah Template"}
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Perubahan template disimpan ke dummy browser state.
            </p>
          </div>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-xl text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="Close template modal"
            onClick={onClose}
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <form className="mt-5 space-y-4" onSubmit={onSubmit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Nama template">
              <input
                value={form.name}
                onChange={(event) =>
                  onFormChange((value) => ({ ...value, name: event.target.value }))
                }
                className={inputClassName}
                placeholder="Blush Elegance"
              />
            </Field>
            <Field label="Kode">
              <input
                value={form.code}
                onChange={(event) =>
                  onFormChange((value) => ({ ...value, code: event.target.value }))
                }
                className={inputClassName}
                placeholder="BLE-001"
              />
            </Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Gaya desain">
              <Select<SelectOption>
                instanceId="template-style"
                inputId="template-style"
                options={styleOptions}
                value={styleOptions.find((item) => item.value === form.style)}
                isSearchable={false}
                onChange={(option) => {
                  if (option) {
                    onFormChange((value) => ({ ...value, style: option.value }));
                  }
                }}
                classNames={templateSelectClassNames}
              />
            </Field>
            <Field label="Status">
              <Select<SelectOption>
                instanceId="template-status"
                inputId="template-status"
                options={statusOptions}
                value={statusOptions.find((item) => item.value === form.status)}
                isSearchable={false}
                onChange={(option) => {
                  if (option) {
                    onFormChange((value) => ({
                      ...value,
                      status: option.value as TemplateStatus,
                    }));
                  }
                }}
                classNames={templateSelectClassNames}
              />
            </Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Harga">
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(event) =>
                  onFormChange((value) => ({ ...value, price: Number(event.target.value) }))
                }
                className={inputClassName}
              />
            </Field>
            <Field label="Dipakai">
              <input
                type="number"
                min="0"
                value={form.used}
                onChange={(event) =>
                  onFormChange((value) => ({ ...value, used: Number(event.target.value) }))
                }
                className={inputClassName}
              />
            </Field>
            <Field label="Tanggal dibuat">
              <DatePicker
                value={form.createdAt}
                onChange={(date) => {
                  if (date) {
                    onFormChange((value) => ({ ...value, createdAt: date }));
                  }
                }}
                placeholder="Tanggal dibuat"
              />
            </Field>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="h-10 rounded-xl border border-neutral-200 px-4 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
            >
              <Plus className="size-4" aria-hidden="true" />
              {mode === "edit" ? "Perbarui template" : "Tambah template"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-neutral-700">{label}</span>
      {children}
    </label>
  );
}

function StatusBadge({ status }: { status: TemplateStatus }) {
  const styles: Record<TemplateStatus, string> = {
    Aktif: "bg-emerald-50 text-emerald-700",
    Draft: "bg-amber-50 text-amber-700",
    Diarsipkan: "bg-neutral-100 text-neutral-600",
  };

  return (
    <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}

function getNextTemplateNumber(templates: InvitationTemplate[]) {
  const maxNumber = templates.reduce((max, template) => {
    const value = Number(template.id.replace("TPL-", ""));
    return Number.isFinite(value) ? Math.max(max, value) : max;
  }, 1000);

  return maxNumber + 1;
}

function formatTemplateDate(date: Date) {
  return new Intl.DateTimeFormat("id", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

const inputClassName =
  "h-10 w-full rounded-xl border border-neutral-200 px-3 text-sm outline-none transition focus:border-primary/40 focus:ring-3 focus:ring-secondary";

const templateSelectClassNames = {
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
