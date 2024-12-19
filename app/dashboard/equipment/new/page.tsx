"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { useCompany } from "@/contexts/CompanyContext";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase/firebase"; // Adjust path to your Firebase config
import { useRouter } from "next/navigation";
import { DocumentCheckIcon } from "@heroicons/react/24/outline";

interface EquipmentFormData {
  name: string;
  type: string;
  serialNumber: string;
  manufacturer: string;
  purchaseDate: string;
  warrantyExpiration: string;
  notes: string;
}

export default function AddEquipmentPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EquipmentFormData>();
  const company = useCompany(); // Access current company context
  const { user } = useAuth();
  const router = useRouter();

  const onSubmit = async (data: EquipmentFormData) => {
    const companyRef = company?.id; // Access company id directly
    if (!companyRef || !user) {
      console.error("No company or user information available");
      return;
    }

    try {
      const equipmentRef = collection(db, "companies", companyRef, "equipment");
      await addDoc(equipmentRef, {
        ...data,
        createdAt: new Date(),
        createdBy: user.uid,
      });
      console.log("Equipment added successfully");
      router.push("/dashboard/equipment");
      reset(); // Clear the form
    } catch (error) {
      console.error("Error adding Equipment:", error);
    }
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen flex justify-center items-center">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Add New Equipment
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Equipment Name
            </label>
            <input
              {...register("name", { required: "Equipment name is required" })}
              type="text"
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              placeholder="Enter equipment name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Equipment Type
            </label>
            <input
              {...register("type", { required: "Equipment type is required" })}
              type="text"
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              placeholder="Enter equipment type"
            />
            {errors.type && (
              <p className="text-red-500 text-sm">{errors.type.message}</p>
            )}
          </div>

          {/* Serial Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Serial Number
            </label>
            <input
              {...register("serialNumber")}
              type="text"
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              placeholder="Enter serial number"
            />
          </div>

          {/* Manufacturer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Manufacturer
            </label>
            <input
              {...register("manufacturer")}
              type="text"
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              placeholder="Enter manufacturer"
            />
          </div>

          {/* Purchase Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Purchase Date
            </label>
            <input
              {...register("purchaseDate")}
              type="date"
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            />
          </div>

          {/* Warranty Expiration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Warranty Expiration
            </label>
            <input
              {...register("warrantyExpiration")}
              type="date"
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              {...register("notes")}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              placeholder="Enter any additional notes"
              rows={3}
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-2 flex bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              <DocumentCheckIcon className="w-6 h-6 mr-2" />
              Save Equipment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
