import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/auth": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth/, ""), // Optional path rewrite
      },
      "/api": {
        target: "http://localhost:8000", // Backend server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // Adjust backend paths if necessary
      },
    },
  },
});
