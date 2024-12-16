"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  HomeIcon,
  UsersIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";
import InstallAppButton from "./InstallAppButton";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (state: boolean) => void; // Add this to the props
  handleLinkClick: () => void;
  companyName?: string;
  isMobile?: boolean;
}

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick?: () => void;
}

const SidebarLink = ({
  href,
  icon,
  label,
  active,
  onClick,
}: SidebarLinkProps) => (
  <Link
    href={href}
    onClick={onClick}
    className={`flex items-center px-3 py-2 rounded-md transition-colors ${
      active
        ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </Link>
);

const Sidebar = ({
  sidebarOpen,
  handleLinkClick,
  setSidebarOpen,
  companyName,
  isMobile,
}: SidebarProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [showCTA, setShowCTA] = useState(true);

  const sidebarVariants = {
    hidden: { x: -200, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: {
      x: -200,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  useEffect(() => {
    const savedState = localStorage.getItem("sidebarOpen");
    if (savedState !== null) {
      try {
        setSidebarOpen(JSON.parse(savedState));
      } catch (error) {
        console.error("Error parsing sidebar state:", error);
        setSidebarOpen(false); // Default to closed on error
      }
    }
  }, [setSidebarOpen]);

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.aside
          ref={sidebarRef}
          variants={sidebarVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`flex flex-col w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-40 ${
            isMobile ? "fixed h-full" : ""
          }`}
        >
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              {companyName}
            </h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto mt-4">
            <SidebarLink
              href="/dashboard"
              icon={<HomeIcon className="w-6 h-6" />}
              label="Dashboard"
              active={pathname === "/dashboard"}
              onClick={handleLinkClick}
            />
            <SidebarLink
              href="/dashboard/customers"
              icon={<UsersIcon className="w-6 h-6" />}
              label="Customers"
              active={pathname === "/dashboard/customers"}
              onClick={handleLinkClick}
            />
            <SidebarLink
              href="/dashboard/employees"
              icon={<BuildingOffice2Icon className="w-6 h-6" />}
              label="Employees"
              active={pathname === "/dashboard/employees"}
              onClick={handleLinkClick}
            />
          </nav>
          {/* Sidebar CTA */}
          {showCTA && (
            <motion.div
              id="sidebar-cta"
              className="p-3 m-3 mb-12 rounded-lg bg-blue-50 dark:bg-blue-900"
              role="alert"
              initial={{ opacity: 1 }}
              animate={{ opacity: showCTA ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-2">
                <span className="bg-green-100 text-green-800 text-xs font-semibold me-2 px-2 py-0.5 rounded dark:bg-green-200 dark:text-green-900">
                  Upgrade
                </span>
                <button
                  type="button"
                  className="ms-auto text-blue-900 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-200"
                  data-dismiss-target="#sidebar-cta"
                  aria-label="Close"
                  onClick={() => setShowCTA(false)}
                >
                  <svg
                    className="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M1 1l6 6m0 0l6 6M7 7L1 13M7 7L13 1"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-blue-800 dark:text-blue-400 py-3">
                Unlock all the features of Kamodo with the Starter plan. Get
                enhanced tools to manage your small business more effectively.
              </p>
              <a
                href="/pricing"
                className="text-xs text-blue-800 underline font-medium hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Upgrade to Starter
              </a>
            </motion.div>
          )}
          <InstallAppButton />
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
