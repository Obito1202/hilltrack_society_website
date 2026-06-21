import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" makes the build work on GitHub Pages even under a subfolder
export default defineConfig({
  plugins: [react()],
  base: "./",
});
