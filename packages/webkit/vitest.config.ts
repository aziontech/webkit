import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('test')
  },
  resolve: {
    alias: {
      '@aziontech/webkit': '@aziontech/webkit.dev'
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
