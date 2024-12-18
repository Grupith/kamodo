"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { UserCircleIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { fetchCustomers } from "@/firebase/firestore"; // Adjust the path to your Firestore functions
import { useCompany } from "@/contexts/CompanyContext";
import Link from "next/link";

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

const highlightSearchTerm = (text: string, searchTerm: string): string => {
  if (!searchTerm) return text;
  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.replace(
    regex,
    (match) => `<mark class="bg-yellow-300">${match}</mark>`
  );
};

export default function CustomersPage() {
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [filter, setFilter] = useState<string>("All");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const company = useCompany(); // Access current company context

  useEffect(() => {
    const fetchAndSetCustomers = async () => {
      const companyId = company?.id || "";
      const fetchedCustomers = await fetchCustomers(companyId);

      if (fetchedCustomers.length === 0) {
        // Add a sample customer only for UI display when there are no customers
        const sampleCustomer: Customer = {
          id: "sample-customer",
          name: "Sarah Sample",
          email: "sarah-sample532@gmail.com",
          company: "Sample Company",
        };
        setCustomers([sampleCustomer]);
      } else {
        setCustomers(fetchedCustomers);
      }
      setLoading(false);
    };

    fetchAndSetCustomers();
  }, [company?.id]);

  useEffect(() => {
    // Apply filters and search to the list of customers
    const applyFilters = () => {
      let filtered = [...customers];

      // Filter by company
      if (filter !== "All") {
        filtered = filtered.filter((customer) => customer.company === filter);
      }

      // Apply search term
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
    };

    applyFilters();
  }, [customers, searchTerm, filter]);

  if (loading) {
    return <div>Loading...</div>;
  }

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
              className="pl-4 pr-32 py-2 rounded-md shadow-md border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 w-full"
            />
          </div>

          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md shadow-md border border-gray-300 dark:border-gray-600 w-full sm:w-auto"
          >
            <option value="All">All Companies</option>
            <option value="ACME Inc.">ACME Inc.</option>
            <option value="Globex Co.">Globex Co.</option>
          </select>
          {/* Add customer */}
          <Link href="/dashboard/customers/new">
            <button className=" bg-blue-600 text-white px-4 py-2 flex rounded-md hover:bg-blue-700">
              <UserPlusIcon className="w-6 h-6 mr-2" />
              Add Customer
            </button>
          </Link>
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
            <Link href={`/dashboard/customers/${customer.id}`}>
              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                View Profile
              </button>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
