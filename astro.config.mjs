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
    plugins:
    [
      // @ts-ignore
      tailwindcss()
    ],
  },

  adapter: node({
    mode: "standalone"
  }),
  
  image: {
    service: {
      entrypoint: "src/services/image.ts"
    }
  }
});