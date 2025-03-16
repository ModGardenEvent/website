/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./node_modules/flowbite/**/*.js",
  ],
  darkMode: "selector",
  theme: {
    extend: {
      backgroundImage: {
        "flower-background": "url('/images/background_tile.png')",
      },
      colors: {
        soil: {
          50: "#faf7ef",
          100: "#f5efee",
          200: "#ece0df",
          300: "#dcc8c5",
          400: "#c8a9a4",
          500: "#b18782",
          600: "#986866",
          700: "#805453",
          800: "#6b4646",
          900: "#5d3e40",
          950: "#321f20",
        },
        leaf: {
          50: "#efffee",
          100: "#d9ffd8",
          200: "#a9ffa7",
          300: "#7afd78",
          400: "#37f236",
          500: "#0ddb0c",
          600: "#04b603",
          700: "#078e07",
          800: "#0b700b",
          900: "#0c5b0e",
          950: "#003302",
        },
        pine: {
          50: "#ecfdf8",
          100: "#d0fbee",
          200: "#a5f5dc",
          300: "#6beac3",
          400: "#30d7a3",
          500: "#0bbe86",
          600: "#019265",
          700: "#017b55",
          800: "#046144",
          900: "#045038",
          950: "#012d1f",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("flowbite/plugin")],
};
