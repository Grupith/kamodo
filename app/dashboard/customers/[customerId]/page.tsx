"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { UserCircleIcon } from "@heroicons/react/24/outline";

// Mock function to simulate fetching customer data from an API or database
// Replace this with a real API call or Firestore query.
async function fetchCustomerData(customerId: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockCustomers = [
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          company: "ACME Inc.",
          phone: "+1 (555) 123-4567",
          address: "123 Elm St, Springfield, USA",
          notes: "VIP customer, prefers email communication.",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          company: "Globex Co.",
          phone: "+1 (555) 987-6543",
          address: "456 Oak St, Metropolis, USA",
          notes: "Interested in premium packages.",
        },
      ];
      const customer = mockCustomers.find((c) => c.id === customerId);
      resolve(customer || null);
    }, 1000); // Simulate a 1 second delay
  });
}

interface Customer {
  id: string;
  name: string;
  email?: string;
  company?: string;
  phone?: string;
  address?: string;
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
      transition: { duration: 0.5, ease: "easeOut" },
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 flex items-center justify-center text-gray-800 dark:text-gray-200">
      <motion.div
        className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-md w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4">
            <UserCircleIcon className="w-16 h-16 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-2xl font-bold mb-1">{customer.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {customer.company || "No Company"}
          </p>
        </div>

        <div className="space-y-4">
          {customer.email && (
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Email:
              </span>
              <a
                href={`mailto:${customer.email}`}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {customer.email}
              </a>
            </div>
          )}

          {customer.phone && (
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Phone:
              </span>
              <a
                href={`tel:${customer.phone}`}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {customer.phone}
              </a>
            </div>
          )}

          {customer.address && (
            <div className="flex flex-col">
              <span className="font-medium text-gray-600 dark:text-gray-300 mb-1">
                Address:
              </span>
              <p className="text-gray-700 dark:text-gray-200">
                {customer.address}
              </p>
            </div>
          )}

          {customer.notes && (
            <div className="flex flex-col">
              <span className="font-medium text-gray-600 dark:text-gray-300 mb-1">
                Notes:
              </span>
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
