import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/**
 * Vite Configuration — Attendly React Frontend
 * =============================================
 * The dev server runs on port 5173.
 * The proxy forwards all /api/* requests to the Express backend
 * running on port 5000 — so fetch('/api/auth/login') in React
 * automatically hits http://localhost:5000/api/auth/login.
 * This means no CORS headers are needed during development.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Any request starting with /api is forwarded to Express
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
