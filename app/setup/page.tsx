"use client";
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { signOutUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

function Setup() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      router.push("/");
    } catch (error) {
      alert("Error trying to sign out");
      console.log("Error trying to sign out", error);
    }
  };

  const handleCreateCompany = () => {
    router.push("/setup/create-company");
  };

  const handleJoinCompany = () => {
    router.push("/setup/join-company");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
        {/* Navbar */}
        <nav className="flex justify-end mb-6">
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            onClick={handleSignOut}
            className="flex items-center space-x-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium py-2 px-4 rounded-md shadow-sm transition duration-200"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Logout</span>
          </motion.button>
        </nav>

        {/* Main Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center justify-center mt-20"
        >
          <h1 className="text-5xl text-center font-extrabold text-gray-800 dark:text-white mb-6">
            Get Started with Kamodo
          </h1>
          <p className="text-center text-lg text-gray-600 dark:text-gray-300 max-w-md mb-10 leading-relaxed">
            Efficiently manage your projects by creating a new company or
            joining an existing one. Choose an option below to start your
            journey.
          </p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-8"
          >
            {/* Create a Company Button */}
            <button
              onClick={handleCreateCompany}
              className="flex items-center justify-center bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-md shadow-md transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Create a Company
            </button>

            {/* Join a Company Button */}
            <button
              onClick={handleJoinCompany}
              className="flex items-center justify-center bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-600 text-white font-semibold py-3 px-8 rounded-md shadow-md transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
            >
              Join a Company
            </button>
          </motion.div>
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}

export default Setup;
