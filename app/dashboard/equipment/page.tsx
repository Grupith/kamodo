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
import Table from "@/components/Table";
import { getEquipmentForCompany } from "@/firebase/firestore"; // Replace with actual function
import { useCompany } from "@/contexts/CompanyContext";
import { useAuth } from "@/contexts/AuthContext";

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
  const company = useCompany();
  const { user } = useAuth();

  useEffect(() => {
    const fetchAndSetEquipment = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch equipment for the logged-in user's company
        const companyId = company?.id || "";
        const fetchedEquipment = await getEquipmentForCompany(companyId);
        const equipmentWithDefaults: Equipment[] = fetchedEquipment.map(
          (item) => ({
            id: item.id,
            name: (item as Equipment).name || "Unknown",
            type: (item as Equipment).type || "Unknown",
            serialNumber: (item as Equipment).serialNumber || "N/A",
          })
        );
        if (fetchedEquipment.length === 0) {
          setEquipment([
            {
              id: "sample",
              name: "Impact Drill",
              type: "Construction",
              serialNumber: "N/A",
            },
            {
              id: "sample2",
              name: "Job Site Radio",
              type: "Construction",
              serialNumber: "N/A",
            },
            {
              id: "sample3",
              name: "Paint Sprayer",
              type: "Painting",
              serialNumber: "N/A",
            },
          ]);
        } else {
          setEquipment(equipmentWithDefaults);
        }
        console.log("Equipment fetched", fetchedEquipment.length);
      } catch (error) {
        console.error("Error fetching equipment:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetEquipment();
  }, [user, company?.id]);

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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold">Equipment</h2>
        <div className="flex flex-col sm:flex-row sm:space-x-4 gap-4 sm:gap-0">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search equipment..."
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
            <Link href="/dashboard/equipment/new" passHref>
              <button className="flex items-center px-4 py-2 text-md text-white bg-green-600 rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                <PlusCircleIcon className="w-6 h-6 mr-2" />
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
          {filteredEquipment.map((item) => (
            <motion.div
              key={item.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-lg transform transition-all hover:scale-105 hover:shadow-xl"
            >
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-green-500 to-emerald-500 flex items-center justify-center text-white shadow-md mb-4">
                  <CubeIcon className="w-12 h-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {item.type}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Serial: {item.serialNumber}
                </p>
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={() => router.push(`/dashboard/equipment/${item.id}`)}
                  className="bg-blue-600 text-white px-5 py-2 text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                >
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <Table
          data={filteredEquipment}
          columns={[
            { key: "name", label: "Name" },
            { key: "type", label: "Type" },
            { key: "serialNumber", label: "Serial Number" },
          ]}
          onRowClick={(row) => router.push(`/dashboard/equipment/${row.id}`)}
        />
      )}
    </div>
  );
}
