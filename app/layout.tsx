import type { Metadata } from "next";
import "./globals.css";
import { Figtree } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AlertProvider } from "@/contexts/AlertContext";

export const metadata: Metadata = {
  title: "Kamodo",
  description: "All-In-One Small Business Management Software",
};

const figTree = Figtree({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${figTree.className} dark:bg-gray-800`}>
        <NextThemesProvider
          attribute="class" // Uses class-based theming
          defaultTheme="system" // Defaults to system preference
          enableSystem={true} // Enables automatic theme detection
        >
          <AlertProvider>
            <AuthProvider>{children}</AuthProvider>
          </AlertProvider>
        </NextThemesProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
