"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { WrenchIcon } from "@heroicons/react/24/outline";

interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  location: string;
  highlightedFields?: {
    name: string;
    serialNumber: string;
    location: string;
  };
}

// Dummy equipment data for demonstration
const equipmentList: Equipment[] = [
  { id: "1", name: "Excavator", serialNumber: "EXC12345", location: "Site A" },
  { id: "2", name: "Bulldozer", serialNumber: "BULL5678", location: "Site B" },
  { id: "3", name: "Crane", serialNumber: "CRN91011", location: "Site C" },
  { id: "4", name: "Forklift", serialNumber: "FLK1213", location: "Warehouse" },
  { id: "5", name: "Generator", serialNumber: "GEN1415", location: "Site A" },
];

// Highlight search terms
const highlightSearchTerm = (text: string, searchTerm: string): string => {
  if (!searchTerm) return text;
  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.replace(
    regex,
    (match) => `<mark class="bg-yellow-300">${match}</mark>`
  );
};

export default function EquipmentPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filter, setFilter] = useState<string>("All");
  const [filteredEquipment, setFilteredEquipment] =
    useState<Equipment[]>(equipmentList);

  // Filter and search logic
  useEffect(() => {
    let filtered = equipmentList;

    if (filter !== "All") {
      filtered = filtered.filter((equipment) => equipment.location === filter);
    }

    if (searchTerm) {
      filtered = filtered
        .filter((equipment) =>
          [equipment.name, equipment.serialNumber, equipment.location]
            .filter(Boolean)
            .some((value) =>
              value.toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
        .map((equipment) => ({
          ...equipment,
          highlightedFields: {
            name: highlightSearchTerm(equipment.name, searchTerm),
            serialNumber: highlightSearchTerm(
              equipment.serialNumber,
              searchTerm
            ),
            location: highlightSearchTerm(equipment.location, searchTerm),
          },
        }));
    }

    setFilteredEquipment(filtered);
  }, [searchTerm, filter]);

  const handleViewProfile = (equipmentId: string) => {
    router.push(`/dashboard/equipment/${equipmentId}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filteredEquipment.length > 0) {
      handleViewProfile(filteredEquipment[0].id);
    }
    if (e.key === "Escape") {
      setSearchTerm("");
      inputRef.current?.blur();
    }
  };

  // Cmd + K functionality
  useEffect(() => {
    const handleGlobalKeydown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleGlobalKeydown);
    return () => window.removeEventListener("keydown", handleGlobalKeydown);
  }, []);

  return (
    <div className="px-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold">Equipment</h2>
        <div className="flex flex-col sm:flex-row sm:space-x-4 gap-2 sm:gap-0">
          {/* Search Input */}
          <div className="relative w-full sm:w-auto">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-4 pr-20 py-2 rounded-md shadow-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 w-full"
            />
            <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <span className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-200 border rounded-md dark:bg-gray-600 dark:text-gray-100">
                  {navigator.platform.includes("Mac") ? "⌘" : "Ctrl"}
                </kbd>
                <span>+</span>
                <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-200 border rounded-md dark:bg-gray-600 dark:text-gray-100">
                  K
                </kbd>
              </span>
            </div>
          </div>

          {/* Filter Dropdown */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 w-full sm:w-auto"
          >
            <option value="All">All Locations</option>
            <option value="Site A">Site A</option>
            <option value="Site B">Site B</option>
            <option value="Site C">Site C</option>
            <option value="Warehouse">Warehouse</option>
          </select>
        </div>
      </div>

      {/* Equipment Grid */}
      <motion.div
        className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
        }}
      >
        {filteredEquipment.map((equipment) => (
          <motion.div
            key={equipment.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-md hover:scale-105 transition-transform"
          >
            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4">
              <WrenchIcon className="w-16 h-16 text-gray-400" />
            </div>
            <h3
              className="text-xl font-semibold mb-1"
              dangerouslySetInnerHTML={{
                __html: equipment.highlightedFields?.name || equipment.name,
              }}
            />
            <p
              className="text-sm text-gray-600"
              dangerouslySetInnerHTML={{
                __html:
                  equipment.highlightedFields?.serialNumber ||
                  equipment.serialNumber,
              }}
            />
            <p
              className="text-sm text-gray-600"
              dangerouslySetInnerHTML={{
                __html:
                  equipment.highlightedFields?.location || equipment.location,
              }}
            />
            <button
              onClick={() => handleViewProfile(equipment.id)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              View Details
            </button>
          </motion.div>
        ))}
      </motion.div>

      {/* No Equipment Message */}
      {filteredEquipment.length === 0 && (
        <div className="text-center text-gray-600 mt-8">
          No equipment found.
        </div>
      )}
    </div>
  );
}
