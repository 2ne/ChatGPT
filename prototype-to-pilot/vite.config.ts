import { copyFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

function pagesFallbackPlugin(): Plugin {
  return {
    name: "github-pages-fallback",
    closeBundle() {
      const index = path.resolve(rootDir, "dist/index.html");
      const fallback = path.resolve(rootDir, "dist/404.html");
      if (existsSync(index)) copyFileSync(index, fallback);
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss(), pagesFallbackPlugin()],
  server: {
    host: "0.0.0.0",
  },
  preview: {
    host: "0.0.0.0",
  },
});
