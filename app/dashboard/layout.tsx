"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import DarkModeToggle from "@/components/DarkModeToggle";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  HomeIcon,
  UsersIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";
import { signOutUser } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";
import { fetchCompanyDataByOwnerId } from "@/firebase/firestore";
import { CompanyProvider } from "@/contexts/CompanyContext";

interface Company {
  id: string;
  name: string;
  numberOfEmployees?: number;
  website?: string;
  state?: string;
  businessType?: string;
  ownerId: string;
  createdAt?: string; // Use Firebase Timestamp if applicable
}

const MOBILE_BREAKPOINT = 768; // Example breakpoint for mobile

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { user, loading: authLoading } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const notifications = [
    { id: 1, message: "New customer signed up", time: "2h ago" },
    { id: 2, message: "Employee submitted a report", time: "5h ago" },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
  };

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

  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      const newValue = !prev;
      // Save state to localStorage
      localStorage.setItem("sidebarOpen", JSON.stringify(newValue));
      return newValue;
    });
    setShowNotifications(false);
    setShowAccountMenu(false);
  };

  const handleNotificationToggle = () => {
    setShowNotifications((prev) => !prev);
    setShowAccountMenu(false);
  };

  const handleAccountMenuToggle = () => {
    setShowAccountMenu((prev) => !prev);
    setShowNotifications(false);
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
      localStorage.setItem("sidebarOpen", "false");
    }
  };

  // Detect if it's mobile view
  useEffect(() => {
    const checkMobile = () =>
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // On mount, read sidebar state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarOpen");
    if (savedState !== null) {
      setSidebarOpen(JSON.parse(savedState));
    }
  }, []);

  // Close sidebar if mobile and clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isMobile &&
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setSidebarOpen(false);
        localStorage.setItem("sidebarOpen", "false");
      }
    }

    if (isMobile && sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      if (isMobile && sidebarOpen) {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, [isMobile, sidebarOpen]);

  // Fetch company data
  useEffect(() => {
    const fetchCompany = async () => {
      if (authLoading || !user) return;

      try {
        const companyData = await fetchCompanyDataByOwnerId(user.uid);
        setCompany(companyData);
        console.log(companyData.name);
      } catch (err: any) {
        console.error("Error fetching company data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [authLoading, user]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading company data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <CompanyProvider company={company}>
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden relative">
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
                <div className="text-center py-2">{company?.name}</div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main Area */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Top Navbar */}
            <header className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
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

            {/* Content Area */}
            <motion.main
              key={pathname}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={containerVariants}
              className="flex-1 p-6 overflow-auto text-gray-800 dark:text-gray-200"
            >
              {children}
            </motion.main>
          </div>
        </div>
      </CompanyProvider>
    </ProtectedRoute>
  );
}

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick?: () => void;
}

function SidebarLink({ href, icon, label, active, onClick }: SidebarLinkProps) {
  return (
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
}
