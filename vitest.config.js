import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  cacheDir: 'node_modules/.vite',

  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/tests/setup.js'],
    testTimeout: 10000,
    hookTimeout: 10000,

    pool: 'threads',           // ⭐ threads pool
    isolate: false,            // ⭐ модулиудыг дахин evaluate хийхгүй

    include: ['src/tests/**/*.test.{js,jsx}'],

    reporters: ['verbose'],
  },
});