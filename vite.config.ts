import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa'; // <-- 1. Impor plugin PWA

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react( ),
    // --- 2. Tambahkan konfigurasi plugin di sini ---
    VitePWA({
      registerType: 'autoUpdate', // Otomatis update service worker jika ada versi baru
      devOptions: {
        enabled: true // Aktifkan PWA saat development untuk testing
      },
      manifest: {
        name: 'Permuridhis Resource and Inventory Management Ecosystem',
        short_name: 'PRIME',
        description: 'Aplikasi manajemen sumber daya dan inventaris Permuridhis.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png', // Nama file ikon di folder /public
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png', // Nama file ikon di folder /public
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png', // Ikon untuk Apple touch
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable', // 'maskable' penting untuk ikon adaptif
          },
        ],
      },
    }),
    // -----------------------------------------
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});