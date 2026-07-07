import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

// Webkit runs its tests in a REAL browser (Playwright Chromium) via
// @vitest/browser — never jsdom. Focus, <Teleport>, layout/getBoundingClientRect
// and keyboard behave like production, so tests can't pass on jsdom no-ops.
// See .claude/rules/testing.md.
export default defineConfig({
  plugins: [vue()],
  // @testing-library/vue reads process.env.NODE_ENV; the browser has no
  // `process`, so it must be statically replaced or fireEvent throws.
  define: {
    'process.env.NODE_ENV': JSON.stringify('test')
  },
  resolve: {
    alias: {
      // The package name is `@aziontech/webkit.dev`; stories import the public
      // `@aziontech/webkit/<name>` — map it back so it self-resolves via exports.
      '@aziontech/webkit': '@aziontech/webkit.dev'
    }
  },
  test: {
    include: ['src/**/*.test.{ts,js}'],
    setupFiles: ['./src/test/setup.ts'],
    retry: process.env.CI ? 2 : 0,
    browser: {
      enabled: true,
      provider: 'playwright',
      headless: true,
      instances: [{ browser: 'chromium' }]
    }
  }
})
