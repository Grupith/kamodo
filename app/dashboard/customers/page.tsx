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
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DataTable from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

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
  const { company, loading: companyLoading } = useCompany();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchAndSetCustomers = async () => {
      if (!company?.id) {
        // Skip if company ID is not available
        return;
      }

      try {
        const fetchedCustomers = await fetchCustomers(company.id);
        setCustomers(
          fetchedCustomers.length > 0
            ? fetchedCustomers
            : [
                {
                  id: "sample",
                  name: "Sample Customer",
                  email: "sample@example.com",
                  phone: "555-555-5555",
                  organization: "Sample Company",
                },
              ]
        );
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
        console.log("loading state, ", loading);
      }
    };

    if (!companyLoading && company?.id) {
      fetchAndSetCustomers();
    }
  }, [company?.id, companyLoading, loading]);

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
      router.push(`/dashboard/customers/${filteredCustomers[0].id}`);
    }
    if (e.key === "Escape") {
      setSearchTerm("");
      inputRef.current?.blur();
    }
  };

  const toggleView = () =>
    setView((prev) => (prev === "cards" ? "table" : "cards"));

  const columns: ColumnDef<Customer>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: "Name",
    },
    {
      id: "email",
      accessorKey: "email",
      header: "Email",
    },
    {
      id: "phone",
      accessorKey: "phone",
      header: "Phone",
    },
    {
      id: "organization",
      accessorKey: "organization",
      header: "Organization",
    },
  ];

  return (
    <div className="p-4 min-h-screen bg-background text-foreground">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold">Customers</h2>
        <div className="flex flex-col sm:flex-row sm:space-x-4 gap-4 sm:gap-0">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full"
          />
          <div className="flex gap-4">
            <Button variant="outline" size="icon" onClick={toggleView}>
              <AdjustmentsHorizontalIcon className="w-4 h-4" />
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/customers/new">
                <UserPlusIcon className="w-4 h-4 mr-2" />
                New
              </Link>
            </Button>
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
            >
              <Card className="transform transition-all hover:scale-105 bg-zinc-100 border dark:bg-zinc-900 text-card-foreground border-[var(--border)]">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-sky-500 flex items-center justify-center text-white shadow-md mb-4">
                      <UserCircleIcon className="w-12 h-12" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      {customer.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      {customer.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {customer.phone}
                    </p>
                  </div>
                  <div className="mt-6 text-center">
                    <Button
                      variant={"default"}
                      onClick={() =>
                        router.push(`/dashboard/customers/${customer.id}`)
                      }
                    >
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredCustomers}
          onRowClick={(row) => router.push(`/dashboard/customers/${row.id}`)}
        />
      )}
    </div>
  );
}
