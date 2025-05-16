// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  
  // Configure the server
  server: {
    port: 3000,
    open: true // Automatically open browser on start
  },
  
  // Build configuration
  build: {
    outDir: 'dist', // Output directory
    sourcemap: true // Generate source maps for debugging
  },
  
  // Public directory for static assets
  publicDir: 'public',
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['jspdf', 'jspdf-autotable']
  }
});