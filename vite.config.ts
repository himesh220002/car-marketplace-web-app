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
  // Define global constants for test environment
  // This will replace import.meta.env.VITE_SENDBIRD_APP_ID with "test-app-id"
  // and import.meta.env.VITE_SENDBIRD_API_TOKEN with "test-api-token"
  define: {
    'import.meta.env.VITE_SENDBIRD_APP_ID': JSON.stringify('test-app-id'),
    'import.meta.env.VITE_SENDBIRD_API_TOKEN': JSON.stringify('test-api-token'),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts', // or directly use '@testing-library/jest-dom' if no other setup is needed
  },
})
