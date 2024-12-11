// src/app/setup/page.tsx

"use client";

import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { signOutUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

function Setup() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      router.push("/");
    } catch (error) {
      alert("Error trying to sign out");
    }
  };

  const handleCreateCompany = () => {
    router.push("/setup/create-company");
  };

  const handleJoinCompany = () => {
    router.push("/setup/join-company");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        {/* Navbar */}
        <nav className="flex justify-end px-4">
          <button
            onClick={handleSignOut}
            className="bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
          >
            Sign Out
          </button>
        </nav>

        {/* Main Content */}
        <div className="flex items-center justify-center flex-col mt-10">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Get Started with Kamodo
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-md">
            Manage your projects efficiently by creating a new company or
            joining an existing one. Choose the option that best fits your needs
            to begin your journey with Kamodo.
          </p>

          {/* Action Buttons */}
          <div className="flex space-x-6">
            {/* Create a Company Button */}
            <button
              onClick={handleCreateCompany}
              className="flex items-center justify-center bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200"
            >
              Create a Company
            </button>

            {/* Join a Company Button */}
            <button
              onClick={handleJoinCompany}
              className="flex items-center justify-center bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200"
            >
              Join a Company
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default Setup;
