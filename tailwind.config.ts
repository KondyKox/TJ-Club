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
        background: "var(--clr-background)",
        text: "var(--clr-text)",
        header: "var(--clr-header)",
        akcent: "var(--clr-akcent)",
        button: "var(--clr-button)",
        interaction: "var(--clr-interaction)",
      },
      dropShadow: {
        custom: "0 0 0.5rem var(--clr-button)",
      },
    },
  },
  plugins: [],
};
export default config;
