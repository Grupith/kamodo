"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CompanyProvider } from "@/contexts/CompanyContext";
import { fetchCompanyDataByOwnerId } from "@/firebase/firestore";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import { usePathname } from "next/navigation";

interface Company {
  id: string;
  name: string;
  numberOfEmployees?: number;
  website?: string;
  state?: string;
  businessType?: string;
  ownerId: string;
  createdAt?: string;
}

// Define props for child components
interface DashboardChildProps {
  searchTerm: string;
  currentPage: string;
}

interface DashboardLayoutProps {
  children: React.ReactElement<DashboardChildProps>;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, loading: authLoading } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const pathname = usePathname();

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const handleAccountMenuToggle = () => setShowAccountMenu((prev) => !prev);

  const handleSearch = (term: string) => setSearchTerm(term);

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
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [authLoading, user]);

  if (authLoading || loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-red-500">
        {error}
      </div>
    );
  }

  const contentVariants = {
    open: { x: 0, transition: { duration: 0.3, ease: "easeInOut" } },
    closed: { x: 0, transition: { duration: 0.3, ease: "easeInOut" } },
  };

  const currentPage = pathname.includes("employees")
    ? "employees"
    : pathname.includes("customers")
    ? "customers"
    : "";

  return (
    <ProtectedRoute>
      <CompanyProvider company={company}>
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden relative">
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            handleLinkClick={() => isMobile && toggleSidebar(false)}
            companyName={company?.name || "Your Company"}
            isMobile={isMobile}
          />
          <motion.div
            className="flex flex-col flex-1 overflow-hidden"
            variants={contentVariants}
            animate={sidebarOpen ? "open" : "closed"}
            initial="closed"
          >
            <Navbar
              sidebarOpen={sidebarOpen}
              toggleSidebar={toggleSidebar}
              handleAccountMenuToggle={handleAccountMenuToggle}
              showAccountMenu={showAccountMenu}
              onSearch={handleSearch}
              currentPage={currentPage}
            />
            <motion.main
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
              className="flex-1 p-2 overflow-auto"
            >
              {React.cloneElement(children, {
                searchTerm,
                currentPage,
              })}
            </motion.main>
          </motion.div>
        </div>
      </CompanyProvider>
    </ProtectedRoute>
  );
};

export default DashboardLayout;
