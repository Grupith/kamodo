import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export default function StatusTag({
  status,
  jobId,
  companyId,
  onStatusChange,
}: {
  status: string;
  jobId: string;
  companyId: string;
  onStatusChange?: (newStatus: string) => void;
}) {
  const [currentStatus, setCurrentStatus] = useState(status);

  let colorClasses = "";

  switch (currentStatus.toLowerCase()) {
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

  const handleStatusChange = async (newStatus: string) => {
    try {
      setCurrentStatus(newStatus);
      if (onStatusChange) {
        onStatusChange(newStatus);
      }

      const jobDocRef = doc(db, "companies", companyId, "jobs", jobId);
      await updateDoc(jobDocRef, { status: newStatus });

      console.log(`Status updated to "${newStatus}" for job ${jobId}`);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        onClick={(e) => e.stopPropagation()} // Prevents navigation or click propagation
      >
        <button
          className={`inline-block rounded-md px-2 py-1 text-xs font-medium transition-colors duration-200 ${colorClasses}`}
        >
          {currentStatus}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {["active", "pending", "complete", "inactive"].map((statusOption) => (
          <DropdownMenuItem
            key={statusOption}
            onClick={() => handleStatusChange(statusOption)}
          >
            {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
