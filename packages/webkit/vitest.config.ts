import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

import { renderOnServer } from './src/test/server-render'

const EXPORTS: Record<string, string> = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8')
).exports
const selfExports = {
  name: 'webkit-self-exports',
  enforce: 'pre' as const,
  resolveId(id: string) {
    if (!id.startsWith('@aziontech/webkit/')) return null
    const target = EXPORTS[`./${id.slice('@aziontech/webkit/'.length)}`]
    return target ? fileURLToPath(new URL(target, import.meta.url)) : null
  }
}

export default defineConfig({
  plugins: [
    selfExports,
    vue({ template: { transformAssetUrls: { includeAbsolute: false } } }),
    tailwindcss()
  ],
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
      instances: [{ browser: 'chromium' }],
      commands: { renderOnServer }
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
