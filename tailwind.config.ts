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
        ink: "#14213d",
        sunshine: "#ffd166",
        bubble: "#5bc0eb",
        mint: "#8ac926",
        coral: "#ff6b6b",
        grape: "#7b2cbf",
        paper: "#fffaf0"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(20, 33, 61, 0.16)"
      }
    }
  },
  plugins: []
};

export default config;
