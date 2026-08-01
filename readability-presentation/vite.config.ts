import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/ChatGPT/readability-presentation/",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        presenter: "presenter.html",
      },
    },
  },
  server: {
    host: "0.0.0.0",
  },
});
