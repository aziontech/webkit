import { defineConfig } from '@playwright/test'

const DOCS_PORT = 4173
const DEMOS_PORT = 4174

export default defineConfig({
  testDir: './tests',
  snapshotPathTemplate: '{testDir}/../baselines/{arg}{ext}',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: Number(process.env.VISUAL_WORKERS ?? (process.env.CI ? 4 : 2)),
  timeout: 60_000,
  reporter: [['list'], ['html', { open: 'never' }]],
  expect: {
    timeout: 15_000,
    toHaveScreenshot: {
      maxDiffPixels: 100,
      animations: 'disabled',
      caret: 'hide',
      scale: 'css'
    }
  },
  use: {
    locale: 'en-US',
    timezoneId: 'UTC',
    reducedMotion: 'reduce',
    deviceScaleFactor: 1
  },
  webServer: [
    {
      command: `node ../docs/scripts/serve.mjs`,
      env: { PORT: String(DOCS_PORT) },
      url: `http://localhost:${DOCS_PORT}/`,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000
    },
    {
      command: `node node_modules/vite/bin/vite.js preview --port ${DEMOS_PORT} --strictPort`,
      cwd: '../demos',
      url: `http://localhost:${DEMOS_PORT}/`,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000
    }
  ]
})
