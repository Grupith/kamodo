import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";

function Dashboard() {
  return (
    <ProtectedRoute>
      <h2 className="text-2xl font-bold mb-4">Dashboard Home</h2>
      <p>Welcome to your dashboard. Select an item from the sidebar.</p>
    </ProtectedRoute>
  );
}

export default Dashboard;
