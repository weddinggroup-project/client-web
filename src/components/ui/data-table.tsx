import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type DataTableColumn<T> = {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  emptyMessage: string;
};

/**
 * A single table that scrolls horizontally on narrow screens, rather than
 * rendering a second duplicate "mobile card" layout — one row of markup per
 * row of data, so nothing can drift out of sync between breakpoints.
 */
export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  emptyMessage,
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-neutral-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-semibold whitespace-nowrap text-neutral-400 uppercase tracking-wide",
                    column.headerClassName,
                  )}
                  scope="col"
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
      </div>

      {!rows.length ? (
        <div className="px-4 py-10 text-center text-sm text-neutral-500">
          {emptyMessage}
        </div>
      ) : null}
    </div>
  );
}
