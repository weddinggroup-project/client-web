"use client";

import { useState, type ReactNode } from "react";
import { HiOutlinePencilSquare, HiOutlinePlus, HiOutlineTrash } from "react-icons/hi2";
import { useFeedback } from "@/components/dash/feedback";
import { FormModal, type FieldDef, type FormValues } from "@/components/dash/form-modal";
import { Pagination } from "@/components/dash/pagination";
import { Panel, btn } from "@/components/dash/primitives";
import { EmptyState, ErrorState, LoadingBlock } from "@/components/dash/states";
import { useResource } from "@/components/dash/use-resource";
import { api, ApiError, type ApiClient } from "@/lib/vowly/client";
import { useOptionalProjectApi } from "../project-context";

export type Column<T> = { header: string; cell: (row: T) => ReactNode; className?: string };
export type FilterDef = { name: string; label: string; options: { value: string; label: string }[] };

type Props<T extends { id: string }> = {
  /** Resource path, e.g. "/guests" (under the current project unless `pathOf` is given). */
  resource: string;
  noun: string;
  columns: Column<T>[];
  fields: FieldDef[];
  /** Form values for a row (edit) or defaults (create, row = null). */
  toInitial: (row: T | null) => FormValues;
  /** API body from form values. `mode` lets updates send "" to clear optional fields. */
  toPayload: (values: FormValues, mode: "create" | "update") => Record<string, unknown>;
  filters?: FilterDef[];
  searchable?: boolean;
  pageSize?: number;
  /** Called after any create/update/delete so siblings (summaries) can reload. */
  onChanged?: () => void;
  /** Always-applied query params (e.g. a category chosen outside the table); changing them resets to page 1. */
  fixedQuery?: Record<string, string>;
  /** Extra data reload key; bump to refetch the list from outside. */
  refreshKey?: number;
  extraActions?: (row: T) => ReactNode;
  toolbar?: ReactNode;
  addLabel?: string;
  /** Builds the API path for a resource; defaults to the current project's path. Needed outside a project (admin). */
  pathOf?: (suffix: string) => string;
  /** Browser client to use; defaults to the project API client. */
  client?: Pick<ApiClient, "get" | "post" | "put" | "delete">;
};

export function CrudTable<T extends { id: string }>({
  resource,
  noun,
  columns,
  fields,
  toInitial,
  toPayload,
  filters = [],
  searchable = false,
  pageSize = 10,
  onChanged,
  refreshKey = 0,
  fixedQuery,
  extraActions,
  toolbar,
  addLabel,
  pathOf,
  client = api,
}: Props<T>) {
  const projectPath = useOptionalProjectApi();
  const resolved = pathOf ?? projectPath;
  if (!resolved) throw new Error("CrudTable needs a project route or a `pathOf` prop");
  const path: (suffix: string) => string = resolved;
  const feedback = useFeedback();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<T | null | undefined>(undefined); // undefined = closed, null = create

  const { data, meta, error, loading, reload } = useResource<T[]>(
    path(resource),
    {
    page,
    limit: pageSize,
    search: search || undefined,
    ...filterValues,
    ...fixedQuery,
    _r: refreshKey || undefined,
  },
    true,
    client,
  );

  function changed() {
    reload();
    onChanged?.();
  }

  async function save(values: FormValues) {
    const mode = editing ? "update" : "create";
    const body = toPayload(values, mode);
    if (editing) await client.put(path(`${resource}/${editing.id}`), body);
    else await client.post(path(resource), body);
    feedback.success(editing ? "Perubahan disimpan" : `${noun} ditambahkan`);
    setEditing(undefined);
    changed();
  }

  async function remove(row: T) {
    const ok = await feedback.confirm({ title: `Hapus ${noun}?`, description: "Tindakan ini tidak dapat dibatalkan.", confirmLabel: "Hapus", danger: true });
    if (!ok) return;
    try {
      await client.delete(path(`${resource}/${row.id}`));
      feedback.success(`${noun} dihapus`);
      changed();
    } catch (cause) {
      feedback.error("Gagal menghapus", cause instanceof ApiError ? cause.message : undefined);
    }
  }

  const filtered = search !== "" || Object.values(filterValues).some(Boolean);

  return (
    <Panel className="p-0 sm:p-0">
      <div className="flex flex-wrap items-center gap-2 border-b border-gold/40 p-4">
        {searchable ? (
          <input
            type="search"
            aria-label={`Cari ${noun}`}
            placeholder={`Cari ${noun}…`}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            className="h-10 min-w-48 flex-1 rounded-lg border border-gold/70 bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        ) : null}
        {filters.map((filter) => (
          <select
            key={filter.name}
            aria-label={filter.label}
            value={filterValues[filter.name] ?? ""}
            onChange={(event) => {
              setFilterValues((current) => ({ ...current, [filter.name]: event.target.value }));
              setPage(1);
            }}
            className="h-10 rounded-lg border border-gold/70 bg-white px-3 text-sm"
          >
            <option value="">{filter.label}</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ))}
        <div className="ml-auto flex items-center gap-2">
          {toolbar}
          <button type="button" className={btn.primary} onClick={() => setEditing(null)}>
            <HiOutlinePlus className="size-4" aria-hidden />
            {addLabel ?? `Tambah ${noun}`}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-4">
          <LoadingBlock />
        </div>
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : !data || data.length === 0 ? (
        <EmptyState
          title={filtered ? `${noun} tidak ditemukan` : `Belum ada ${noun}`}
          description={filtered ? "Ubah kata kunci atau filter." : `Tambahkan ${noun} pertama Anda.`}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-gold/40 text-[11px] tracking-wider text-ink-soft uppercase">
                {columns.map((column) => (
                  <th key={column.header} scope="col" className={`px-4 py-3 font-semibold ${column.className ?? ""}`}>
                    {column.header}
                  </th>
                ))}
                <th scope="col" className="px-4 py-3 text-right font-semibold">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className="border-b border-gold/30 last:border-0 hover:bg-cream/60">
                  {columns.map((column) => (
                    <td key={column.header} className={`px-4 py-3 align-middle ${column.className ?? ""}`}>
                      {column.cell(row)}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {extraActions?.(row)}
                      <button type="button" className={btn.icon} aria-label={`Ubah ${noun}`} onClick={() => setEditing(row)}>
                        <HiOutlinePencilSquare className="size-4" aria-hidden />
                      </button>
                      <button type="button" className={btn.icon} aria-label={`Hapus ${noun}`} onClick={() => void remove(row)}>
                        <HiOutlineTrash className="size-4" aria-hidden />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination meta={meta} onPage={setPage} noun={noun} />

      <FormModal
        open={editing !== undefined}
        title={editing ? `Ubah ${noun}` : `Tambah ${noun}`}
        fields={fields}
        initial={toInitial(editing ?? null)}
        onClose={() => setEditing(undefined)}
        onSubmit={save}
      />
    </Panel>
  );
}
