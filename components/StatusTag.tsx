import React from "react";

export default function StatusTag({ status }: { status: string }) {
  let colorClasses = "";

  switch (status.toLowerCase()) {
    case "active":
      colorClasses =
        "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200";
      break;
    case "pending":
      colorClasses =
        "bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200";
      break;
    case "complete":
      colorClasses =
        "bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200";
      break;
    default:
      colorClasses =
        "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      break;
  }

  return (
    <span
      className={`inline-block rounded-md px-2 py-1 text-xs font-medium transition-colors duration-200 ${colorClasses}`}
    >
      {status}
    </span>
  );
}
