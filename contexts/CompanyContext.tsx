"use client";
import React, { createContext, useContext } from "react";

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

const CompanyContext = createContext<Company | null>(null);

export const CompanyProvider = ({
  children,
  company,
}: {
  children: React.ReactNode;
  company: Company | null;
}) => {
  return (
    <CompanyContext.Provider value={company}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => useContext(CompanyContext);
