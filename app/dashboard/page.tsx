"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import CompanyCard from "@/components/CompanyCard";
import { useCompany } from "@/contexts/CompanyContext";

const Dashboard = () => {
  const company = useCompany();

  if (!company) {
    return (
      <ProtectedRoute>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Loading company data...
          </p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <CompanyCard company={company} />
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
