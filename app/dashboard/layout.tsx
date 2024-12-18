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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const handleAccountMenuToggle = () => setShowAccountMenu((prev) => !prev);

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(isMobileView);
      if (isMobileView) {
        setSidebarOpen(false); // Close sidebar on smaller screens
      }
    };

    // Set initial value
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
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
          {/* Sidebar */}
          <motion.div
            initial={false}
            animate={{
              marginLeft: sidebarOpen ? "0" : "-16rem", // Moves off-screen when closed
            }}
            transition={{ duration: 0.3 }}
            className="hidden lg:block w-64 bg-white dark:bg-gray-800 h-full"
          >
            <Sidebar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              handleLinkClick={() => {
                if (isMobile) setSidebarOpen(false);
              }}
              companyName={company?.name || "Your Company"}
            />
          </motion.div>

          {/* Mobile Sidebar */}
          {isMobile && sidebarOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: sidebarOpen ? "0" : "-100%" }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 z-50 w-64 h-full bg-white dark:bg-gray-800"
            >
              <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                handleLinkClick={() => setSidebarOpen(false)}
                companyName={company?.name || "Your Company"}
                isMobile={isMobile}
              />
            </motion.div>
          )}

          {/* Main Content */}
          <div
            className={`flex flex-col flex-1 transition-all duration-300 ${
              sidebarOpen && !isMobile ? "2xl:ml-64" : ""
            }`}
          >
            {/* Navbar */}
            <Navbar
              sidebarOpen={sidebarOpen}
              toggleSidebar={toggleSidebar}
              handleAccountMenuToggle={handleAccountMenuToggle}
              showAccountMenu={showAccountMenu}
              onSearch={(term) => console.log(term)}
              isMobile={isMobile}
            />

            {/* Breadcrumbs */}
            <div className="pl-4 py-1 bg-transparent dark:bg-gray-800 border-gray-300 dark:border-gray-700">
              <Breadcrumbs />
            </div>

            {/* Main Content */}
            <main className="flex-1 p-4 overflow-auto">{children}</main>
          </div>
        </div>
      </CompanyProvider>
    </ProtectedRoute>
  );
};

export default DashboardLayout;
