"use client";

import "./globals.css";
import { Figtree } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AuthProvider } from "@/contexts/AuthContext";
import { AlertProvider } from "@/contexts/AlertContext";
import { ModalProvider } from "@/contexts/ModalContext";
import { CompanyProvider } from "@/contexts/CompanyContext";
import { useEffect } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { Toaster } from "@/components/ui/toaster";

const figTree = Figtree({
  subsets: ["latin"],
  display: "swap",
});

function HotkeyListener() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) && // Cmd (Mac) or Ctrl (Windows/Linux)
        event.shiftKey && // Shift
        event.key.toLowerCase() === "l" // 'L' key (case insensitive)
      ) {
        setTheme(theme === "dark" ? "light" : "dark");
        console.log(`Theme toggled to: ${theme === "dark" ? "light" : "dark"}`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [theme, setTheme]);

  return null;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Register the minimal service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  return (
    <html
      lang="en"
      dir="ltr"
      className="scroll-smooth"
      suppressHydrationWarning
    >
      <head />
      <body className={`${figTree.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AlertProvider>
            <ModalProvider>
              <AuthProvider>
                <CompanyProvider>
                  <HotkeyListener />
                  {children}
                  <Toaster />
                </CompanyProvider>
              </AuthProvider>
            </ModalProvider>
          </AlertProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
