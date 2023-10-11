import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import serviceWorker from "astrojs-service-worker";
// import netlify from "@astrojs/netlify/functions";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind(), serviceWorker()],
  output: "static",
  // adapter: adapter(),
});