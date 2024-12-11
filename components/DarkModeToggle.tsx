// src/components/DarkModeToggle.tsx

"use client";

import React, { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline"; // Or solid if you prefer
import { useTheme } from "next-themes";

const DarkModeToggle: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure the component is mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid rendering until mounted

  const toggleDarkMode = () => {
    if (resolvedTheme === "dark") {
      setTheme("light");
      console.log("switched to", theme);
    } else {
      setTheme("dark");
      console.log("switched to", theme);
    }
  };

  return (
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
  );
};

export default DarkModeToggle;
