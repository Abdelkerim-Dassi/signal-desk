import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Dev: the FastAPI backend runs on :8000; /api is proxied so the app uses
// relative URLs in both dev and prod (prod serves frontend/dist same-origin).
// QIRAT_API_PORT moves the proxy when several checkouts run side by side.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': `http://127.0.0.1:${process.env.QIRAT_API_PORT || 8000}`,
    },
  },
})
