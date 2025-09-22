// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwind(), // <-- required for Tailwind v4 zero-config
  ],
});
