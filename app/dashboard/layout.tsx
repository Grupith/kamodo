"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CompanyProvider } from "@/contexts/CompanyContext";
import { fetchCompanyDataByOwnerId } from "@/firebase/firestore";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSpinner from "@/components/LoadingSpinner";

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
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const toggleSidebar = (open?: boolean) => {
    setSidebarOpen((prev) => {
      const newState = typeof open === "boolean" ? open : !prev;
      try {
        localStorage.setItem("sidebarOpen", JSON.stringify(newState));
      } catch (error) {
        console.error("Error saving sidebar state to localStorage:", error);
      }
      return newState;
    });
  };

  const handleLinkClick = () => {
    if (isMobile) {
      toggleSidebar(false);
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
    const fetchCompany = async () => {
      if (authLoading || !user) return;
      console.log("Fetching company data...");
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

  const notifications = useMemo(
    () => [
      { id: 114212512, message: "New customer signed up", time: "2h ago" },
      {
        id: 2163426243632,
        message: "Employee submitted a report",
        time: "5h ago",
      },
    ],
    []
  );

  if (authLoading || loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-red-500">
        {error}
      </div>
    );
  }

  const contentVariants = {
    open: {
      x: !isMobile ? 0 : 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    closed: {
      x: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <ProtectedRoute>
      <CompanyProvider company={company}>
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden relative">
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            handleLinkClick={handleLinkClick}
            companyName={company?.name || "Your Company"}
            isMobile={isMobile}
          />
          {/* Navbar and main  */}
          <motion.div
            className="flex flex-col flex-1 overflow-hidden"
            variants={contentVariants}
            animate={sidebarOpen ? "open" : "closed"}
            initial="closed"
          >
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
              transition={{ duration: 0.1 }}
              className="flex-1 p-2 overflow-auto"
            >
              {children}
            </motion.main>
          </motion.div>
        </div>
      </CompanyProvider>
    </ProtectedRoute>
  );
};

export default DashboardLayout;
