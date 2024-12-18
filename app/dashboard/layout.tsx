"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CompanyProvider } from "@/contexts/CompanyContext";
import { fetchCompanyDataByOwnerId } from "@/firebase/firestore";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import { motion } from "framer-motion";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Company {
  id: string;
  name: string;
  ownerId: string;
}

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default closed
  const [isMobile, setIsMobile] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const handleAccountMenuToggle = () => setShowAccountMenu((prev) => !prev);

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);

    // Save sidebar state to localStorage only for desktop
    if (!isMobile) {
      localStorage.setItem("sidebarOpen", JSON.stringify(newState));
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(isMobileView);

      // Close sidebar for mobile views on resize
      if (isMobileView) {
        setSidebarOpen(false);
      } else {
        // Restore sidebar state for desktop views
        const savedState = localStorage.getItem("sidebarOpen");
        setSidebarOpen(savedState ? JSON.parse(savedState) : true);
      }
    };

    // Set initial value and add resize listener
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchCompany = async () => {
      if (authLoading || !user) return;
      try {
        const companyData = await fetchCompanyDataByOwnerId(user.uid);
        setCompany(companyData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Error fetching company data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [authLoading, user, error]);

  if (authLoading || loading) {
    return <LoadingSpinner />;
  }

  return (
    <ProtectedRoute>
      <CompanyProvider company={company}>
        <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
          {/* Sidebar */}
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            handleLinkClick={() => {
              if (isMobile) setSidebarOpen(false);
            }}
            companyName={company?.name || "Your Company"}
            isMobile={isMobile}
          />

          {/* Main Content */}
          <motion.div
            initial={{ marginLeft: "0" }}
            animate={{
              marginLeft: isMobile ? "0" : sidebarOpen ? "0rem" : "0",
            }}
            transition={{ duration: 0.2 }}
            className="flex flex-col flex-1 w-full overflow-y-auto"
          >
            {/* Navbar */}
            <Navbar
              sidebarOpen={sidebarOpen}
              toggleSidebar={toggleSidebar}
              onSearch={(term) => console.log(term)}
              isMobile={isMobile}
              handleAccountMenuToggle={handleAccountMenuToggle}
              showAccountMenu={showAccountMenu}
            />

            {/* Breadcrumbs */}
            <Breadcrumbs />

            {/* Dashboard view */}
            <main className="flex-1 overflow-y-auto">{children}</main>
          </motion.div>
        </div>
      </CompanyProvider>
    </ProtectedRoute>
  );
};

export default DashboardLayout;
