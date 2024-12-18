"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { useCompany } from "@/contexts/CompanyContext";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase/firebase"; // Adjust path to your Firebase config
import { useRouter } from "next/navigation";
import { DocumentCheckIcon } from "@heroicons/react/24/outline";

interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  organization: string;
  notes: string;
  rating: number;
}

export default function AddCustomerPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormData>();
  const company = useCompany(); // Access current company context
  const { user } = useAuth();

  const router = useRouter();
  const onSubmit = async (data: CustomerFormData) => {
    const customerRef = company?.id; // Access company id directly
    if (!customerRef || !user) {
      console.error("No company or user information available");
      return;
    }

    try {
      const customersRef = collection(
        db,
        "companies",
        customerRef,
        "customers"
      );
      await addDoc(customersRef, {
        ...data,
        createdAt: new Date(),
        createdBy: user.uid,
      });
      console.log("Customer added successfully");
      router.push("/dashboard/customers");
      reset(); // Clear the form
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen flex justify-center items-center">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Add New Customer
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              type="text"
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              placeholder="Enter customer name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: /^\S+@\S+$/i,
              })}
              type="email"
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              placeholder="Enter customer email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone
            </label>
            <input
              {...register("phone", { required: "Phone number is required" })}
              type="tel"
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              placeholder="Enter customer phone"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Address
            </label>
            <input
              {...register("address")}
              type="text"
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              placeholder="Enter customer address"
            />
          </div>

          {/* Organization */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Organization
            </label>
            <input
              {...register("organization")}
              type="text"
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              placeholder="Enter customer company"
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

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Rating
            </label>
            <select
              {...register("rating", { valueAsNumber: true })}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            >
              <option value={0}>No Rating</option>
              <option value={1}>⭐</option>
              <option value={2}>⭐⭐</option>
              <option value={3}>⭐⭐⭐</option>
              <option value={4}>⭐⭐⭐⭐</option>
              <option value={5}>⭐⭐⭐⭐⭐</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-2 flex bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              <DocumentCheckIcon className="w-6 h-6 mr-2" />
              Save Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
