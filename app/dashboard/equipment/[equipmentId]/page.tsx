"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { WrenchIcon } from "@heroicons/react/24/outline";
import { fetchEquipmentById } from "@/firebase/firestore"; // Adjust as necessary
import { useCompany } from "@/contexts/CompanyContext";

interface Equipment {
  id: string;
  name: string;
  type: string;
  serialNumber?: string;
  manufacturer?: string;
  purchaseDate?: string;
  warrantyExpiration?: string;
  notes?: string;
}

const sampleEquipment: Equipment[] = [
  {
    id: "sample",
    name: "Impact Drill",
    type: "Construction",
    serialNumber: "N/A",
    manufacturer: "DrillMaster",
    purchaseDate: "2023-01-01",
    warrantyExpiration: "2025-01-01",
    notes: "This is a sample item for demonstration purposes.",
  },
  {
    id: "sample2",
    name: "Job Site Radio",
    type: "Construction",
    serialNumber: "N/A",
    manufacturer: "RadioTech",
    purchaseDate: "2022-11-15",
    warrantyExpiration: "2024-11-15",
    notes: "Sample item to show equipment details.",
  },
  {
    id: "sample3",
    name: "Paint Sprayer",
    type: "Painting",
    serialNumber: "SPR12345",
    manufacturer: "PaintCo",
    purchaseDate: "2021-06-10",
    warrantyExpiration: "2023-06-10",
    notes: "Demonstration item for testing the equipment profile page.",
  },
];

export default function EquipmentProfilePage() {
  const { equipmentId } = useParams() as { equipmentId: string };
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const company = useCompany();

  useEffect(() => {
    console.log("Equipment ID:", equipmentId);
    console.log("Company Context:", company);

    const getEquipment = async () => {
      try {
        if (!company || !company.id || !equipmentId) {
          console.error("Missing required parameters: company or equipmentId");
          setLoading(false);
          return;
        }

        console.log("Checking for real equipment in Firestore...");
        const realEquipment = await fetchEquipmentById(company.id, equipmentId);

        if (realEquipment) {
          console.log("Real Equipment Found:", realEquipment);
          setEquipment(realEquipment as Equipment);
        } else if (equipmentId.startsWith("sample")) {
          console.log("No real equipment found, checking sample data...");
          const sampleItem = sampleEquipment.find(
            (item) => item.id === equipmentId
          );
          console.log("Sample Item Found:", sampleItem);
          setEquipment(sampleItem || null);
        } else {
          console.warn("No equipment found with the given ID.");
          setEquipment(null);
        }
      } catch (error) {
        console.error("Error fetching equipment data:", error);
        setEquipment(null);
      } finally {
        setLoading(false);
      }
    };

    getEquipment();
  }, [equipmentId, company]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
        <p>Loading equipment data...</p>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 p-4">
        <h2 className="text-2xl font-bold mb-4">Equipment Not Found</h2>
        <p>We could not find equipment with the given ID.</p>
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
            <WrenchIcon className="w-20 h-20 text-gray-400 dark:text-gray-500" />
          </div>
          <h1 className="text-2xl font-bold mt-4">{equipment.name}</h1>
          <p className="text-lg">{equipment.type || "No Type"}</p>
        </div>

        {/* Equipment Details */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {equipment.serialNumber && (
            <div className="flex flex-col">
              <h3 className="font-semibold text-gray-600 dark:text-gray-300">
                Serial Number
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                {equipment.serialNumber}
              </p>
            </div>
          )}
          {equipment.manufacturer && (
            <div className="flex flex-col">
              <h3 className="font-semibold text-gray-600 dark:text-gray-300">
                Manufacturer
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                {equipment.manufacturer}
              </p>
            </div>
          )}
          {equipment.purchaseDate && (
            <div className="flex flex-col">
              <h3 className="font-semibold text-gray-600 dark:text-gray-300">
                Purchase Date
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                {equipment.purchaseDate}
              </p>
            </div>
          )}
          {equipment.warrantyExpiration && (
            <div className="flex flex-col">
              <h3 className="font-semibold text-gray-600 dark:text-gray-300">
                Warranty Expiration
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                {equipment.warrantyExpiration}
              </p>
            </div>
          )}
          {equipment.notes && (
            <div className="col-span-1 md:col-span-2 flex flex-col">
              <h3 className="font-semibold text-gray-600 dark:text-gray-300">
                Notes
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                {equipment.notes}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
