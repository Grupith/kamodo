import type { Metadata } from "next";
import "./globals.css";
import { Figtree } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AlertProvider } from "@/contexts/AlertContext";

export const metadata: Metadata = {
  title: "Kamodo - All-In-One Small Business Management Software",
  description:
    "Kamodo is an all-in-one small business management software that helps you streamline your operations, track jobs, and improve productivity.",
  keywords: [
    "small business software",
    "business management tool",
    "job tracking",
    "team management",
    "Kamodo app",
  ],
  openGraph: {
    title: "Kamodo - All-In-One Small Business Management Software",
    description:
      "Streamline your business operations with Kamodo, the ultimate software for managing jobs, tasks, and teams.",
    url: "https://kamodo.app",
    siteName: "Kamodo",
    images: [
      {
        url: "/kamodo.png", // Replace with your Open Graph image URL
        width: 1200,
        height: 630,
        alt: "Kamodo - All-In-One Small Business Management Software",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kamodo - All-In-One Small Business Management Software",
    description:
      "Simplify your business operations with Kamodo. Track jobs, manage tasks, and boost productivity.",
    images: ["/kamodo.png"], // Replace with your Twitter image URL
  },
  robots: {
    index: true,
    follow: true,
  },
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
