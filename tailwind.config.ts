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
        ivory: "#F7EFE2",
        terracotta: "#B85C38",
        coffee: "#3A2418",
        sand: "#D8B98C",
        olive: "#4D5A3A",
        copper: "#B7773C",
        cream: "#FFF8EF",
        charcoal: "#16110D"
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
