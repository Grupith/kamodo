"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

/**
 * Helper function to return color/styling classes
 * for a given status string.
 */
function getColorClasses(status: string) {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200 border border-green-300 dark:border-green-700";
    case "pending":
      return "bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700";
    case "complete":
      return "bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700";
    case "inactive":
      return "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700";
    default:
      return "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700";
  }
}

interface StatusSelectorProps {
  /**
   * The current selected status (controlled).
   */
  value: string;

  /**
   * Callback when user picks a new status.
   */
  onChange?: (newStatus: string) => void;
}

/**
 * A simple dropdown for selecting a status.
 * No Firestore logic. This is purely presentational + callback.
 */
export default function StatusSelector({
  value,
  onChange,
}: StatusSelectorProps) {
  const statuses = ["active", "pending", "complete", "inactive"];

  const handleSelect = (newStatus: string) => {
    onChange?.(newStatus);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        // This prevents parent row clicks (if used in a table)
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={`
            inline-flex items-center gap-1 rounded-md h-fit px-2 py-0.5 text-xs font-medium
            transition-colors duration-200
            ${getColorClasses(value)}
          `}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
          <ChevronDown className="h-3 w-3" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="dark:border-zinc-800">
        {statuses.map((statusOption) => (
          <DropdownMenuItem
            key={statusOption}
            onClick={(e) => {
              e.stopPropagation();
              handleSelect(statusOption);
            }}
            className="py-0.5 my-1"
            asChild
          >
            <button
              className={`
                mt-1 inline-block w-75% cursor-pointer rounded-md px-2 py-0.5 text-left text-xs font-medium
                transition-all duration-200 hover:scale-105
                ${getColorClasses(statusOption)}
              `}
            >
              {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
            </button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
