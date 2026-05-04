import { defineConfig } from 'vite';
import webfontDownload from 'vite-plugin-webfont-dl';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

const INTER_FONT_URL = 'https://fonts.googleapis.com/css2?family=Inter:wght@400..600&display=swap' as const;

export default defineConfig({
  plugins: [vue(), webfontDownload([INTER_FONT_URL])],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/core', '@ffmpeg/util'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
