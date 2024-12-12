"use client";
import React, { useEffect } from "react";
import { auth } from "@/firebase/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";
import { checkOrCreateUserDoc } from "@/firebase/firestore";
import { motion } from "framer-motion";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { showAlert } = useAlert();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check or Create user document
      const userDoc = await checkOrCreateUserDoc(
        user.uid,
        user.displayName,
        user.email
      );
      showAlert("success", `Logged in as: ${userDoc?.email}`);
      console.log("Logged in as:", userDoc?.email);
    } catch (error) {
      console.error("Error during sign-in: ", error);
    }
  };

  // Redirect authenticated users
  useEffect(() => {
    if (!loading && user) {
      router.push("/setup");
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
              d="M124.5 323.5c-10.7-31.8-10.7-66.1 0-97.9V155H40c-39.2 76.8-39.2 168.1 0 244.9l84.5-68.4z"
              fill="#FBBC05"
            />
            <path
              d="M272 107.7c37.2 0 70.7 12.8 96.9 37.9l72.5-72.5C402.6 25.9 344.2 0 272 0 171.5 0 83.4 38.8 40 107.7l84.5 68.4c20.8-61.8 79-108.1 147.5-108.1z"
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
