"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Breadcrumbs from "@/components/Breadcrumbs";

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
  {
    id: "5",
    name: "Michael Brown",
    email: "michael@example.com",
    company: "Globex Co.",
  },
  {
    id: "6",
    name: "David Green",
    email: "david.green@example.com",
    company: "ACME Inc.",
  },
  {
    id: "7",
    name: "Emma White",
    email: "emma.white@example.com",
    company: "Umbrella Corp.",
  },
  {
    id: "8",
    name: "Oliver Black",
    email: "oliver.black@example.com",
    company: "Soylent Corp.",
  },
  {
    id: "9",
    name: "Sophia Davis",
    email: "sophia.davis@example.com",
    company: "Wayne Enterprises",
  },
  {
    id: "10",
    name: "Lucas Gray",
    email: "lucas.gray@example.com",
    company: "Initech",
  },
  {
    id: "11",
    name: "Mia Scott",
    email: "mia.scott@example.com",
    company: "Globex Co.",
  },
  {
    id: "12",
    name: "Ethan Clark",
    email: "ethan.clark@example.com",
    company: "ACME Inc.",
  },
  {
    id: "13",
    name: "Isabella Hill",
    email: "isabella.hill@example.com",
    company: "Cyberdyne Systems",
  },
  {
    id: "14",
    name: "William Hall",
    email: "william.hall@example.com",
    company: "ACME Inc.",
  },
  {
    id: "15",
    name: "Charlotte King",
    email: "charlotte.king@example.com",
    company: "Umbrella Corp.",
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

interface HighlightSearchTerm {
  (text: string, searchTerm: string): string;
}

const highlightSearchTerm: HighlightSearchTerm = (text, searchTerm) => {
  if (!searchTerm) return text;
  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.replace(regex, (match) => `<mark>${match}</mark>`);
};

interface CustomerListProps {
  customers: Customer[];
  searchTerm: string;
}

const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  searchTerm,
}) => {
  const [filteredCustomers, setFilteredCustomers] = useState<
    (Customer & { highlightedName: string })[]
  >([]);

  useEffect(() => {
    const filtered = customers
      .filter((customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((customer) => ({
        ...customer,
        highlightedName: highlightSearchTerm(customer.name, searchTerm),
      }));
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  return (
    <div>
      {filteredCustomers.map((customer) => (
        <div
          key={customer.id}
          dangerouslySetInnerHTML={{ __html: customer.highlightedName }}
        />
      ))}
    </div>
  );
};

const CustomersPage: React.FC = () => {
  const router = useRouter();

  // State to manage filter and filtered customers
  const [filter, setFilter] = useState<string>("All");
  const [filteredCustomers, setFilteredCustomers] =
    useState<Customer[]>(customers);

  // Handle Add Customer
  const handleAddCustomer = () => {
    console.log("Add Customer Clicked");
  };

  // Handle Filter Logic
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);

    if (selectedFilter === "All") {
      setFilteredCustomers(customers); // Reset to all customers
    } else {
      const filtered = customers.filter(
        (customer) => customer.company === selectedFilter
      );
      setFilteredCustomers(filtered);
    }
  };

  const handleViewProfile = (customerId: string) => {
    router.push(`/dashboard/customers/${customerId}`);
  };

  return (
    <div className="p-4 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Header */}
      <Breadcrumbs />
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold">Customers</h2>
        <div className="flex flex-col sm:flex-row sm:space-x-4 gap-2 sm:gap-0">
          {/* Filter Dropdown */}
          <select
            value={filter}
            onChange={handleFilterChange}
            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 w-full sm:w-auto"
          >
            <option value="All">All Companies</option>
            <option value="ACME Inc.">ACME Inc.</option>
            <option value="Globex Co.">Globex Co.</option>
            <option value="Soylent Corp.">Soylent Corp.</option>
            <option value="Initech">Initech</option>
          </select>

          {/* Add Customer Button */}
          <button
            onClick={handleAddCustomer}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full sm:w-auto"
          >
            Add Customer
          </button>
        </div>
      </div>

      {/* Grid of Customer Cards */}
      <motion.div
        className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredCustomers.map((customer) => (
          <motion.div
            key={customer.id}
            variants={cardVariants}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-6 flex flex-col items-center transform transition-transform hover:scale-105"
          >
            {/* Profile Image Placeholder */}
            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4">
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

      {/* No Customers Message */}
      {filteredCustomers.length === 0 && (
        <div className="text-center text-gray-600 dark:text-gray-300 mt-8">
          No customers found for the selected filter.
        </div>
      )}
    </div>
  );
};

export default CustomersPage;
