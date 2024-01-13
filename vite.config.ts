import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
  },
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@hooks': '/src/hooks',
      '@pages': '/src/pages',
      '@styles': '/src/styles',
      '@utils': '/src/utils',
      '@layouts': '/src/layouts',
    },
  },
})
