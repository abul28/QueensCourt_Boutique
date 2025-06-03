import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192x192.png', 'icons/qcb-logo.png'],
      manifest: {
        name: 'Queens Court',
        short_name: 'QueensCourt',
        description: 'Queens Court Fashion Store',
        start_url: '/',
        display: 'standalone',
        background_color: '#3E0066',
        theme_color: '#000000', // deep pink/maroon — adjust as needed
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/qcb-logo.png',
            sizes: '512x512',
            type: 'image/png',
          }
        ]
      }
    })
  ]
});
