// @ts-check
import { defineConfig } from "astro/config";

import icon from "astro-icon";

import tailwindcss from "@tailwindcss/vite";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  integrations: [icon()],
  output: "server",
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: vercel(),
});