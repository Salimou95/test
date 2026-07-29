import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5173,
    // Proxy : /api est redirigé vers le faux backend Express.
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
});
