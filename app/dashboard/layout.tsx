"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CompanyProvider } from "@/contexts/CompanyContext";
import { fetchCompanyDataByOwnerId } from "@/firebase/firestore";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import ProtectedRoute from "@/components/ProtectedRoute";

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

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [company, setCompany] = useState<Company | null>(null); // Explicit type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleLinkClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleNotificationToggle = () => {
    setShowNotifications((prev) => !prev);
    setShowAccountMenu(false);
  };

  const handleAccountMenuToggle = () => {
    setShowAccountMenu((prev) => !prev);
    setShowNotifications(false);
  };

  useEffect(() => {
    // Fetch the company data where uid "==" company.OwnerId.
    const fetchCompany = async () => {
      if (authLoading || !user) return;

      try {
        const companyData = await fetchCompanyDataByOwnerId(user.uid);
        setCompany(companyData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
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

  const notifications = [
    { id: 1, message: "New customer signed up", time: "2h ago" },
    { id: 2, message: "Employee submitted a report", time: "5h ago" },
  ];

  return (
    <ProtectedRoute>
      <CompanyProvider company={company}>
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden relative">
          <Sidebar
            sidebarOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
            handleLinkClick={handleLinkClick}
            companyName={company?.name || "Your Company"}
          />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Navbar
              sidebarOpen={sidebarOpen}
              toggleSidebar={toggleSidebar}
              handleNotificationToggle={handleNotificationToggle}
              handleAccountMenuToggle={handleAccountMenuToggle}
              showNotifications={showNotifications}
              showAccountMenu={showAccountMenu}
              notifications={notifications}
            />
            <motion.main
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 p-6 overflow-auto"
            >
              {children}
            </motion.main>
          </div>
        </div>
      </CompanyProvider>
    </ProtectedRoute>
  );
};

export default DashboardLayout;
