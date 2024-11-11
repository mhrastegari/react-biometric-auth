import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";

// https://vite.dev/config/
export default defineConfig({
  base: "/rect-biometric-auth/",
  plugins: [react(), mkcert()],
  server: {
    port: 8585,
    https: true,
    host: "localhost",
  },
});
