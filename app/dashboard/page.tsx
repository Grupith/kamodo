import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";

function Dashboard() {
  return (
    <ProtectedRoute>
      <h1 className="text-center">Dashboard</h1>
    </ProtectedRoute>
  );
}

export default Dashboard;
