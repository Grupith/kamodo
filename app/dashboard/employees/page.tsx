"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Breadcrumbs from "@/components/Breadcrumbs";

interface Employee {
  id: string;
  name: string;
  email?: string;
  position?: string;
  highlightedName?: string;
}

interface EmployeesPageProps {
  searchTerm: string;
  currentPage: string;
  highlightedName?: string;
}

// Dummy employee data for demonstration
const employees: Employee[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    position: "Project Manager",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    position: "Software Engineer",
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

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const highlightSearchTerm = (text: string, searchTerm: string) => {
  if (!searchTerm) return text;
  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.replace(regex, (match: string) => `<mark>${match}</mark>`);
};

const EmployeeList: React.FC<{ employees: Employee[]; searchTerm: string }> = ({
  employees,
  searchTerm,
}) => {
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const filtered = employees
      .filter((employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((employee) => ({
        ...employee,
        highlightedName: highlightSearchTerm(employee.name, searchTerm),
      }));
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  return (
    <div>
      {filteredEmployees.map((employee) => (
        <div
          key={employee.id}
          dangerouslySetInnerHTML={{ __html: employee.highlightedName || "" }}
        />
      ))}
    </div>
  );
};

const EmployeesPage: React.FC<EmployeesPageProps> = ({ searchTerm }) => {
  const router = useRouter();

  // State to manage filter and filtered employees
  const [filter, setFilter] = useState<string>("All");
  const [filteredEmployees, setFilteredEmployees] =
    useState<Employee[]>(employees);

  // Handle adding an employee
  const handleAddEmployee = () => {
    console.log("Add Employee Clicked");
  };

  // Handle viewing an employee profile
  const handleViewProfile = (employeeId: string) => {
    router.push(`/dashboard/employees/${employeeId}`);
  };

  // Filter employees based on position
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);

    if (selectedFilter === "All") {
      setFilteredEmployees(employees); // Show all employees
    } else {
      const filtered = employees.filter(
        (employee) => employee.position === selectedFilter
      );
      setFilteredEmployees(filtered);
    }
  };

  useEffect(() => {
    const filtered = employees.filter((employee) =>
      employee.name.toLowerCase().includes(searchTerm)
    );
    setFilteredEmployees(filtered);
  }, [searchTerm]);

  useEffect(() => {
    const filtered = employees.map((employee) => ({
      ...employee,
      highlightedName: highlightSearchTerm(employee.name, searchTerm),
    }));
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  return (
    <div className="p-4 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Header */}
      <Breadcrumbs />
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold">Employees</h2>
        <div className="flex flex-col sm:flex-row sm:space-x-4 gap-2 sm:gap-0">
          {/* Filter Dropdown */}
          <select
            value={filter}
            onChange={handleFilterChange}
            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600"
          >
            <option value="All">All Positions</option>
            <option value="Managers">Managers</option>
            <option value="Employees">Employees</option>
          </select>

          {/* Add Employee Button */}
          <button
            onClick={handleAddEmployee}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Invite Employee
          </button>
        </div>
      </div>

      {/* Grid of Employee Cards */}
      <motion.div
        className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredEmployees.map((employee) => (
          <motion.div
            key={employee.id}
            variants={cardVariants}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-6 flex flex-col items-center transform transition-transform hover:scale-105"
          >
            {/* Profile Image Placeholder */}
            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4">
              <UserCircleIcon className="w-16 h-16 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
              <span
                dangerouslySetInnerHTML={{
                  __html: employee.highlightedName || "",
                }}
              />
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {employee.email || "No Email"}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {employee.position || "No Position"}
            </p>
            <button
              onClick={() => handleViewProfile(employee.id)}
              className="mt-auto inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition"
            >
              View Profile
            </button>
          </motion.div>
        ))}
      </motion.div>

      {/* No Employees Message */}
      {filteredEmployees.length === 0 && (
        <div className="text-center text-gray-600 dark:text-gray-300 mt-8">
          No employees found for the selected filter.
        </div>
      )}
    </div>
  );
};

export default EmployeesPage;
