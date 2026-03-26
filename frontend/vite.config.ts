import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@lib": path.resolve(import.meta.dirname, "./src/lib"),
      "@app": path.resolve(import.meta.dirname, "./src/app"),
      "@store": path.resolve(import.meta.dirname, "./src/store"),
      "@assets": path.resolve(import.meta.dirname, "./src/assets"),
      "@features": path.resolve(import.meta.dirname, "./src/features"),
      "@components": path.resolve(import.meta.dirname, "./src/components"),

      // NOTE: Testes
      "@fixtures": path.resolve(import.meta.dirname, "./fixtures"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/v1": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
