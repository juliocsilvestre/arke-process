import path from 'path'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 80,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': '/src/components',
      '@hooks': '/src/hooks',
      '@pages': '/src/pages',
      '@styles': '/src/styles',
      '@utils': '/src/utils',
      '@layouts': '/src/layouts',
    },
  },
})
