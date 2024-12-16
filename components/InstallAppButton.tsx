"use client";
import { ArrowDownOnSquareIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
}

export default function InstallAppButton() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault(); // Prevent the default prompt
      setDeferredPrompt(event); // Save the event for later
      setIsInstallable(true); // Show the install button
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      (deferredPrompt as BeforeInstallPromptEvent).prompt(); // Show the install prompt
      setDeferredPrompt(null); // Clear the prompt
      setIsInstallable(false); // Hide the button
    }
  };

  if (!isInstallable) {
    return null; // Hide the button if not installable
  }

  return (
    <button
      className="w-1/2 mx-auto mb-1 text-center px-2 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md"
      onClick={handleInstallClick}
    >
      <ArrowDownOnSquareIcon className="w-5 h-5 inline-block -mt-1 mr-1" />
      Install App
    </button>
  );
}
