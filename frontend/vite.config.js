import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Runs the frontend on port 3000
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  define: {
    // Define environment variables for the build
    'process.env': {
      VITE_API_URL: process.env.VITE_API_URL || 'http://localhost:5000',
      VITE_SOCKET_URL: process.env.VITE_SOCKET_URL || 'http://localhost:5000'
    }
  }
});