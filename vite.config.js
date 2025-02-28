import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  server: {
    watch: {
      usePolling: true, // Fixes issues with changes not reflecting
    },
    hmr: {
      overlay: false, // Removes annoying error overlays
    },
  },
})