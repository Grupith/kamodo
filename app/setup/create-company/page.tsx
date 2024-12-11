"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";

type FormValues = {
  companyName: string;
  numberOfEmployees: number;
  website: string;
  state: string;
  businessType: string[];
};

const states = ["California", "Texas", "New York", "Florida", "Wisconsin"]; // Example states
const businessTypes = ["Tech", "Healthcare", "Retail", "Construction", "Other"]; // Example business types

function CreateCompany() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      console.log("Form Data:", data);

      // TODO: Implement company creation logic (e.g., Firebase Firestore)
      // Example: await createNewCompany(data);

      alert(`Company "${data.companyName}" created successfully!`);
      router.push("/dashboard"); // Redirect to dashboard after creation
    } catch (error) {
      console.error("Error creating company:", error);
      alert("Failed to create company. Please try again.");
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 flex flex-col items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6">
            Create a New Company
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Company Name */}
            <div className="mb-4">
              <label
                htmlFor="companyName"
                className="block text-gray-700 dark:text-gray-300 mb-2"
              >
                Company Name
              </label>
              <input
                id="companyName"
                {...register("companyName", {
                  required: "Company name is required",
                })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your company name"
              />
              {errors.companyName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.companyName.message}
                </p>
              )}
            </div>

            {/* Number of Employees */}
            <div className="mb-4">
              <label
                htmlFor="numberOfEmployees"
                className="block text-gray-700 dark:text-gray-300 mb-2"
              >
                Number of Employees
              </label>
              <input
                id="numberOfEmployees"
                type="number"
                {...register("numberOfEmployees", {
                  required: "Number of employees is required",
                  valueAsNumber: true,
                })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter the number of employees"
              />
              {errors.numberOfEmployees && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.numberOfEmployees.message}
                </p>
              )}
            </div>

            {/* Website */}
            <div className="mb-4">
              <label
                htmlFor="website"
                className="block text-gray-700 dark:text-gray-300 mb-2"
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
                      /^(https?:\/\/)?([\w-]+)+[\w-]+(.[\w-]+)+[\w-]+(.[\w]{2,})+$/,
                    message: "Invalid website URL",
                  },
                })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your company website"
              />
              {errors.website && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.website.message}
                </p>
              )}
            </div>

            {/* State */}
            <div className="mb-4">
              <label
                htmlFor="state"
                className="block text-gray-700 dark:text-gray-300 mb-2"
              >
                State
              </label>
              <select
                id="state"
                {...register("state", { required: "State is required" })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
            </div>

            {/* Business Type */}
            <div className="mb-6">
              <label
                htmlFor="businessType"
                className="block text-gray-700 dark:text-gray-300 mb-2"
              >
                Business Type
              </label>
              <select
                id="businessType"
                {...register("businessType", {
                  required: "Business type is required",
                })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200"
            >
              Create Company
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default CreateCompany;
