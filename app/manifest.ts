import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kamodo - Small Business Management",
    short_name: "Kamodo",
    description:
      "All-in-one management software for small businesses. Organize your jobs, employees, and tasks with ease.",
    start_url: "/",
    display: "standalone", // Makes it behave like an app
    background_color: "#ffffff", // Background of the splash screen
    icons: [
      {
        src: "/icons/web-app-manifest-192x192.png", // Path to 192x192 icon
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/web-app-manifest-192x192.png", // Path to 512x512 icon
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
