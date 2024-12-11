// src/app/setup/join-company/page.tsx

"use client";

import React, { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";

function JoinCompany() {
  const router = useRouter();
  const [companyCode, setCompanyCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!companyCode.trim()) {
      alert("Please enter a company code.");
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement company joining logic (e.g., verify code in Firebase Firestore)
      // Example:
      // const company = await verifyCompanyCode(companyCode);
      // if (company) {
      //   await joinExistingCompany(company.id);
      // }

      alert(`Successfully joined company with code "${companyCode}"!`);
      router.push("/dashboard"); // Redirect to dashboard after joining
    } catch (error) {
      console.error("Error joining company:", error);
      alert("Failed to join company. Please check the code and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 flex flex-col items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6">
            Join an Existing Company
          </h2>
          <div className="mb-4">
            <label
              htmlFor="companyCode"
              className="block text-gray-700 dark:text-gray-300 mb-2"
            >
              Company Code
            </label>
            <input
              type="text"
              id="companyCode"
              value={companyCode}
              onChange={(e) => setCompanyCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter your company code"
            />
          </div>
          <button
            onClick={handleJoin}
            disabled={loading}
            className="w-full bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 disabled:opacity-50"
          >
            {loading ? "Joining..." : "Join Company"}
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default JoinCompany;
