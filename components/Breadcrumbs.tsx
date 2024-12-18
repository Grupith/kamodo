"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

// Mock function to resolve names for specific IDs or paths
const fetchEntityName = (segment: string): string => {
  const mockData: Record<string, string> = {
    employees: "Employees",
    customers: "Customers",
    "1": "Alice Johnson",
    "2": "Bob Smith",
    "3": "Jane Doe",
    "4": "Mark Johnson",
  };

  return (
    mockData[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
  );
};

const Breadcrumbs: React.FC = () => {
  const pathname = usePathname();

  // Split pathname into segments, excluding the root (e.g., dashboard/employees)
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  // Breadcrumb items (removing duplicates for 'dashboard')
  const breadcrumbItems = pathSegments.reduce((acc, segment, index) => {
    if (index === 0 && segment === "dashboard") {
      // Root breadcrumb for "Dashboard"
      acc.push({ href: "/dashboard", label: "Dashboard", isLast: false });
    } else {
      // Remaining paths
      const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
      const isLast = index === pathSegments.length - 1;
      const label = fetchEntityName(segment);
      acc.push({ href, label, isLast });
    }
    return acc;
  }, [] as { href: string; label: string; isLast: boolean }[]);

  return (
    <nav
      className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 bg-transparent pl-6 py-4"
      aria-label="Breadcrumb"
    >
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        {/* Render Breadcrumb Items */}
        {breadcrumbItems.map(({ href, label, isLast }, index) => (
          <li key={index} className="flex items-center">
            {/* Chevron separator */}
            {index !== 0 && (
              <ChevronRightIcon className="w-4 h-4 mx-1 text-gray-400" />
            )}

            {/* Breadcrumb Link */}
            {isLast ? (
              <span className="text-gray-500 dark:text-gray-400 capitalize">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white capitalize"
              >
                {label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
