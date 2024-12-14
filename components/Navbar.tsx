"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCircleIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import DarkModeToggle from "@/components/DarkModeToggle";
import { signOutUser } from "@/lib/auth";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

interface NavbarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  handleAccountMenuToggle: () => void;
  showAccountMenu: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  sidebarOpen,
  toggleSidebar,
  handleAccountMenuToggle,
  showAccountMenu,
}) => {
  const { user } = useAuth();
  const isMobile = window.innerWidth < 768;
  const isOverlayVisible = (isMobile && sidebarOpen) || showAccountMenu;

  const closeAllMenus = () => {
    if (isMobile && sidebarOpen) toggleSidebar();
    if (showAccountMenu) handleAccountMenuToggle();
  };

  return (
    <>
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
            <Bars3Icon className="w-6 h-6" />
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
          <DarkModeToggle />
          <div className="relative">
            <button
              onClick={handleAccountMenuToggle}
              className="flex items-center p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {user && user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt="user"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full"
                  priority
                />
              ) : (
                <UserCircleIcon className="w-8 h-8 text-gray-700 dark:text-gray-200" />
              )}
            </button>
            <AnimatePresence>
              {showAccountMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow divide-y divide-gray-100 dark:divide-gray-600 z-50"
                >
                  {user && (
                    <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      <div className="font-semibold mb-1">
                        {user.displayName || "User"}
                      </div>
                      <span className="bg-green-200 text-green-800  text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                        {"Owner"}
                      </span>

                      <div className="font-medium truncate text-blue-500 mt-1">
                        {user.email}
                      </div>
                    </div>
                  )}
                  <ul
                    onClick={closeAllMenus}
                    className="py-2 text-sm text-gray-700 dark:text-gray-200"
                  >
                    <li>
                      <a
                        href="/dashboard"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white rounded-md"
                      >
                        Dashboard
                      </a>
                    </li>
                    <li>
                      <Link
                        href="/dashboard/settings"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white rounded-md"
                      >
                        Settings
                      </Link>
                    </li>
                  </ul>
                  <div className="py-1">
                    <button
                      onClick={signOutUser}
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white text-left rounded-md"
                    >
                      Sign out
                    </button>
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
