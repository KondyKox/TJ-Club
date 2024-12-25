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
        primary: "var(--clr-primary)",
        secondary: "var(--clr-secondary)",
        interaction: "var(--clr-interaction)",
        header: "var(--clr-header)",
        akcent: "var(--clr-akcent)",
        button: "var(--clr-button)",
        red: "var(--clr-red)",
      },
      dropShadow: {
        button: "0 0 0.5rem var(--clr-button)",
        interaction: "0 0 0.5rem var(--clr-interaction)",
        red: "0 0 0.5rem var(--clr-red)",
      },
      boxShadow: {
        secondary: "0 0.5rem 0.5rem var(--clr-secondary)",
      },
      keyframes: {
        dots: {
          "0%, 20%": { opacity: "0" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "dots-1": "dots 1.4s infinite",
        "dots-2": "dots 1.4s infinite 0.2s",
        "dots-3": "dots 1.4s infinite 0.4s",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
export default config;
