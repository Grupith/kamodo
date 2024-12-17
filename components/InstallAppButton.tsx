"use client";
import { ArrowDownOnSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallAppButton() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
      event.preventDefault(); // Prevent the default prompt
      setDeferredPrompt(event); // Save the event for later
      setIsInstallable(true); // Show the install button
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Show the install prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null); // Clear the saved prompt
        setIsInstallable(false); // Hide the install button
      });
    }
  };

  const [isVisible, setIsVisible] = useState(true);

  const handleHideClick = () => {
    setIsVisible(false);
  };

  return (
    isInstallable &&
    isVisible && (
      <div className="relative w-56 max-w-sm mx-auto mb-4 p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-lg rounded-md flex items-center justify-around">
        <button
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 dark:bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={handleInstallClick}
        >
          <ArrowDownOnSquareIcon className="w-5 h-5 mr-2" />
          Install App
        </button>
        <button
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 tfocus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-full"
          onClick={handleHideClick}
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    )
  );
}
