"use client";

import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import CompanyCard from "@/components/CompanyCard";
import { useCompany } from "@/contexts/CompanyContext";
import { motion } from "framer-motion";
import JobProgressChart from "@/components/JobProgressChart";

const Dashboard = () => {
  const company = useCompany();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (!company) {
    return (
      <ProtectedRoute>
        <div className="p-6">
          <h2 className="text-3xl font-bold mb-4">Dashboard</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Loading company data...
          </p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="p-4">
        <h2 className="text-3xl font-bold mb-4">Dashboard</h2>

        {/* Responsive grid for cards */}
        <motion.div
          className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Company Card (provided) */}
          <motion.div variants={cardVariants}>
            <CompanyCard company={company} />
          </motion.div>

          <JobProgressChart />

          {/* Example of a smaller info card */}
          <motion.div
            variants={cardVariants}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-lg p-4 flex flex-col justify-center items-start"
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Quick Stats
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Monthly Sales: $12,340
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Active Users: 456
            </p>
          </motion.div>

          {/* Example wide card */}
          <motion.div
            variants={cardVariants}
            className="md:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-lg p-6"
          >
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Recent Activities
            </h3>
            <ul className="space-y-2">
              <li className="text-gray-700 dark:text-gray-300">
                - New client signed up
              </li>
              <li className="text-gray-700 dark:text-gray-300">
                - Employee completed a task
              </li>
              <li className="text-gray-700 dark:text-gray-300">
                - Invoice #1234 paid
              </li>
            </ul>
          </motion.div>

          {/* Tall card for additional data */}
          <motion.div
            variants={cardVariants}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-lg p-6 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Performance
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Current Growth Rate: <span className="font-bold">+15%</span>
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Keep track of your daily progress and adjust your strategy
                accordingly.
              </p>
            </div>
          </motion.div>

          {/* Another example card for placeholder content */}
          <motion.div
            variants={cardVariants}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-lg p-6"
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Upcoming Events
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>Meeting with Customer X</li>
              <li>Team Building Activity</li>
              <li>Product Launch Webinar</li>
            </ul>
          </motion.div>

          {/* Add or remove more cards as needed */}
          <motion.div
            variants={cardVariants}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-lg p-4 flex flex-col justify-center items-start"
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Custom Metrics
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              You can add custom data here.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
