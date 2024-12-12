// pages/login.tsx

"use client";

import React, { useEffect } from "react";
import { auth, db, googleProvider } from "@/firebase/firebase"; // Ensure this path is correct
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext"; // Ensure you have an AlertContext
import { checkOrCreateUserDoc } from "@/firebase/firestore"; // Adjust the import path as needed
import { motion } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { showAlert } = useAlert();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      // Check or Create user document
      const { newUser, userData } = await checkOrCreateUserDoc(
        firebaseUser.uid,
        firebaseUser.displayName || "",
        firebaseUser.email || ""
      );

      // Show success alert
      showAlert(
        "success",
        `Logged in as: ${userData?.email || firebaseUser.email}`
      );
      console.log("Logged in as:", userData?.email || firebaseUser.email);

      // Redirect based on user status
      if (newUser || !userData?.companyId) {
        // New user or user without a company
        router.push("/setup");
      } else {
        // Existing user with a company
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Error during sign-in:", error);
      showAlert("danger", "Failed to sign in. Please try again.");
    }
  };

  // Redirect authenticated users (handles page refreshes)
  useEffect(() => {
    if (!loading && user) {
      // Since we don't have userData here, fetch it
      const fetchUserDataAndRedirect = async () => {
        try {
          const userDocSnap = await getDoc(doc(db, "users", user.uid));
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            if (userData.companyId) {
              router.push("/dashboard");
            } else {
              router.push("/setup");
            }
          } else {
            // If user doc doesn't exist, this shouldn't happen because checkOrCreateUserDoc should have created it
            router.push("/setup");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          showAlert("danger", "Failed to retrieve user data.");
        }
      };

      fetchUserDataAndRedirect();
    }
  }, [user, loading, router, showAlert]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-gray-500 text-xl dark:text-gray-400">
          Loading...
        </div>
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full"
      >
        {/* Optional Logo */}
        {/* 
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Kamodo Logo" className="h-12 w-12" />
        </div> 
        */}

        <motion.h1
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl font-bold text-center mb-4 text-gray-800 dark:text-white"
        >
          Welcome to Kamodo
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="text-center text-gray-600 dark:text-gray-300 mb-6"
        >
          Currently, we only offer Google sign in.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-200 font-medium py-2 px-4 rounded-lg shadow-sm transition-transform transform hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
        >
          {/* Google Icon */}
          <svg
            className="w-5 h-5 mr-3"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 533.5 544.3"
          >
            <path
              d="M533.5 278.4c0-17.8-1.6-35-4.7-51.3H272v96.8h146.9c-6.3 34-24.4 63-52.4 82v68.1h84.8c49.7-45.8 78.4-113.4 78.4-194.6z"
              fill="#4285F4"
            />
            <path
              d="M272 544.3c71.1 0 130.6-23.5 174-63.9l-84.8-68.1c-23.6 15.8-53.7 25.1-89.2 25.1-68.5 0-126.7-46.3-147.5-108.1H40v68.1C83.4 505.5 171.5 544.3 272 544.3z"
              fill="#34A853"
            />
            <path
              d="M96.7 301.2c-5.5-16.4-5.5-34 0-50.4V200H48v101.2c0 16.4 0 34 0 50.4l48.7-0z"
              fill="#FBBC05"
            />
            <path
              d="M272 112c35.2 0 66.8 12.3 91.5 36.2l68.4-68.4C384.7 43.4 336.9 32 272 32 171.5 32 83.4 38.8 40 107.7l84.5 68.4c20.8-61.8 79-108.1 147.5-108.1z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </motion.button>
      </motion.div>
    </div>
  );
};

export default LoginPage;
