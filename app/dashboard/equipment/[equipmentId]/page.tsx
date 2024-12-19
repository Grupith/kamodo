"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { WrenchIcon } from "@heroicons/react/24/outline";
import { fetchEquipmentById, deleteEquipmentById } from "@/firebase/firestore";
import { useCompany } from "@/contexts/CompanyContext";
import { useModal } from "@/contexts/ModalContext";

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

export default function EquipmentProfilePage() {
  const { equipmentId } = useParams();
  const router = useRouter();
  const company = useCompany();
  const { openModal, closeModal } = useModal();

  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEquipment = async () => {
      try {
        if (equipmentId && company?.id) {
          const data = await fetchEquipmentById(
            company.id,
            Array.isArray(equipmentId) ? equipmentId[0] : equipmentId
          );
          setEquipment(data as Equipment | null);
        }
      } catch (error) {
        console.error("Failed to fetch equipment data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (equipmentId && company) {
      getEquipment();
    }
  }, [equipmentId, company]);

  const handleDelete = () => {
    openModal(
      <>
        <p className="text-gray-700 dark:text-gray-200">
          Are you sure you want to delete this equipment? This action cannot be
          undone.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
            onClick={async () => {
              try {
                if (company?.id && equipmentId) {
                  await deleteEquipmentById(
                    company.id,
                    Array.isArray(equipmentId) ? equipmentId[0] : equipmentId
                  );
                  console.log("Equipment deleted successfully");
                  closeModal();
                  router.push("/dashboard/equipment");
                }
              } catch (error) {
                console.error("Failed to delete equipment:", error);
              }
            }}
          >
            Delete
          </button>
        </div>
      </>,
      "Confirm Deletion"
    );
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.1, ease: "easeOut" },
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
              {equipment.type || "No Type"}
            </p>
          </div>
        </div>

        {/* Equipment Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {equipment.serialNumber && (
            <div className="p-4 bg-gray-50 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-700 rounded-md shadow-md">
              <h3 className="font-semibold text-gray-600 dark:text-gray-300">
                Serial Number
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                {equipment.serialNumber}
              </p>
            </div>
          )}
          {equipment.manufacturer && (
            <div className="p-4 bg-gray-50 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-700 rounded-md shadow-md">
              <h3 className="font-semibold text-gray-600 dark:text-gray-300">
                Manufacturer
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                {equipment.manufacturer}
              </p>
            </div>
          )}
          {equipment.purchaseDate && (
            <div className="p-4 bg-gray-50 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-700 rounded-md shadow-md">
              <h3 className="font-semibold text-gray-600 dark:text-gray-300">
                Purchase Date
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                {equipment.purchaseDate}
              </p>
            </div>
          )}
          {equipment.warrantyExpiration && (
            <div className="p-4 bg-gray-50 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-700 rounded-md shadow-md">
              <h3 className="font-semibold text-gray-600 dark:text-gray-300">
                Warranty Expiration
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                {equipment.warrantyExpiration}
              </p>
            </div>
          )}
          {equipment.notes && (
            <div className="col-span-1 md:col-span-2 p-4 bg-gray-50 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-700 rounded-md shadow-md">
              <h3 className="font-semibold text-gray-600 dark:text-gray-300">
                Notes
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                {equipment.notes}
              </p>
            </div>
          )}
        </div>

        {/* Delete Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700"
          >
            Delete Equipment
          </button>
        </div>
      </motion.div>
    </div>
  );
}
