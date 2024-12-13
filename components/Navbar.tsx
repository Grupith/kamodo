"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BellIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import DarkModeToggle from "@/components/DarkModeToggle";
import { signOutUser } from "@/lib/auth";

interface NavbarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  handleNotificationToggle: () => void;
  handleAccountMenuToggle: () => void;
  showNotifications: boolean;
  showAccountMenu: boolean;
  notifications?: { id: number; message: string; time: string }[];
}

const Navbar: React.FC<NavbarProps> = ({
  sidebarOpen,
  toggleSidebar,
  handleNotificationToggle,
  handleAccountMenuToggle,
  showNotifications,
  showAccountMenu,
  notifications = [],
}) => {
  const isMobile = window.innerWidth < 768;
  const isOverlayVisible =
    (isMobile && sidebarOpen) || showNotifications || showAccountMenu;

  const closeAllMenus = () => {
    if (isMobile && sidebarOpen) toggleSidebar(); // Close sidebar only on mobile
    if (showNotifications) handleNotificationToggle(); // Close notifications menu
    if (showAccountMenu) handleAccountMenuToggle(); // Close account menu
  };

  return (
    <>
      {/* Shade overlay */}
      <AnimatePresence>
        {isOverlayVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-30"
            onClick={closeAllMenus}
          />
        )}
      </AnimatePresence>

      <header className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-40 relative">
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
          >
            {sidebarOpen ? (
              <ArrowLeftIcon className="w-6 h-6" />
            ) : (
              <ArrowRightIcon className="w-6 h-6" />
            )}
          </button>
          <div className="relative hidden md:block">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 dark:text-gray-300 absolute top-1/2 left-3 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={handleNotificationToggle}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 relative"
            >
              <BellIcon className="w-6 h-6" />
              {notifications.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {notifications.length}
                </span>
              )}
            </button>
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg overflow-hidden z-50"
                >
                  <div className="py-2">
                    {notifications.length === 0 ? (
                      <div className="text-gray-700 dark:text-gray-200 px-4 py-2">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((note) => (
                        <div
                          key={note.id}
                          className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                          <p className="text-gray-700 dark:text-gray-200">
                            {note.message}
                          </p>
                          <span className="text-xs text-gray-500">
                            {note.time}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Account */}
          <div className="relative">
            <button
              onClick={handleAccountMenuToggle}
              className="flex items-center p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              <UserCircleIcon className="w-8 h-8 text-gray-700 dark:text-gray-200" />
            </button>
            <AnimatePresence>
              {showAccountMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg overflow-hidden z-50"
                >
                  <div className="py-2">
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      Profile
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      Settings
                    </a>
                    <div className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-200">
                        Dark Mode
                      </span>
                      <DarkModeToggle />
                    </div>
                    <a
                      href="#"
                      onClick={signOutUser}
                      className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      Logout
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
