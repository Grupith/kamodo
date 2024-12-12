"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useCompany } from "@/contexts/CompanyContext";
import React from "react";

interface Company {
  id: string;
  name: string;
  numberOfEmployees?: number;
  website?: string;
  state?: string;
  businessType?: string;
  ownerId: string;
  createdAt?: any; // Use Firebase Timestamp if applicable
}

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
