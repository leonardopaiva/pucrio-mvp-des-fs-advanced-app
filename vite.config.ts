import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
/* 
workbox example:
  workbox: {
        runtimeCaching: [
          {
            //urlPattern: /^\/api\/.*/  // Define the URL pattern for API calls
//handler: 'CacheFirst', // Cache First strategy
//options: {
// cacheName: 'api-cache', // Cache name
// expiration: {
//  maxEntries: 50, // Set the maximum number of items in the cache
//  maxAgeSeconds: 60 * 60 * 24, // Cache expiration time (1 day)
// },
// cacheableResponse: {
//   statuses: [0, 200], // Cache responses with status 0 to 200
// },
// },
//  },
// ],
// },
/*
     or 

     urlPattern: ({ url}) => {
      return url.pathname.startsWith("/api")
     }
      */
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'mask-icon.svg',
        'logo.svg',
        'vite.svg',
        'cache-static-resources/**/*',  // Include any file inside cache-resources
      ],
      manifest: {
        name: 'Book My Appointments',
        short_name: 'Book My Appointments',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          // Cache for external images (any image with .jpg, .jpeg, .png, .gif, .svg extension)
          {
            urlPattern: /^https?:\/\/.*\.(jpg|jpeg|png|gif|svg)$/i,    // Pattern for any image
            handler: 'CacheFirst',  // CacheFirst strategy
            options: {
              cacheName: 'external-images-cache',  // Cache name
              expiration: {
                maxEntries: 100,  // Limit to 100 entries in the cache
                maxAgeSeconds: 60 * 60 * 24 * 7,  // Expiration of 1 week
              },
              cacheableResponse: {
                statuses: [0, 200],  // Cache only responses with status 0 or 200
              },
            },
          },
        ],
      },
    }),
  ],
  server: {
    port: 3000
  }
});

//urlPattern: /(\.jpg|\.jpeg|\.png|\.gif|\.svg)$/i,  // Pattern for any image
