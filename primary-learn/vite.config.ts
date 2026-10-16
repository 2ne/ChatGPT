import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const pagesBase = "/ChatGPT/primary-learn/";

export default defineConfig({
  base: pagesBase,
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
  },
  preview: {
    host: "0.0.0.0",
  },
});
