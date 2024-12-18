"use client";

import "./globals.css";
import { Figtree } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AlertProvider } from "@/contexts/AlertContext";
import { useEffect } from "react";
import { ModalProvider } from "@/contexts/ModalContext";

const figTree = Figtree({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Register the minimal service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js") // Note: sw.ts is compiled to sw.js
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
      <body className={`${figTree.className} dark:bg-gray-800`}>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <AlertProvider>
            <ModalProvider>
              <AuthProvider>{children}</AuthProvider>
            </ModalProvider>
          </AlertProvider>
        </NextThemesProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
