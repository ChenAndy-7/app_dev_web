import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/app_dev_web/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5175',  // Proxy API requests to the backend running on port 5175
    },
  },
})
