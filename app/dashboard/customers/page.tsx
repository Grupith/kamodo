"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { UserCircleIcon } from "@heroicons/react/24/outline";

interface Customer {
  id: string;
  name: string;
  email?: string;
  company?: string;
  highlightedFields?: {
    name: string;
    email: string;
    company: string;
  };
}

const customers: Customer[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    company: "ACME Inc.",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    company: "Globex Co.",
  },
  {
    id: "3",
    name: "Mark Johnson",
    email: "mark@example.com",
    company: "Soylent Corp.",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah@example.com",
    company: "Initech",
  },
  {
    id: "5",
    name: "Michael Brown",
    email: "michael@example.com",
    company: "Globex Co.",
  },
];

const highlightSearchTerm = (text: string, searchTerm: string): string => {
  if (!searchTerm) return text;
  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.replace(
    regex,
    (match) => `<mark class="bg-yellow-300">${match}</mark>`
  );
};

export default function CustomersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [filter, setFilter] = useState<string>("All");
  const [filteredCustomers, setFilteredCustomers] =
    useState<Customer[]>(customers);

  // Filter logic
  useEffect(() => {
    let filtered = customers;
    if (filter !== "All") {
      filtered = filtered.filter((customer) => customer.company === filter);
    }
    if (searchTerm) {
      filtered = filtered
        .filter((customer) =>
          [customer.name, customer.email, customer.company]
            .filter(Boolean)
            .some((value) =>
              value!.toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
        .map((customer) => ({
          ...customer,
          highlightedFields: {
            name: highlightSearchTerm(customer.name, searchTerm),
            email: highlightSearchTerm(customer.email || "", searchTerm),
            company: highlightSearchTerm(customer.company || "", searchTerm),
          },
        }));
    }
    setFilteredCustomers(filtered);
  }, [searchTerm, filter]);

  const handleViewProfile = (customerId: string) => {
    router.push(`/dashboard/customers/${customerId}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filteredCustomers.length > 0) {
      handleViewProfile(filteredCustomers[0].id);
    }
    if (e.key === "Escape") {
      setSearchTerm(""); // Clear search term
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    const handleGlobalKeydown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleGlobalKeydown);
    return () => window.removeEventListener("keydown", handleGlobalKeydown);
  }, []);

  return (
    <div className="p-4 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold">Customers</h2>
        <div className="flex flex-col sm:flex-row sm:space-x-4 gap-2 sm:gap-0">
          {/* Search Input */}
          <div className="relative w-full sm:w-auto">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-4 pr-20 py-2 rounded-md shadow-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 w-full"
            />
            <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <span className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-200 border rounded-md dark:bg-gray-600 dark:text-gray-100">
                  {navigator.platform.includes("Mac") ? "⌘" : "Ctrl"}
                </kbd>
                <span>+</span>
                <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-200 border rounded-md dark:bg-gray-600 dark:text-gray-100">
                  K
                </kbd>
              </span>
            </div>
          </div>

          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md border w-full sm:w-auto"
          >
            <option value="All">All Companies</option>
            <option value="ACME Inc.">ACME Inc.</option>
            <option value="Globex Co.">Globex Co.</option>
          </select>
        </div>
      </div>

      {/* Customer Grid */}
      <motion.div
        className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
        }}
      >
        {filteredCustomers.map((customer) => (
          <motion.div
            key={customer.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-md hover:scale-105 transition-transform"
          >
            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4">
              <UserCircleIcon className="w-16 h-16 text-gray-400" />
            </div>
            <h3
              className="text-xl font-semibold mb-1"
              dangerouslySetInnerHTML={{
                __html: customer.highlightedFields?.name || customer.name,
              }}
            />
            <p
              className="text-sm text-gray-600"
              dangerouslySetInnerHTML={{
                __html:
                  customer.highlightedFields?.email ||
                  customer.email ||
                  "No Email",
              }}
            />
            <button
              onClick={() => handleViewProfile(customer.id)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              View Profile
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
