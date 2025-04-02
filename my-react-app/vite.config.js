import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,  // Ensure this matches your frontend port
  },
  build: {
    outDir: "dist", // Ensure this matches Netlify’s publish directory
  },
});