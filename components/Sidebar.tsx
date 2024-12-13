"use client";
import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  HomeIcon,
  UsersIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";

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

const MOBILE_BREAKPOINT = 768; // Mobile screen breakpoint in px

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

  const sidebarVariants = {
    hidden: { x: -200, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    exit: {
      x: -200,
      opacity: 0,
      transition: { duration: 0.4, ease: "easeInOut" },
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
  }, []);

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
              Kamodo
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
          <div className="text-center py-2">{companyName}</div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
