import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0A5C36",
        gold: "#C5961A",
        darkBg: "#1A1A2E",
        lightBg: "#FAFAF5",
        ink: "#1C1008"
      }
    },
  },
  plugins: [],
};
export default config;
