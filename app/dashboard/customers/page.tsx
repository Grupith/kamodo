import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";

const CustomersPage = () => {
  return (
    <ProtectedRoute>
      <h2 className="text-2xl font-bold mb-4">Customers</h2>
      <p>Here is the customers content...</p>
    </ProtectedRoute>
  );
};

export default CustomersPage;
