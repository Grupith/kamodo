import type { Metadata, Viewport } from "next";

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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#72A0C1" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};
