import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";

const EmployeesPage = () => {
  return (
    <ProtectedRoute>
      <h2 className="text-2xl font-bold mb-4">Employees</h2>
      <p>Here is the employees content...</p>
    </ProtectedRoute>
  );
};

export default EmployeesPage;
