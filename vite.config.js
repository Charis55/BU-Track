import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Disable service worker in development — it intercepts routes and causes blank screens
      devOptions: {
        enabled: false
      },
      manifest: {
        name: 'BU-Track V2',
        short_name: 'BU-Track',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: '/favicon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        // Ensure all SPA routes fall back to index.html
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api/, /^\/registerSW\.js/]
      }
    })
  ],
})
