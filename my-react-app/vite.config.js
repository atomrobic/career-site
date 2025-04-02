import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    host: true,  // Exposes the app to the network
    port: 4000,  // Change this to any port you prefer
  }

});
