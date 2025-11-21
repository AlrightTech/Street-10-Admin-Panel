import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor'
            }
            if (id.includes('lucide-react')) {
              return 'icons'
            }
            // Other node_modules go into vendor chunk
            return 'vendor'
          }
          
          // Feature-based chunks for pages
          if (id.includes('/src/pages/')) {
            if (id.includes('Product')) {
              return 'products'
            }
            if (id.includes('Order')) {
              return 'orders'
            }
            if (id.includes('Transaction') || id.includes('Earning') || id.includes('Withdrawal')) {
              return 'transactions'
            }
            if (id.includes('Analytics') || id.includes('Report') || id.includes('Sales') || id.includes('Customer')) {
              return 'analytics'
            }
            if (id.includes('Settings') || id.includes('SubVendor') || id.includes('ResetPassword')) {
              return 'settings'
            }
            if (id.includes('SubAdmin')) {
              return 'sub-admin'
            }
            if (id.includes('Chat')) {
              return 'chat'
            }
            if (id.includes('Dashboard')) {
              return 'dashboard'
            }
            if (id.includes('SelectRole')) {
              return 'auth'
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase limit to 1MB
  },
})
