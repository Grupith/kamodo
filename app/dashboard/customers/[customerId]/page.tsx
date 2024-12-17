"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { UserCircleIcon } from "@heroicons/react/24/outline";

// Mock function to simulate fetching customer data from an API or database
async function fetchCustomerData(customerId: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockCustomers = [
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          phone: "+1 (555) 123-4567",
          address: "123 Elm St, Springfield, USA",
          company: "ACME Inc.",
          accountCreation: "2022-03-15",
          notes: "Priority customer. Prefers email communication.",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "+1 (555) 987-6543",
          address: "456 Pine St, Metropolis, USA",
          company: "Globex Co.",
          accountCreation: "2021-11-10",
          notes: "Interested in premium support packages.",
        },
      ];
      const customer = mockCustomers.find((c) => c.id === customerId);
      resolve(customer || null);
    }, 250); // Simulate a short delay
  });
}

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string;
  accountCreation?: string;
  notes?: string;
}

export default function CustomerProfilePage() {
  const { customerId } = useParams() as { customerId: string };
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCustomer = async () => {
      const data = await fetchCustomerData(customerId);
      setCustomer(data as Customer | null);
      setLoading(false);
    };

    if (customerId) {
      getCustomer();
    }
  }, [customerId]);

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
        <p>Loading customer data...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 p-4">
        <h2 className="text-2xl font-bold mb-4">Customer Not Found</h2>
        <p>We could not find a customer with the given ID.</p>
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
            <h1 className="text-2xl font-bold mb-2">{customer.name}</h1>
            <p className="text-lg text-blue-600 dark:text-blue-400">
              {customer.company || "No Company"}
            </p>
          </div>
        </div>

        {/* Customer Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {customer.email && (
            <div className="p-4 bg-gray-50 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-md">
              <h3 className="font-semibold text-gray-600 dark:text-gray-300">
                Email
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                {customer.email}
              </p>
            </div>
          )}
          {customer.phone && (
            <div className="p-4 bg-gray-50 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-md">
              <h3 className="font-semibold text-gray-600 dark:text-gray-300">
                Phone
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                {customer.phone}
              </p>
            </div>
          )}
          {customer.address && (
            <div className="p-4 bg-gray-50 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-md">
              <h3 className="font-semibold text-gray-600 dark:text-gray-300">
                Address
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                {customer.address}
              </p>
            </div>
          )}
          {customer.accountCreation && (
            <div className="p-4 bg-gray-50 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-md">
              <h3 className="font-semibold text-gray-600 dark:text-gray-300">
                Account Created
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                {customer.accountCreation}
              </p>
            </div>
          )}
          {customer.notes && (
            <div className="col-span-1 md:col-span-2 p-4 bg-gray-50 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-md">
              <h3 className="font-semibold text-gray-600 dark:text-gray-300">
                Notes
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                {customer.notes}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
