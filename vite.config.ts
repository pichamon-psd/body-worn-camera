import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://www.centrecities.com:3007',
        changeOrigin: true,
      },
      '/proxy': {
        target: 'http://www.centrecities.com:3007',
        changeOrigin: true,
      }
    }
  }
})