"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useCompany } from "@/contexts/CompanyContext";
import React from "react";

const Dashboard = () => {
  const company = useCompany();
  return (
    <ProtectedRoute>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <p>{company?.name || "No company name available"}</p>
    </ProtectedRoute>
  );
};

export default Dashboard;
