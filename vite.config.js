import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react')) return 'vendor'
          if (id.includes('node_modules/react-dom')) return 'vendor'
          if (id.includes('node_modules/react-router-dom')) return 'vendor'
          if (id.includes('/pages/AIAgent')) return 'ai'
          if (id.includes('/pages/ContentGenerator')) return 'ai'
        },
      },
    },
  },
})
