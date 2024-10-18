/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths';
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    viteCompression({
      algorithm: 'gzip', // Choose 'gzip', 'brotliCompress', or 'deflate'
      ext: '.gz', // File extension after compression
    }),
  ],
  resolve: {
    alias: {
      '@/': '/src/',
    }
  },
  test: {
    setupFiles: "./tests/setup.ts",
    globals: true,
    environment: 'jsdom',
    css: true,
    include: ['**/*.test.?(c|m)[jt]s?(x)'],
  },
})
