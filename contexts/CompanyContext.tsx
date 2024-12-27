import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchCompanyDataByOwnerId } from "@/firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";

interface Company {
  id: string;
  name: string;
  ownerId: string;
}

interface CompanyContextType {
  id: string;
  name: string;
  company: Company | null;
  loading: boolean;
  state?: string;
  website?: string;
  numberOfEmployees?: number;
  businessType?: string;
  createdAt?: string;
}

const CompanyContext = createContext<CompanyContextType | null>(null);

export const CompanyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCompany(null);
      setLoading(false);
      return;
    }

    const fetchCompany = async () => {
      try {
        const companyData = await fetchCompanyDataByOwnerId(user.uid);
        setCompany(companyData);
      } catch (error) {
        console.error("Error fetching company data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [user]);

  return (
    <CompanyContext.Provider
      value={{
        id: company?.id || "",
        name: company?.name || "",
        company, // Explicitly include the 'company' object
        loading,
        ...company, // Spread all properties of the 'company' object
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
};
