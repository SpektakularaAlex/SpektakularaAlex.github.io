import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ isSsrBuild }) => ({
  // Relative paths, so the build works at /My_website/ and at a root URL.
  base: "./",
  plugins: [react()],
  build: { copyPublicDir: !isSsrBuild },
}));
