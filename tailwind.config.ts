import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#F4EFE6",
        terracotta: "#B85C38",
        coffee: "#21160F",
        sand: "#DCC7A0",
        olive: "#4A5A3A",
        copper: "#C07B48",
        cream: "#FFFBF4",
        charcoal: "#141013",
        sea: "#094E68",
        slate: "#1B2533"
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 24px 70px rgba(58, 36, 24, 0.12)",
        admin: "0 18px 45px rgba(17, 17, 17, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
