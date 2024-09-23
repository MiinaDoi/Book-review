/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),tsconfigPaths()],
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
  }
})
