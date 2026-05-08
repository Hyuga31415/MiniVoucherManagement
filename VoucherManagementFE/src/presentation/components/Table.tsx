"use client";

import React from "react";

interface TableColumn<T> {
  key: keyof T | "actions";
  label: string;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

/**
 * Table - Reusable table component for displaying data
 */
export const Table = React.forwardRef<
  HTMLTableElement,
  TableProps<any>
>(
  (
    {
      columns,
      data,
      loading = false,
      emptyMessage = "No data available",
      className = "",
    },
    ref
  ) => {
    return (
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table
          ref={ref}
          className={`w-full border-collapse ${className}`}
        >
          {/* Header */}
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  style={{ width: column.width }}
                  className="px-4 py-2 text-left text-xs font-semibold text-gray-700"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-6 text-center text-gray-500 text-xs"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className="px-4 py-2.5 text-xs text-gray-700"
                    >
                      {column.render
                        ? column.render(
                            column.key === "actions"
                              ? undefined
                              : (row as any)[column.key as keyof any],
                            row
                          )
                        : column.key === "actions"
                          ? ""
                          : String((row as any)[column.key as keyof any] ?? "-")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }
);

Table.displayName = "Table";
