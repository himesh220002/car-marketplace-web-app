/// <reference types="vitest" />
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts', // or directly use '@testing-library/jest-dom' if no other setup is needed
  },
})
