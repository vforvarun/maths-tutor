import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/maths-tutor/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Eureka! Maths Tutor',
        short_name: 'Eureka!',
        description: 'Year 9–10 maths: clear explanations, animated lessons, practice and exam prep.',
        theme_color: '#6246ea',
        background_color: '#f8f7ff',
        display: 'standalone',
        icons: [
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: { globPatterns: ['**/*.{js,css,html,svg,png,woff,woff2,ttf}'], maximumFileSizeToCacheInBytes: 4 * 1024 * 1024 },
    }),
  ],
})
