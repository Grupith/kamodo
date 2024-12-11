"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    console.log("showAlert called with:", type, message); // Debug log
    setAlert({ type, message });

    // Automatically dismiss after 4 seconds
    console.log("clearing alert");
    setTimeout(() => setAlert(null), 4000);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm">
        <AnimatePresence>
          {alert && (
            <motion.div
              key="loginAlert"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className={`px-2 py-3 rounded-md shadow-md text-white text-lg flex align-middle justify-center ${
                alert.type === "success"
                  ? "bg-green-600 text-green-800"
                  : alert.type === "danger"
                  ? "bg-red-100 text-red-800"
                  : alert.type === "warning"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              <svg
                className="w-5 h-5 mr-2 mt-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              {alert.message}
            </motion.div>
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
