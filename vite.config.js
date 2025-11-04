import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Copiar .htaccess al directorio de salida
    copyPublicDir: true
  },
  // Configurar base path (usar '/' para el root del dominio)
  base: '/'
})