"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchCustomerById } from "@/firebase/firestore"; // Update the import as needed
import { useCompany } from "@/contexts/CompanyContext";
import { UserCircleIcon } from "@heroicons/react/24/outline";

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
  const { customerId: id } = useParams(); // Extract the dynamic route parameter
  const company = useCompany(); // Access the current company context

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (id && company?.id) {
        try {
          const customerData = (await fetchCustomerById(
            company.id,
            id as string
          )) as Customer; // Pass companyId and customerId
          setCustomer(customerData);
        } catch (error) {
          console.error("Failed to fetch customer:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCustomerData();
  }, [id, company]);

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-8">
      <motion.div
        className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Profile Header */}
        <div className="flex flex-col items-center p-8 bg-blue-600 text-white">
          <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <UserCircleIcon className="w-20 h-20 text-gray-400 dark:text-gray-500" />
          </div>
          <h1 className="text-2xl font-bold mt-4">{customer.name}</h1>
          <p className="text-lg">{customer.company || "No Company"}</p>
        </div>

        {/* Customer Details */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {customer.email && (
            <div className="flex flex-col">
              <h3 className="font-semibold text-gray-600 dark:text-gray-300">
                Email
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                {customer.email}
              </p>
            </div>
          )}
          {customer.phone && (
            <div className="flex flex-col">
              <h3 className="font-semibold text-gray-600 dark:text-gray-300">
                Phone
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                {customer.phone}
              </p>
            </div>
          )}
          {customer.address && (
            <div className="flex flex-col">
              <h3 className="font-semibold text-gray-600 dark:text-gray-300">
                Address
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                {customer.address}
              </p>
            </div>
          )}
          {customer.accountCreation && (
            <div className="flex flex-col">
              <h3 className="font-semibold text-gray-600 dark:text-gray-300">
                Account Created
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                {customer.accountCreation}
              </p>
            </div>
          )}
          {customer.notes && (
            <div className="col-span-1 md:col-span-2 flex flex-col">
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
