import type { Metadata } from "next";
import "./globals.css";
import { Inter, Figtree } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Kamodo",
  description: "All-In-One Small Business Management Software",
};

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

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
    <html lang="en">
      <body className={`${figTree.className} dark:bg-gray-800`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
