"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserCircleIcon } from "@heroicons/react/24/outline";

interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  highlightedFields?: {
    name: string;
    email: string;
    position: string;
  };
}

// Dummy employee data for demonstration
const employees: Employee[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    position: "Manager",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    position: "Developer",
  },
  {
    id: "3",
    name: "Clara Lee",
    email: "clara@example.com",
    position: "UX Designer",
  },
  {
    id: "4",
    name: "David Brown",
    email: "david@example.com",
    position: "QA Specialist",
  },
  {
    id: "5",
    name: "Emily Davis",
    email: "emily@example.com",
    position: "Software Engineer",
  },
];

// Corrected highlight function
const highlightSearchTerm = (text: string, searchTerm: string): string => {
  if (!searchTerm) return text;
  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.replace(
    regex,
    (match) => `<mark class="bg-yellow-300">${match}</mark>`
  );
};

export default function EmployeesPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredEmployees, setFilteredEmployees] =
    useState<Employee[]>(employees);

  // Filter logic
  useEffect(() => {
    let filtered = employees;

    if (searchTerm) {
      filtered = employees
        .filter((employee) =>
          [employee.name, employee.email, employee.position]
            .filter(Boolean)
            .some((value) =>
              value.toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
        .map((employee) => ({
          ...employee,
          highlightedFields: {
            name: highlightSearchTerm(employee.name, searchTerm),
            email: highlightSearchTerm(employee.email, searchTerm),
            position: highlightSearchTerm(employee.position, searchTerm),
          },
        }));
    }

    setFilteredEmployees(filtered);
  }, [searchTerm]);

  const handleViewProfile = (employeeId: string) => {
    router.push(`/dashboard/employees/${employeeId}`);
  };

  // Global Cmd + K hotkey
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
    <div className="px-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold">Employees</h2>
        <div className="flex flex-col sm:flex-row sm:space-x-4 gap-2 sm:gap-0">
          {/* Search Input */}
          <div className="relative w-full sm:w-auto">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && filteredEmployees.length > 0) {
                  handleViewProfile(filteredEmployees[0].id);
                }
                if (e.key === "Escape") {
                  setSearchTerm("");
                  inputRef.current?.blur();
                }
              }}
              className="pl-4 pr-20 py-2 rounded-md shadow-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 w-full"
            />
            {/* Cmd + K Visual */}
            <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <span className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded-md dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                  {navigator.platform.includes("Mac") ? "⌘" : "Ctrl"}
                </kbd>
                <span>+</span>
                <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded-md dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                  K
                </kbd>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Grid */}
      <motion.div
        className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
        }}
      >
        {filteredEmployees.map((employee) => (
          <motion.div
            key={employee.id}
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
                __html: employee.highlightedFields?.name || employee.name,
              }}
            />
            <p
              className="text-sm text-gray-600"
              dangerouslySetInnerHTML={{
                __html: employee.highlightedFields?.email || employee.email,
              }}
            />
            <p
              className="text-sm text-gray-600"
              dangerouslySetInnerHTML={{
                __html:
                  employee.highlightedFields?.position || employee.position,
              }}
            />
            <button
              onClick={() => handleViewProfile(employee.id)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              View Profile
            </button>
          </motion.div>
        ))}
      </motion.div>

      {/* No Employees Message */}
      {filteredEmployees.length === 0 && (
        <div className="text-center text-gray-600 mt-8">
          No employees found.
        </div>
      )}
    </div>
  );
}
