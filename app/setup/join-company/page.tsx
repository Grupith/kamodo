"use client";

import React, { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 flex flex-col items-center justify-center">
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
            Join an Existing Company
          </motion.h2>
          <motion.div
            custom={0}
            variants={fieldVariants}
            className="mb-6 flex flex-col"
          >
            <label
              htmlFor="companyCode"
              className="block text-gray-700 dark:text-gray-300 mb-2 font-medium"
            >
              Company Code
            </label>
            <input
              type="text"
              id="companyCode"
              value={companyCode}
              onChange={(e) => setCompanyCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white transition"
              placeholder="Enter your company code"
            />
          </motion.div>
          <motion.div custom={1} variants={fieldVariants}>
            <button
              onClick={handleJoin}
              disabled={loading}
              className="w-full bg-purple-600 dark:bg-purple-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50"
            >
              {loading ? "Joining..." : "Join Company"}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}

export default JoinCompany;
