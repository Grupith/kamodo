import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

// Icon from lucide-react. You can swap with any icon you prefer:
import { ChevronDown } from "lucide-react";

interface StatusTagProps {
  status: string;
  jobId: string;
  companyId: string;
  onStatusChange?: (newStatus: string) => void;
}

/**
 * Helper function that returns the color and styling classes
 * based on the provided status.
 */
function getColorClasses(status: string) {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200 border border-green-300 dark:border-green-700";
    case "pending":
      return "bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700";
    case "complete":
      return "bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700";
    default:
      return "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700";
  }
}

export default function StatusTag({
  status,
  jobId,
  companyId,
  onStatusChange,
}: StatusTagProps) {
  const [currentStatus, setCurrentStatus] = useState(status);

  const handleStatusChange = async (newStatus: string) => {
    try {
      setCurrentStatus(newStatus);
      onStatusChange?.(newStatus);

      const jobDocRef = doc(db, "companies", companyId, "jobs", jobId);
      await updateDoc(jobDocRef, { status: newStatus });

      console.log(`Status updated to "${newStatus}" for job ${jobId}`);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return (
    <DropdownMenu>
      {/* Trigger Button with down arrow */}
      <DropdownMenuTrigger
        asChild
        onClick={(e) => e.stopPropagation()} // Prevents navigation or click propagation
      >
        <button
          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium transition-colors duration-200 ${getColorClasses(
            currentStatus
          )}`}
        >
          {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
          <ChevronDown className="h-3 w-3" />
        </button>
      </DropdownMenuTrigger>

      {/* Dropdown Content */}
      <DropdownMenuContent className="dark:border-zinc-800">
        {["active", "pending", "complete", "inactive"].map((statusOption) => (
          <DropdownMenuItem
            key={statusOption}
            onClick={(e) => {
              e.stopPropagation();
              handleStatusChange(statusOption);
            }}
            className="py-0.5 my-1"
            asChild
          >
            {/* 
              We use asChild so we can fully control the styling. 
              Replace <button> with <div> or <span> if preferred. 
            */}
            <button
              className={`mt-1 inline-block w-75% cursor-pointer rounded-md px-2 py-0.5 text-left text-xs font-medium transition-all duration-200 hover:scale-105 ${getColorClasses(
                statusOption
              )}`}
            >
              {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
            </button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
