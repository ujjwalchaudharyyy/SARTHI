import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    allowedHosts: ['sarthi-d8my.onrender.com', '.onrender.com', 'localhost', '127.0.0.1'],
  },
  preview: {
    host: '0.0.0.0',
    port: 10000,
    allowedHosts: ['sarthi-d8my.onrender.com', '.onrender.com', 'localhost', '127.0.0.1'],
  },
})

