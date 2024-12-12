// pages/setup/create-company.tsx

"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext"; // Ensure you have AuthContext
import { checkOrCreateUserDoc, createCompany } from "@/firebase/firestore";
import { useAlert } from "@/contexts/AlertContext";

type FormValues = {
  companyName: string;
  numberOfEmployees: number;
  website: string;
  state: string;
  businessType: string;
};

const states = ["California", "Texas", "New York", "Florida", "Wisconsin"]; // Example states
const businessTypes = ["Tech", "Healthcare", "Retail", "Construction", "Other"]; // Example business types

function CreateCompany() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const { user, loading: authLoading } = useAuth(); // Get user from AuthContext
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    if (!authLoading && !user) {
      // If not loading and no user, redirect to login
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const onSubmit = async (data: FormValues) => {
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Ensure user document exists
      const { newUser } = await checkOrCreateUserDoc(
        user.uid,
        user.displayName || "",
        user.email || ""
      );

      if (newUser) {
        // If new user, redirect to setup page
        router.push("/setup");
        return;
      }

      // Create the company with form data
      const companyId = await createCompany(
        user.uid,
        data.companyName,
        data.numberOfEmployees,
        data.website,
        data.state,
        data.businessType
      );

      console.log("Company created with ID:", companyId);

      showAlert(
        "success",
        `Company "${data.companyName}" created successfully!`
      );
      router.push("/dashboard"); // Redirect to dashboard after creation
    } catch (error: unknown) {
      console.error("Error creating company:", error);
    }
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 + 0.5, duration: 0.6, ease: "easeOut" },
    }),
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 flex flex-col items-center justify-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full"
        >
          <motion.h2
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8"
          >
            Create a New Company
          </motion.h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-6"
          >
            <motion.div
              custom={0}
              variants={fieldVariants}
              className="flex flex-col"
            >
              <label
                htmlFor="companyName"
                className="block text-gray-700 dark:text-gray-300 mb-2 font-medium"
              >
                Company Name
              </label>
              <input
                id="companyName"
                {...register("companyName", {
                  required: "Company name is required",
                })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition"
                placeholder="Enter your company name"
              />
              {errors.companyName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.companyName.message}
                </p>
              )}
            </motion.div>

            <motion.div
              custom={1}
              variants={fieldVariants}
              className="flex flex-col"
            >
              <label
                htmlFor="numberOfEmployees"
                className="block text-gray-700 dark:text-gray-300 mb-2 font-medium"
              >
                Number of Employees
              </label>
              <input
                id="numberOfEmployees"
                type="number"
                {...register("numberOfEmployees", {
                  required: "Number of employees is required",
                  valueAsNumber: true,
                  min: {
                    value: 1,
                    message: "At least one employee is required",
                  },
                })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition"
                placeholder="Enter the number of employees"
              />
              {errors.numberOfEmployees && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.numberOfEmployees.message}
                </p>
              )}
            </motion.div>

            <motion.div
              custom={2}
              variants={fieldVariants}
              className="flex flex-col"
            >
              <label
                htmlFor="website"
                className="block text-gray-700 dark:text-gray-300 mb-2 font-medium"
              >
                Company Website
              </label>
              <input
                id="website"
                type="url"
                {...register("website", {
                  required: "Company website is required",
                  pattern: {
                    value:
                      /^(https?:\/\/)?([\w-]+)+[\w-]+(\.[\w-]+)+[\w-]+(.[\w]{2,})+$/,
                    message: "Invalid website URL",
                  },
                })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition"
                placeholder="Enter your company website"
              />
              {errors.website && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.website.message}
                </p>
              )}
            </motion.div>

            <motion.div
              custom={3}
              variants={fieldVariants}
              className="flex flex-col"
            >
              <label
                htmlFor="state"
                className="block text-gray-700 dark:text-gray-300 mb-2 font-medium"
              >
                State
              </label>
              <select
                id="state"
                {...register("state", { required: "State is required" })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition"
              >
                <option value="">Select a state</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.state && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.state.message}
                </p>
              )}
            </motion.div>

            <motion.div
              custom={4}
              variants={fieldVariants}
              className="flex flex-col"
            >
              <label
                htmlFor="businessType"
                className="block text-gray-700 dark:text-gray-300 mb-2 font-medium"
              >
                Business Type
              </label>
              <select
                id="businessType"
                {...register("businessType", {
                  required: "Business type is required",
                })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition"
              >
                <option value="">Select a business type</option>
                {businessTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.businessType && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.businessType.message}
                </p>
              )}
            </motion.div>

            <motion.div custom={5} variants={fieldVariants}>
              <button
                type="submit"
                className="w-full bg-blue-600 dark:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Create Company
              </button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}

export default CreateCompany;
