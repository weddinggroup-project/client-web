import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type DataTableColumn<T> = {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
  mobileLabel?: ReactNode;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  emptyMessage: string;
};

export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  emptyMessage,
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200">
      <table className="hidden w-full border-collapse lg:table">
        <thead className="bg-neutral-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-400",
                  column.headerClassName,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {rows.map((row) => (
            <tr key={getRowKey(row)} className="text-sm transition hover:bg-neutral-50">
              {columns.map((column) => (
                <td key={column.key} className={cn("px-4 py-4", column.className)}>
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="divide-y divide-neutral-200 lg:hidden">
        {rows.map((row) => (
          <article key={getRowKey(row)} className="space-y-3 px-4 py-4 text-sm">
            {columns.map((column) => (
              <div key={column.key} className="flex items-start justify-between gap-4">
                <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  {column.mobileLabel ?? column.header}
                </span>
                <div className="min-w-0 text-right">{column.cell(row)}</div>
              </div>
            ))}
          </article>
        ))}
      </div>

      {!rows.length ? (
        <div className="px-4 py-10 text-center text-sm text-neutral-500">
          {emptyMessage}
        </div>
      ) : null}
    </div>
  );
}
