"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserCircleIcon } from "@heroicons/react/24/outline";

interface Customer {
  id: string;
  name: string;
  email?: string;
  company?: string;
}

// Dummy customer data for demonstration
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

const CustomersPage: React.FC = () => {
  const router = useRouter();

  const handleAddCustomer = () => {
    console.log("Add Customer Clicked");
    // You can implement add customer logic here (open modal, navigate to add form, etc.)
  };

  const handleViewProfile = (customerId: string) => {
    router.push(`/dashboard/customers/${customerId}`);
  };

  return (
    <div className="p-4 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Customers</h2>
        <button
          onClick={handleAddCustomer}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add Customer
        </button>
      </div>

      {/* Grid of Customer Cards (Contact style) */}
      <motion.div
        className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {customers.map((customer) => (
          <motion.div
            key={customer.id}
            variants={cardVariants}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center"
          >
            {/* Profile Image Placeholder */}
            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4">
              {/* Using Heroicons UserCircleIcon as a placeholder image */}
              <UserCircleIcon className="w-16 h-16 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
              {customer.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {customer.email || "No Email"}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {customer.company || "No Company"}
            </p>
            <button
              onClick={() => handleViewProfile(customer.id)}
              className="mt-auto inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition"
            >
              View Profile
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CustomersPage;
