"use client";
import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const AccountSettings = () => {
  const { user } = useAuth();

  return (
    <div className="py-10 sm:py-16 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Account Settings
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Manage your personal information, security, and preferences.
          </p>
        </div>

        {/* Profile Card */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-6"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {/* Placeholder Avatar (replace with user photo if available) */}
                <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-300 font-bold">
                    {user?.displayName
                      ? user.displayName.charAt(0).toUpperCase()
                      : "U"}
                  </span>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {user?.displayName || "No User Name Available"}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.email || "Email not specified"}
                </p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  Phone Number
                </span>
                <span className="text-gray-800 dark:text-white">
                  {user?.phoneNumber ?? "N/A"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  Address
                </span>
                <span className="text-gray-800 dark:text-white">
                  Not Provided
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  Joined At
                </span>
                <span className="text-gray-800 dark:text-white">Unknown</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Settings Cards Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Security Settings Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Security
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Manage your password and account security.
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Password
                </span>
                <button className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm">
                  Change
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Two-factor Auth
                </span>
                <button className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm">
                  Enable
                </button>
              </div>
            </div>
          </motion.div>

          {/* Notification Settings Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Notifications
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Choose what notifications you want to receive.
            </p>
            <div className="mt-4 space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  defaultChecked
                />
                <span className="text-gray-600 dark:text-gray-300">
                  Email Notifications
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <span className="text-gray-600 dark:text-gray-300">
                  SMS Notifications
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  defaultChecked
                />
                <span className="text-gray-600 dark:text-gray-300">
                  Browser Push Notifications
                </span>
              </label>
            </div>
          </motion.div>

          {/* Privacy Settings Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Privacy
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Review and adjust your privacy preferences.
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Profile Visibility
                </span>
                <button className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm">
                  Edit
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Search Visibility
                </span>
                <button className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm">
                  Edit
                </button>
              </div>
            </div>
          </motion.div>

          {/* Account Actions Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Account Actions
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Access advanced account actions.
            </p>
            <div className="mt-4 space-y-2">
              <button className="w-full inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700">
                Deactivate Account
              </button>
              <button className="w-full inline-flex justify-center items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-white bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                Delete Account
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AccountSettings;
