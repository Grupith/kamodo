"use client";

import React, { useEffect, useState, useCallback } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

const DarkModeToggle: React.FC = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Ensure the component is mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Wrap toggleDarkMode in useCallback
  const toggleDarkMode = useCallback(() => {
    if (resolvedTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }, [resolvedTheme, setTheme]);

  // Add hotkey logic
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const commandKey = isMac ? event.metaKey : event.ctrlKey;

      if (commandKey && event.shiftKey && event.key.toLowerCase() === "l") {
        event.preventDefault();
        toggleDarkMode();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleDarkMode]);

  if (!mounted) return null;

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={toggleDarkMode}
        className="flex items-center justify-center p-2 rounded-lg focus:outline-none bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white transition-all duration-200"
        aria-label="Toggle Dark Mode"
      >
        {resolvedTheme === "dark" ? (
          <SunIcon className="h-6 w-6" />
        ) : (
          <MoonIcon className="h-6 w-6" />
        )}
      </button>

      {/* Tooltip to show theme hotkey with Framer Motion */}
      <AnimatePresence>
        {isHovered && window.innerWidth >= 1024 && (
          <motion.div
            initial={{ opacity: 0, x: -10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white dark:bg-gray-100 dark:text-gray-900 text-sm font-medium rounded-md py-1 px-2 shadow-lg border border-gray-700 dark:border-gray-100 flex flex-row items-center space-x-1"
          >
            <span>
              {navigator.platform.toUpperCase().includes("MAC")
                ? "Cmd"
                : "Ctrl"}
            </span>
            <span>+</span>
            <span>Shift</span>
            <span>+</span>
            <span>L</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DarkModeToggle;
