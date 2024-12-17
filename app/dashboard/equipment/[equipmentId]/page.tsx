"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { WrenchIcon } from "@heroicons/react/24/outline";

// Mock function to simulate fetching equipment data from an API or database
async function fetchEquipmentData(equipmentId: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockEquipment = [
        {
          id: "1",
          name: "Excavator",
          serialNumber: "EXC12345",
          location: "Site A",
          purchaseDate: "2020-01-15",
          condition: "Good",
          notes: "Regular maintenance required every 3 months.",
        },
        {
          id: "2",
          name: "Bulldozer",
          serialNumber: "BULL5678",
          location: "Site B",
          purchaseDate: "2019-06-20",
          condition: "Excellent",
          notes: "Recently serviced and in peak condition.",
        },
      ];
      const equipment = mockEquipment.find((e) => e.id === equipmentId);
      resolve(equipment || null);
    }, 250); // Simulate a short delay
  });
}

interface Equipment {
  id: string;
  name: string;
  serialNumber?: string;
  location?: string;
  purchaseDate?: string;
  condition?: string;
  notes?: string;
}

export default function EquipmentProfilePage() {
  const { equipmentId } = useParams() as { equipmentId: string };
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEquipment = async () => {
      const data = await fetchEquipmentData(equipmentId);
      setEquipment(data as Equipment | null);
      setLoading(false);
    };

    if (equipmentId) {
      getEquipment();
    }
  }, [equipmentId]);

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
    <div className="p-4 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen flex flex-col justify-start">
      <motion.div
        className="w-full max-w-6xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md p-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <div className="flex items-center mb-8">
          <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-6">
            <WrenchIcon className="w-24 h-24 text-gray-400 dark:text-gray-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">{equipment.name}</h1>
            <p className="text-lg text-blue-600 dark:text-blue-400">
              {equipment.serialNumber || "No Serial Number"}
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              {equipment.location || "Location Unknown"}
            </p>
          </div>
        </div>

        {/* Equipment Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {equipment.purchaseDate && (
            <div className="p-4 bg-gray-50 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-md">
              <h3 className="font-semibold text-gray-600 dark:text-gray-300">
                Purchase Date
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                {equipment.purchaseDate}
              </p>
            </div>
          )}
          {equipment.condition && (
            <div className="p-4 bg-gray-50 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-md">
              <h3 className="font-semibold text-gray-600 dark:text-gray-300">
                Condition
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                {equipment.condition}
              </p>
            </div>
          )}
          {equipment.location && (
            <div className="p-4 bg-gray-50 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-md">
              <h3 className="font-semibold text-gray-600 dark:text-gray-300">
                Location
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                {equipment.location}
              </p>
            </div>
          )}
          {equipment.notes && (
            <div className="col-span-1 md:col-span-2 p-4 bg-gray-50 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-md">
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
