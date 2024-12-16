import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Figtree } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AlertProvider } from "@/contexts/AlertContext";

const figTree = Figtree({
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#72A0C1" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const APP_NAME = "Kamodo";
const APP_DEFAULT_TITLE = "Kamodo - Small Business Management";
const APP_TITLE_TEMPLATE = "%s - Kamodo";
const APP_DESCRIPTION =
  "All-in-one small business management software to organize your jobs, employees, and tasks.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false, // Prevent auto-detection of phone numbers
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr" // Specify text direction for accessibility
      className="scroll-smooth" // Add smooth scrolling
      suppressHydrationWarning
    >
      <head />
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
