import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@aziontech/webkit': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    include: ['src/**/*.test.{ts,js}'],
    setupFiles: ['./src/test/setup.ts'],
    browser: {
      enabled: true,
      provider: 'playwright',
      headless: true,
      name: 'chromium'
    }
  }
})
