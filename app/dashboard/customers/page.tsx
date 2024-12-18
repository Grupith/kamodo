"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  AdjustmentsHorizontalIcon,
  UserCircleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { fetchCustomers } from "@/firebase/firestore";
import { useCompany } from "@/contexts/CompanyContext";
import Link from "next/link";
import Table from "@/components/Table";
import { useRouter } from "next/navigation";

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  organization?: string;
}

export default function CustomersPage() {
  const [view, setView] = useState<"cards" | "table">("cards");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const company = useCompany();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchAndSetCustomers = async () => {
      const companyId = company?.id || "";
      const fetchedCustomers = await fetchCustomers(companyId);

      if (fetchedCustomers.length === 0) {
        setCustomers([
          {
            id: "sample",
            name: "Sample Customer",
            email: "sample@example.com",
            phone: "555-555-5555",
            organization: "Sample Company",
          },
        ]);
      } else {
        setCustomers(fetchedCustomers);
      }
      setLoading(false);
    };

    fetchAndSetCustomers();
  }, [company?.id]);

  useEffect(() => {
    const filtered = customers.filter((customer) =>
      [customer.name, customer.email, customer.phone, customer.organization]
        .filter(Boolean)
        .some((value) =>
          value!.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    setFilteredCustomers(filtered);
  }, [customers, searchTerm]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filteredCustomers.length > 0) {
      // Navigate to the first matching customer's profile page
      router.push(`/dashboard/customers/${filteredCustomers[0].id}`);
    }
    if (e.key === "Escape") {
      // Clear search term and remove focus
      setSearchTerm("");
      inputRef.current?.blur();
    }
  };

  const toggleView = () =>
    setView((prev) => (prev === "cards" ? "table" : "cards"));

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold">Customers</h2>
        <div className="flex flex-col sm:flex-row sm:space-x-4 gap-4 sm:gap-0">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-4 pr-32 py-2 rounded-md shadow-md border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 w-full"
          />
          <div className="flex gap-4">
            <div
              onClick={toggleView}
              className="h-fit bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 p-2 cursor-pointer w-fit"
            >
              <AdjustmentsHorizontalIcon className="w-6 h-6" />
            </div>
            <Link href="/dashboard/customers/new" passHref>
              <button className="flex items-center px-4 py-2 text-md text-white bg-green-600 rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                <UserPlusIcon className="w-6 h-6 mr-2" />
                New
              </button>
            </Link>
          </div>
        </div>
      </div>

      {view === "cards" ? (
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
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-lg transform transition-all hover:scale-105 hover:shadow-xl"
            >
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-sky-500 flex items-center justify-center text-white shadow-md mb-4">
                  <UserCircleIcon className="w-12 h-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">
                  {customer.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {customer.email}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {customer.phone}
                </p>
              </div>
              <div className="mt-6 text-center">
                <Link href={`/dashboard/customers/${customer.id}`} passHref>
                  <button className="bg-blue-600 text-white px-5 py-2 text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
                    View Profile
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <Table
          data={filteredCustomers}
          columns={[
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "phone", label: "Phone" },
            { key: "organization", label: "Organization" },
          ]}
          onRowClick={(row) => router.push(`/dashboard/customers/${row.id}`)}
        />
      )}
    </div>
  );
}
