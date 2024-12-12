import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "selector",
  safelist: [
    {
      pattern: /bg-(green|red|yellow|blue)-(100|900)/, // Safelist dynamic backgrounds
    },
    {
      pattern: /text-(green|red|yellow|blue)-(300|800)/, // Safelist dynamic text colors
    },
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: (theme) => ({
        "hero-pattern": "url('/images/hero-bg.jpg')",
      }),
    },
  },
  plugins: [],
} satisfies Config;
