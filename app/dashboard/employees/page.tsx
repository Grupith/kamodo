"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  AdjustmentsHorizontalIcon,
  UserCircleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getEmployeesForCompany } from "@/firebase/firestore";
import { useCompany } from "@/contexts/CompanyContext";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DataTable from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

interface Employee {
  id: string;
  name?: string;
  title?: string;
  email?: string;
  phone?: string;
}

export default function EmployeesPage() {
  const [view, setView] = useState<"cards" | "table">("cards");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const { company, loading: companyLoading } = useCompany();
  const { user } = useAuth();

  useEffect(() => {
    const fetchAndSetEmployees = async () => {
      if (!company?.id) return; // Skip fetching if no company ID
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const fetchedEmployees = (await getEmployeesForCompany(
          company.id
        )) as Employee[];
        const employeesWithDefaults: Employee[] = fetchedEmployees.map(
          (employee) => ({
            id: employee.id,
            name: employee.name || "Unknown",
            email: employee.email || "Unknown",
            phone: employee.phone || "Unknown",
            title: employee.title || "Unknown",
          })
        );

        setEmployees(
          employeesWithDefaults.length > 0
            ? employeesWithDefaults
            : [
                {
                  id: "sample",
                  name: "Sample Employee",
                  title: "Sample Title",
                  email: "sample@example.com",
                  phone: "555-555-5555",
                },
              ]
        );

        console.log("Employees fetched:", fetchedEmployees.length);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
        console.log("loading state, ", loading);
      }
    };

    if (!companyLoading && company?.id) fetchAndSetEmployees();
  }, [user, company?.id, companyLoading, loading]);

  useEffect(() => {
    const filtered = employees.filter((employee) =>
      [employee.name, employee.title, employee.email, employee.phone]
        .filter(Boolean)
        .some((value) =>
          value?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    setFilteredEmployees(filtered);
  }, [employees, searchTerm]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filteredEmployees.length > 0) {
      router.push(`/dashboard/employees/${filteredEmployees[0].id}`);
    }
    if (e.key === "Escape") {
      setSearchTerm("");
      inputRef.current?.blur();
    }
  };

  const toggleView = () =>
    setView((prev) => (prev === "cards" ? "table" : "cards"));

  const columns: ColumnDef<Employee>[] = [
    { id: "name", accessorKey: "name", header: "Name" },
    { id: "title", accessorKey: "title", header: "Title" },
    { id: "email", accessorKey: "email", header: "Email" },
    { id: "phone", accessorKey: "phone", header: "Phone" },
  ];

  return (
    <div className="p-4 min-h-screen bg-background text-foreground">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold">Employees</h2>
        <div className="flex flex-col sm:flex-row sm:space-x-4 gap-4 sm:gap-0">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full"
          />
          <div className="flex gap-4">
            <Button variant="outline" size="icon" onClick={toggleView}>
              <AdjustmentsHorizontalIcon className="w-4 h-4" />
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/employees/new">
                <UserPlusIcon className="w-4 h-4" />
                Add
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
          {filteredEmployees.map((employee) => (
            <motion.div
              key={employee.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Card className="transform transition-all hover:scale-105 border bg-zinc-100 dark:bg-zinc-900 text-card-foreground border-[var(--border)]">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-sky-500 flex items-center justify-center text-white shadow-md mb-4">
                      <UserCircleIcon className="w-12 h-12" />
                    </div>

                    {/* Name */}
                    <h3 className="text-lg font-medium mb-2">
                      {employee.name}
                    </h3>

                    {/* Title */}
                    <p className="text-sm text-muted-foreground mb-1">
                      {employee.title || "No Title"}
                    </p>

                    {/* Email */}
                    <p className="text-sm text-muted-foreground mb-1">
                      {employee.email}
                    </p>

                    {/* Phone */}
                    <p className="text-sm text-muted-foreground mb-1">
                      {employee.phone}
                    </p>
                  </div>

                  {/* View Profile Button */}
                  <div className="mt-6 text-center">
                    <Button
                      variant={"default"}
                      onClick={() =>
                        router.push(`/dashboard/employees/${employee.id}`)
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
          data={filteredEmployees}
          onRowClick={(row) => router.push(`/dashboard/employees/${row.id}`)}
        />
      )}
    </div>
  );
}
