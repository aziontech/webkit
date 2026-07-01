import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

// Webkit runs its tests in a REAL browser (Playwright Chromium) via
// @vitest/browser — never jsdom. Focus, <Teleport>, layout/getBoundingClientRect
// and keyboard behave like production, so tests can't pass on jsdom no-ops.
// See .claude/rules/testing.md.
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // Self-reference the public entry so `@aziontech/webkit/<name>` in stories
      // resolves to this package's source during tests.
      '@aziontech/webkit': '@aziontech/webkit.dev',
      // Stable handle for the Storybook stories dir, so co-located tests import
      // stories via `@stories/...` instead of brittle ../../../../../ paths.
      '@stories': fileURLToPath(new URL('../../apps/storybook/src/stories', import.meta.url))
    }
  },
  test: {
    include: ['src/**/*.test.{ts,js}'],
    setupFiles: ['./src/test/setup.ts'],
    browser: {
      enabled: true,
      provider: 'playwright',
      headless: true,
      instances: [{ browser: 'chromium' }]
    }
  }
})
