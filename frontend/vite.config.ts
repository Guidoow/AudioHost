import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { configDotenv } from "dotenv";

configDotenv({ path: "../.env" });

if (!process.env.FRONTEND_INTERNAL_PORT || !process.env.NODE_ENV)
  throw new Error("Enviroment variables not loaded.");

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: process.env.FRONTEND_INTERNAL_PORT,
    host: "0.0.0.0",
  },
  plugins: [svelte()],
  resolve: {
    alias: {
      "@material/web": "/node_modules/@material/web",
    },
  },
});
