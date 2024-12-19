"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { fetchEmployeeById, deleteEmployeeById } from "@/firebase/firestore";
import { useCompany } from "@/contexts/CompanyContext";
import { useModal } from "@/contexts/ModalContext";

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
  const { employeeId } = useParams();
  const router = useRouter();
  const company = useCompany();
  const { openModal, closeModal } = useModal();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEmployee = async () => {
      try {
        if (employeeId && company?.id) {
          const data = await fetchEmployeeById(
            company.id,
            Array.isArray(employeeId) ? employeeId[0] : employeeId
          );
          setEmployee(data as Employee | null);
        }
      } catch (error) {
        console.error("Failed to fetch employee data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (employeeId && company) {
      getEmployee();
    }
  }, [employeeId, company]);

  const handleDelete = () => {
    openModal(
      <>
        <p className="text-gray-700 dark:text-gray-200">
          Are you sure you want to delete this employee? This action cannot be
          undone.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
            onClick={async () => {
              try {
                if (company?.id && employeeId) {
                  await deleteEmployeeById(
                    company.id,
                    Array.isArray(employeeId) ? employeeId[0] : employeeId
                  );
                  console.log("Employee deleted successfully");
                  closeModal();
                  router.push("/dashboard/employees");
                }
              } catch (error) {
                console.error("Failed to delete employee:", error);
              }
            }}
          >
            Delete
          </button>
        </div>
      </>,
      "Confirm Deletion"
    );
  };

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

        {/* Delete Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700"
          >
            Delete Employee
          </button>
        </div>
      </motion.div>
    </div>
  );
}
