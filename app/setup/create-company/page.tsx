// src/app/setup/create-company/page.tsx

"use client";

import React, { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";

function CreateCompany() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!companyName.trim()) {
      alert("Please enter a company name.");
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement company creation logic (e.g., Firebase Firestore)
      // Example:
      // await createNewCompany(companyName);

      alert(`Company "${companyName}" created successfully!`);
      router.push("/dashboard"); // Redirect to dashboard after creation
    } catch (error) {
      console.error("Error creating company:", error);
      alert("Failed to create company. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 flex flex-col items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6">
            Create a New Company
          </h2>
          <div className="mb-4">
            <label
              htmlFor="companyName"
              className="block text-gray-700 dark:text-gray-300 mb-2"
            >
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter your company name"
            />
          </div>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Company"}
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default CreateCompany;
