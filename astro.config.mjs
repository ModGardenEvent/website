// @ts-check
import { defineConfig } from "astro/config";

import icon from "astro-icon";

import tailwindcss from "@tailwindcss/vite";

import node from "@astrojs/node";


// https://astro.build/config
export default defineConfig({
  integrations: [icon()],
  output: "server",

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: node({
    mode: "standalone"
  }),
});