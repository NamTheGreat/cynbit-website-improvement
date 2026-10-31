import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface-container-lowest": "#0c0e14",
        "surface-container-low": "#191b22",
        "surface-container": "#1e1f26",
        "surface-container-high": "#282a30",
        "surface-container-highest": "#33343b",
        "surface-bright": "#373940",
        surface: "#111319",
        primary: "#e0fdff",
        "primary-container": "#00f2fe",
        secondary: "#d2bbff",
        "secondary-container": "#5c03cb",
        tertiary: "#e1ffec",
        "tertiary-container": "#67f4b7",
        "tertiary-fixed-dim": "#4edea3",
        "on-surface": "#e2e2eb",
        "on-surface-variant": "#b9cacb",
        outline: "#849495",
        "outline-variant": "#3a494b",
        "on-primary": "#00373a",
      },
      fontFamily: {
        space: ["Space Grotesk", "sans-serif"],
        geist: ["Geist", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
