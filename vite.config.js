import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/",
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8090', // Puerto correcto según tu configuración
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
