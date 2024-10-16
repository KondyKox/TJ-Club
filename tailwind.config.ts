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
        light: "var(--clr-light)",
        dark: "var(--clr-dark)",
        header: "var(--clr-header)",
        akcent: "var(--clr-akcent)",
        button: "var(--clr-button)",
        interaction: "var(--clr-interaction)",
      },
      dropShadow: {
        button: "0 0 0.5rem var(--clr-button)",
        light: "0 0 0.5rem var(--clr-dark)",
        dark: "0 0 0.5rem var(--clr-light)",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
export default config;
