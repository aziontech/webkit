import vue from '@vitejs/plugin-vue'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('test')
  },
  test: {
    include: ['src/**/*.test.{ts,js}'],
    setupFiles: ['./src/test/setup.ts'],
    retry: process.env.CI ? 2 : 0,
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [{ browser: 'chromium' }]
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/components/**/*.{vue,ts}'],
      exclude: [
        '**/*.test.{ts,js}',
        '**/*.stories.*',
        '**/*.figma.ts',
        '**/index.ts',
        '**/injection-key.ts',
        '**/presets/**',
        'src/test/**'
      ]
    }
  }
})
