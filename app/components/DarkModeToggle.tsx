"use client";
import React, { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline"; // Or solid if you prefer

const DarkModeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Load the theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newTheme = !isDarkMode; // newTheme is boolean
    setIsDarkMode(newTheme);

    // Save as string for localStorage
    localStorage.setItem("darkMode", newTheme.toString());

    // Update the document class
    document.documentElement.classList.toggle("dark", newTheme);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="flex items-center justify-center p-2 rounded-lg focus:outline-none bg-white hover:bg-gray-200 dark:bg-gray-900 text-gray-700 dark:text-white dark:hover:bg-gray-700 transition-all duration-200"
      aria-label="Toggle Dark Mode"
    >
      {isDarkMode ? (
        <SunIcon className="h-6 w-6" />
      ) : (
        <MoonIcon className="h-6 w-6" />
      )}
    </button>
  );
};

export default DarkModeToggle;
