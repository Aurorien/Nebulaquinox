import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/data": "http://localhost:3000",
      "/data/post": "http://localhost:3000",
      "/data/docking-status": "http://localhost:3000",
      "/data/edit": "http://localhost:3000",
      "/data/depart/": "http://localhost:3000",
    },
  },
  build: {
    sourcemap: true,
  },
});
