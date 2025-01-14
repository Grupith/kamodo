"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  AdjustmentsHorizontalIcon,
  CubeIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getEquipmentForCompany } from "@/firebase/firestore";
import { useCompany } from "@/contexts/CompanyContext";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DataTable from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Equipment {
  id: string;
  name: string;
  type: string;
  serialNumber: string;
}

export default function EquipmentPage() {
  const [view, setView] = useState<"cards" | "table">("cards");
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const { company, loading: companyLoading } = useCompany();
  const { user } = useAuth();

  useEffect(() => {
    const fetchAndSetEquipment = async () => {
      // Ensure user and company are loaded
      if (!user || !company?.id) {
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching equipment for company ID:", company.id);
        const fetchedEquipment = await getEquipmentForCompany(company.id);
        const equipmentWithDefaults = fetchedEquipment.map((item) => ({
          id: item.id,
          name: item.name || "Unknown",
          type: item.type || "Unknown",
          serialNumber: item.serialNumber || "N/A",
        }));
        setEquipment(equipmentWithDefaults);
        console.log("Equipment fetched:", fetchedEquipment.length);
      } catch (error) {
        console.error("Error fetching equipment:", error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch equipment when company and user are fully loaded
    if (!companyLoading && company?.id && user) {
      fetchAndSetEquipment();
    }
  }, [user, company?.id, companyLoading]);

  useEffect(() => {
    const filtered = equipment.filter((item) =>
      [item.name, item.type, item.serialNumber]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredEquipment(filtered);
  }, [equipment, searchTerm]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filteredEquipment.length > 0) {
      router.push(`/dashboard/equipment/${filteredEquipment[0].id}`);
    }
    if (e.key === "Escape") {
      setSearchTerm("");
      inputRef.current?.blur();
    }
  };

  const toggleView = () =>
    setView((prev) => (prev === "cards" ? "table" : "cards"));

  const columns: ColumnDef<Equipment>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: "Name",
    },
    {
      id: "type",
      accessorKey: "type",
      header: "Type",
    },
    {
      id: "serialNumber",
      accessorKey: "serialNumber",
      header: "Serial Number",
    },
  ];

  if (loading) return <div>Loading...</div>;

  if (!company?.id) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold">No Company Found</h2>
        <p>Please ensure you are associated with a company.</p>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="p-4 min-h-screen bg-background text-foreground">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold">Equipment</h2>
          <div className="flex flex-col sm:flex-row sm:space-x-4 gap-4 sm:gap-0">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search equipment..."
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
                <Link href="/dashboard/equipment/new">
                  <PlusCircleIcon className="w-4 h-4 mr-2" />
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
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {filteredEquipment.map((item) => (
              <motion.div
                key={item.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Card className="transform transition-all hover:scale-105 border bg-zinc-100 dark:bg-zinc-900 text-card-foreground border-[var(--border)]">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-green-500 to-emerald-500 flex items-center justify-center text-white shadow-md mb-4">
                        <CubeIcon className="w-12 h-12" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mb-1">
                        {item.type}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Serial: {item.serialNumber}
                      </p>
                    </div>
                    <div className="mt-6 text-center">
                      <Button
                        variant={"default"}
                        onClick={() =>
                          router.push(`/dashboard/equipment/${item.id}`)
                        }
                      >
                        View Details
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
            data={filteredEquipment}
            onRowClick={(row) => router.push(`/dashboard/equipment/${row.id}`)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
