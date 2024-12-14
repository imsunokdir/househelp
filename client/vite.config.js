import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/auth": {
        target: process.env.VITE_ROOT_ROUTE,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth/, ""), // Optional path rewrite
      },
      "/api": {
        target: process.env.VITE_ROOT_ROUTE, // Backend server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // Adjust backend paths if necessary
      },
    },
    historyApiFallback: true,
  },
});
