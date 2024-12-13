"use client";
import React, { useEffect } from "react";
import { handleGoogleLogin } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";
import { motion } from "framer-motion";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { showAlert } = useAlert();

  const onLoginSuccess = (newUser: boolean, companyId?: string) => {
    if (newUser || !companyId) {
      router.push("/setup");
    } else {
      router.push("/dashboard");
    }
  };

  const onError = (message: string) => {
    showAlert("danger", message);
  };

  // Redirect authenticated users (for page refresh)
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-gray-500 text-xl dark:text-gray-400">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full"
      >
        <motion.h1 className="text-3xl font-bold text-center mb-4 text-gray-800 dark:text-white">
          Welcome to Kamodo
        </motion.h1>
        <motion.button
          onClick={() =>
            handleGoogleLogin({
              onLoginSuccess,
              onError,
            })
          }
          className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg px-4 py-2"
        >
          Sign in with Google
        </motion.button>
      </motion.div>
    </div>
  );
};

export default LoginPage;
