import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface": "#0e1322",
        "surface-dim": "#0e1322",
        "surface-bright": "#343949",
        "surface-container-lowest": "#090e1c",
        "surface-container-low": "#161b2b",
        "surface-container": "#1a1f2f",
        "surface-container-high": "#25293a",
        "surface-container-highest": "#2f3445",
        "on-surface": "#dee1f7",
        "on-surface-variant": "#d1c5ac",
        "outline": "#9a9078",
        "outline-variant": "#4e4633",
        "primary": "#ffe5a0",
        "primary-container": "#f5c518",
        "primary-fixed": "#ffe08b",
        "primary-fixed-dim": "#f0c110",
        "on-primary": "#3d2f00",
        "secondary": "#ffb4ab",
        "secondary-container": "#a90110",
        "tertiary": "#d5e9ff",
        "tertiary-container": "#9ecfff",
        "background": "#0e1322",
        "on-background": "#dee1f7",
        "surface-variant": "#2f3445",
        "surface-tint": "#f0c110",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "hex-pattern": "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      keyframes: {
        "bar-grow": {
          "0%": { width: "0%" },
          "100%": { width: "var(--bar-width)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 8px rgba(245, 197, 24, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(245, 197, 24, 0.7)" },
        },
      },
      animation: {
        "bar-grow": "bar-grow 1s ease-out forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
