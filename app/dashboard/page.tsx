"use client";

import CompanyCard from "@/components/CompanyCard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useCompany } from "@/contexts/CompanyContext";

export default function DashboardPage() {
  const { company, loading } = useCompany();

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="p-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p>Loading company information...</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4">
          {/* CompanyCard */}
          <div className="col-span-1 lg:col-span-2">
            {company ? (
              <CompanyCard company={company} />
            ) : (
              <p>No company information available.</p>
            )}
          </div>

          {/* Add additional cards or components */}
          <div className="col-span-1 border rounded-lg border-[var(--border)] bg-card dark:bg-zinc-900">
            <div className="shadow-md rounded-lg p-6 h-full">
              <h2 className="text-xl font-semibold">Additional Component</h2>
              <p>Details about this component go here.</p>
            </div>
          </div>

          <div className="col-span-1 rounded-lg border border-[var(--border)] bg-card dark:bg-zinc-900">
            <div className="shadow-md rounded-lg p-6 h-full">
              <h2 className="text-xl font-semibold">Another Component</h2>
              <p>Details about another component go here.</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
