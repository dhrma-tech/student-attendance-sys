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
  // Remove define section to let Vite handle env variables naturally
});