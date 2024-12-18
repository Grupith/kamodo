import React from "react";

interface TableProps<T> {
  data: T[];
  columns: { key: keyof T; label: string }[];
  onRowClick?: (row: T) => void; // Optional callback for row clicks
}

export default function Table<T extends { id: string }>({
  data,
  columns,
  onRowClick,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            {columns.map((column, index) => (
              <th
                key={column.key as string}
                className={`text-left px-6 py-3 font-semibold text-sm ${
                  index === 0
                    ? "rounded-tl-lg"
                    : index === columns.length - 1
                    ? "rounded-tr-lg"
                    : ""
                }`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              {columns.map((column) => (
                <td
                  key={column.key as string}
                  className="px-6 py-4 text-gray-800 dark:text-gray-300 text-sm"
                >
                  {String(row[column.key]) || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
