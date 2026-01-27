import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),react()],
  server: {
    host: false,
    allowedHosts: ['motoserviciovm.com', 'www.motoserviciovm.com'],
    port: 4001,
  },
})
