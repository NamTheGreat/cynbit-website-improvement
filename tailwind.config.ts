import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cynbit: {
          blue: "#2563eb",
          dark: "#0a0f1d",
          card: "#111827",
          border: "#1f2937",
          accent: "#38bdf8",
          emerald: "#10b981",
          purple: "#8b5cf6",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
