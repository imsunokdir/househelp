import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import withMT from "@material-tailwind/react/utils/withMT";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [
        "@material-tailwind/react", // Externalize the material-tailwind package
      ],
    },
  },
  // server: {
  //   proxy: {
  //     "/auth": {
  //       target: import.meta.env.VITE_ROOT_ROUTE,
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/auth/, ""), // Optional path rewrite
  //     },
  //     "/api": {
  //       target: import.meta.env.VITE_ROOT_ROUTE, // Backend server
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, ""), // Adjust backend paths if necessary
  //     },
  //   },
  // },
});
