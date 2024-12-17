"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { UserCircleIcon } from "@heroicons/react/24/outline";

// Mock function to simulate fetching employee data from an API or database
async function fetchEmployeeData(employeeId: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockEmployees = [
        {
          id: "1",
          name: "Alice Johnson",
          email: "alice@example.com",
          position: "Project Manager",
          phone: "+1 (555) 123-4567",
          address: "123 Maple St, Springfield, USA",
          department: "Management",
          notes: "Excellent team leader with 5+ years of experience.",
          hireDate: "2020-05-15",
          salary: "$95,000",
        },
        {
          id: "2",
          name: "Bob Smith",
          email: "bob@example.com",
          position: "Software Engineer",
          phone: "+1 (555) 987-6543",
          address: "456 Pine St, Metropolis, USA",
          department: "Engineering",
          notes: "Specializes in full-stack development.",
          hireDate: "2019-08-20",
          salary: "$110,000",
        },
      ];
      const employee = mockEmployees.find((e) => e.id === employeeId);
      resolve(employee || null);
    }, 250); // Simulate a short delay
  });
}

interface Employee {
  id: string;
  name: string;
  email?: string;
  position?: string;
  phone?: string;
  address?: string;
  department?: string;
  notes?: string;
  hireDate?: string;
  salary?: string;
}

export default function EmployeeProfilePage() {
  const { employeeId } = useParams() as { employeeId: string };
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEmployee = async () => {
      const data = await fetchEmployeeData(employeeId);
      setEmployee(data as Employee | null);
      setLoading(false);
    };

    if (employeeId) {
      getEmployee();
    }
  }, [employeeId]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.1, ease: "easeOut" },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
        <p>Loading employee data...</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 p-4">
        <h2 className="text-2xl font-bold mb-4">Employee Not Found</h2>
        <p>We could not find an employee with the given ID.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen flex flex-col justify-start">
      <motion.div
        className="w-full max-w-6xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md p-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <div className="flex items-center mb-8">
          <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-6">
            <UserCircleIcon className="w-24 h-24 text-gray-400 dark:text-gray-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">{employee.name}</h1>
            <p className="text-lg text-blue-600 dark:text-blue-400">
              {employee.position || "No Position"}
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              {employee.department || "N/A"}
            </p>
          </div>
        </div>

        {/* Employee Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {employee.email && (
            <div className="p-4 bg-gray-50 border border-gray-200  dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-700 rounded-md shadow-md">
              <h3 className="font-semibold text-gray-600 dark:text-gray-300">
                Email
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                {employee.email}
              </p>
            </div>
          )}
          {employee.phone && (
            <div className="p-4 bg-gray-50 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-700 rounded-md shadow-md">
              <h3 className="font-semibold text-gray-600 dark:text-gray-300">
                Phone
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                {employee.phone}
              </p>
            </div>
          )}
          {employee.address && (
            <div className="p-4 bg-gray-50 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-700 rounded-md shadow-md">
              <h3 className="font-semibold text-gray-600 dark:text-gray-300">
                Address
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                {employee.address}
              </p>
            </div>
          )}
          {employee.hireDate && (
            <div className="p-4 bg-gray-50 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-700 rounded-md shadow-md">
              <h3 className="font-semibold text-gray-600 dark:text-gray-300">
                Hire Date
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                {employee.hireDate}
              </p>
            </div>
          )}
          {employee.salary && (
            <div className="p-4 bg-gray-50 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-700 rounded-md shadow-md">
              <h3 className="font-semibold text-gray-600 dark:text-gray-300">
                Salary
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                {employee.salary}
              </p>
            </div>
          )}
          {employee.notes && (
            <div className="col-span-1 md:col-span-2 p-4 bg-gray-50 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-700 rounded-md shadow-md">
              <h3 className="font-semibold text-gray-600 dark:text-gray-300">
                Notes
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                {employee.notes}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
