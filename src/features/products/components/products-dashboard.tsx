"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Package,
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

type ProductStatus = "Active" | "Draft" | "Archived";
type ProductModalMode = "create" | "edit";

type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  createdAt: Date;
};

type ProductForm = Omit<Product, "id">;

const initialProducts: Product[] = [
  {
    id: "PRD-1001",
    name: "Luna Knit Sweater",
    sku: "LKS-302",
    category: "Fashion",
    price: 48,
    stock: 42,
    status: "Active",
    createdAt: new Date("2026-07-01"),
  },
  {
    id: "PRD-1002",
    name: "Aero Daily Backpack",
    sku: "ADB-119",
    category: "Accessories",
    price: 72,
    stock: 18,
    status: "Active",
    createdAt: new Date("2026-07-02"),
  },
  {
    id: "PRD-1003",
    name: "Nordic Desk Lamp",
    sku: "NDL-882",
    category: "Home",
    price: 59,
    stock: 7,
    status: "Draft",
    createdAt: new Date("2026-07-03"),
  },
  {
    id: "PRD-1004",
    name: "Ceramic Mug Set",
    sku: "CMS-044",
    category: "Home",
    price: 34,
    stock: 0,
    status: "Archived",
    createdAt: new Date("2026-07-04"),
  },
  {
    id: "PRD-1005",
    name: "Canvas Daily Sneaker",
    sku: "CDS-772",
    category: "Fashion",
    price: 86,
    stock: 26,
    status: "Active",
    createdAt: new Date("2026-07-05"),
  },
  {
    id: "PRD-1006",
    name: "Hydra Glow Serum",
    sku: "HGS-611",
    category: "Beauty",
    price: 41,
    stock: 15,
    status: "Active",
    createdAt: new Date("2026-07-06"),
  },
  {
    id: "PRD-1007",
    name: "Walnut Desk Tray",
    sku: "WDT-508",
    category: "Home",
    price: 29,
    stock: 5,
    status: "Draft",
    createdAt: new Date("2026-07-07"),
  },
  {
    id: "PRD-1008",
    name: "Metro Sling Bag",
    sku: "MSB-240",
    category: "Accessories",
    price: 54,
    stock: 31,
    status: "Active",
    createdAt: new Date("2026-07-08"),
  },
];

const emptyForm: ProductForm = {
  name: "",
  sku: "",
  category: "Fashion",
  price: 0,
  stock: 0,
  status: "Active",
  createdAt: new Date("2026-07-06"),
};

const categoryOptions: SelectOption[] = [
  { label: "Fashion", value: "Fashion" },
  { label: "Accessories", value: "Accessories" },
  { label: "Home", value: "Home" },
  { label: "Beauty", value: "Beauty" },
];

const statusOptions: SelectOption[] = [
  { label: "Active", value: "Active" },
  { label: "Draft", value: "Draft" },
  { label: "Archived", value: "Archived" },
];

const filterOptions: SelectOption[] = [
  { label: "All products", value: "all" },
  ...statusOptions,
];

const pageSize = 5;

export function ProductsDashboard() {
  const shellRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<SelectOption>(filterOptions[0]!);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<ProductModalMode | null>(null);
  const [alert, setAlert] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    shellRef.current?.setAttribute("data-hydrated", "true");
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesFilter = filter.value === "all" || product.status === filter.value;
      const matchesSearch =
        !normalizedQuery ||
        [product.name, product.sku, product.category]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesFilter && matchesSearch;
    });
  }, [filter, products, query]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const visibleProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);
  const showingFrom = filteredProducts.length ? (page - 1) * pageSize + 1 : 0;
  const showingTo = Math.min(page * pageSize, filteredProducts.length);
  const hasActiveFilters = query.trim() !== "" || filter.value !== "all";
  const columns: DataTableColumn<Product>[] = [
    {
      key: "product",
      header: "Product",
      cell: (product) => (
        <div>
          <p className="font-semibold text-neutral-950">{product.name}</p>
          <p className="mt-0.5 text-xs text-neutral-500">{product.sku}</p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      cell: (product) => <p className="text-neutral-600">{product.category}</p>,
    },
    {
      key: "price",
      header: "Price",
      cell: (product) => (
        <p className="font-semibold text-neutral-950">${product.price}</p>
      ),
    },
    {
      key: "stock",
      header: "Stock",
      cell: (product) => (
        <p className={product.stock <= 8 ? "font-semibold text-amber-700" : "text-neutral-600"}>
          {product.stock}
        </p>
      ),
    },
    {
      key: "date",
      header: "Date",
      cell: (product) => (
        <p className="text-neutral-600">{formatProductDate(product.createdAt)}</p>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (product) => <StatusBadge status={product.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (product) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="grid size-9 place-items-center rounded-xl border border-neutral-200 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950"
            aria-label={`Edit ${product.name}`}
            onClick={() => openEditModal(product)}
          >
            <Edit3 className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-xl border border-rose-100 text-rose-500 transition hover:bg-rose-50"
            aria-label={`Delete ${product.name}`}
            onClick={() => setProductToDelete(product)}
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

  function openEditModal(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price,
      stock: product.stock,
      status: product.status,
      createdAt: product.createdAt,
    });
    setModalMode("edit");
  }

  function closeProductModal() {
    setModalMode(null);
    setEditingId(null);
    setForm(emptyForm);
  }

  function submitProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim() || !form.sku.trim()) {
      showAlert("Product name and SKU are required.");
      return;
    }

    if (modalMode === "edit" && editingId) {
      setProducts((items) =>
        items.map((item) => (item.id === editingId ? { ...item, ...form } : item)),
      );
      showAlert("Product updated successfully.");
      closeProductModal();
      return;
    }

    const nextId = `PRD-${getNextProductNumber(products)}`;
    setProducts((items) => [{ id: nextId, ...form }, ...items]);
    setPage(1);
    showAlert("Product added successfully.");
    closeProductModal();
  }

  function confirmDelete() {
    if (!productToDelete) return;

    setProducts((items) => items.filter((item) => item.id !== productToDelete.id));
    setPage(1);
    showAlert(`${productToDelete.name} deleted.`);
    setProductToDelete(null);
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
        title="Catalog updated"
        description={alert ?? ""}
        variant={alert?.includes("required") ? "warning" : "success"}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Total products" value={String(products.length)} detail="Dummy catalog items" icon={Package} />
        <StatCard title="Active" value={String(products.filter((item) => item.status === "Active").length)} detail="Ready to publish" icon={CheckCircle2} />
        <StatCard title="Low stock" value={String(products.filter((item) => item.stock <= 8).length)} detail="Needs attention" icon={AlertCircle} />
        <StatCard title="This week" value={String(products.filter((item) => item.createdAt >= new Date("2026-07-01")).length)} detail="Recently added" icon={CheckCircle2} />
      </div>

      <section className="rounded-xl border border-neutral-200/70 bg-white p-4 shadow-sm shadow-neutral-200/50">
        <PageHeader
          title="Product Catalog"
          description="Manage dummy products with modal CRUD, filters, and pagination."
          action={
            <button
              type="button"
              className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800"
              onClick={openCreateModal}
            >
              <Plus className="size-4" aria-hidden="true" />
              New product
            </button>
          }
        />

        <div className="mt-4 rounded-xl border border-neutral-200/70 bg-neutral-50/70 p-3">
          <div className="grid gap-3 xl:grid-cols-[minmax(260px,1fr)_190px_auto] xl:items-end">
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
                  placeholder="Name, SKU, category..."
                  className="min-w-0 flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
                />
              </span>
            </label>
            <div className="space-y-1.5">
              <label
                htmlFor="product-filter"
                className="text-xs font-semibold uppercase tracking-wide text-neutral-400"
              >
                Status
              </label>
              <Select<SelectOption>
                instanceId="product-filter"
                inputId="product-filter"
                options={filterOptions}
                value={filter}
                isSearchable={false}
                onChange={updateFilter}
                classNames={productSelectClassNames}
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
            rows={visibleProducts}
            getRowKey={(product) => product.id}
            emptyMessage="No products match the current filters."
          />
        </div>

        <div className="mt-4 flex flex-col gap-3 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {showingFrom}-{showingTo} of {filteredProducts.length} products
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

      {modalMode ? (
        <ProductModal
          mode={modalMode}
          form={form}
          onClose={closeProductModal}
          onSubmit={submitProduct}
          onFormChange={setForm}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(productToDelete)}
        title="Delete product?"
        description={
          <>
            This will remove <strong>{productToDelete?.name}</strong> from the dummy catalog.
          </>
        }
        confirmLabel="Delete product"
        variant="danger"
        onClose={() => setProductToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function ProductModal({
  mode,
  form,
  onClose,
  onSubmit,
  onFormChange,
}: {
  mode: ProductModalMode;
  form: ProductForm;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onFormChange: (form: ProductForm | ((value: ProductForm) => ProductForm)) => void;
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
              {mode === "edit" ? "Edit Product" : "Add Product"}
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Product changes are saved to dummy browser state.
            </p>
          </div>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-xl text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="Close product modal"
            onClick={onClose}
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <form className="mt-5 space-y-4" onSubmit={onSubmit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Product name">
              <input
                value={form.name}
                onChange={(event) =>
                  onFormChange((value) => ({ ...value, name: event.target.value }))
                }
                className={inputClassName}
                placeholder="Luna Knit Sweater"
              />
            </Field>
            <Field label="SKU">
              <input
                value={form.sku}
                onChange={(event) =>
                  onFormChange((value) => ({ ...value, sku: event.target.value }))
                }
                className={inputClassName}
                placeholder="LKS-302"
              />
            </Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Category">
              <Select<SelectOption>
                instanceId="product-category"
                inputId="product-category"
                options={categoryOptions}
                value={categoryOptions.find((item) => item.value === form.category)}
                isSearchable={false}
                onChange={(option) => {
                  if (option) {
                    onFormChange((value) => ({ ...value, category: option.value }));
                  }
                }}
                classNames={productSelectClassNames}
              />
            </Field>
            <Field label="Status">
              <Select<SelectOption>
                instanceId="product-status"
                inputId="product-status"
                options={statusOptions}
                value={statusOptions.find((item) => item.value === form.status)}
                isSearchable={false}
                onChange={(option) => {
                  if (option) {
                    onFormChange((value) => ({
                      ...value,
                      status: option.value as ProductStatus,
                    }));
                  }
                }}
                classNames={productSelectClassNames}
              />
            </Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Price">
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
            <Field label="Stock">
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(event) =>
                  onFormChange((value) => ({ ...value, stock: Number(event.target.value) }))
                }
                className={inputClassName}
              />
            </Field>
            <Field label="Created date">
              <DatePicker
                value={form.createdAt}
                onChange={(date) => {
                  if (date) {
                    onFormChange((value) => ({ ...value, createdAt: date }));
                  }
                }}
                placeholder="Created date"
              />
            </Field>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="h-10 rounded-xl border border-neutral-200 px-4 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              <Plus className="size-4" aria-hidden="true" />
              {mode === "edit" ? "Update product" : "Add product"}
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

function StatusBadge({ status }: { status: ProductStatus }) {
  const styles: Record<ProductStatus, string> = {
    Active: "bg-emerald-50 text-emerald-700",
    Draft: "bg-amber-50 text-amber-700",
    Archived: "bg-neutral-100 text-neutral-600",
  };

  return (
    <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}

function getNextProductNumber(products: Product[]) {
  const maxNumber = products.reduce((max, product) => {
    const value = Number(product.id.replace("PRD-", ""));
    return Number.isFinite(value) ? Math.max(max, value) : max;
  }, 1000);

  return maxNumber + 1;
}

function formatProductDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

const inputClassName =
  "h-10 w-full rounded-xl border border-neutral-200 px-3 text-sm outline-none transition focus:border-blue-300 focus:ring-3 focus:ring-blue-100";

const productSelectClassNames = {
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
