"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import Alert from "@/components/Alert";

type AlertType = "success" | "danger" | "warning" | "info";

interface Alert {
  type: AlertType;
  message: string;
}

interface AlertContextType {
  showAlert: (type: AlertType, message: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [alert, setAlert] = useState<Alert | null>(null);

  const showAlert = (type: AlertType, message: string) => {
    setAlert({ type, message });

    // Automatically dismiss after 4 seconds
    setTimeout(() => setAlert(null), 4000);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg">
        <AnimatePresence>
          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          )}
        </AnimatePresence>
      </div>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
