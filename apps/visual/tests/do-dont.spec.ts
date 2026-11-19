import { existsSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, test } from '@playwright/test'

import { findBrokenPairs, findPairContrastFailures } from './do-dont'
import { DOCS, prepare, query, settle } from './lib'

const DIST = resolve(dirname(fileURLToPath(import.meta.url)), '../../docs/dist')

function routes(dir = DIST, out: string[] = []): string[] {
  if (!existsSync(dir)) return out
  for (const name of readdirSync(dir).sort()) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) routes(path, out)
    else if (name === 'index.html') out.push(`/${relative(DIST, dir)}`.replace(/\/$/, '') || '/')
  }
  return out
}

const pages = routes().filter(
  (route) => !route.startsWith('/llms') && !route.startsWith('/frame') && route !== '/404'
)

for (const path of pages) {
  test(`do and don't side by side ${path}`, async ({ page }) => {
    await prepare(page, { theme: 'light', width: 1280 })
    await page.goto(`${DOCS}${path}${query({ theme: 'light', width: 1280 })}`)
    await settle(page)
    const wide = await page.evaluate(findBrokenPairs)
    const contrast = await page.evaluate(findPairContrastFailures)
    if (await page.locator('[data-slot="do-dont"]').count()) {
      await page.evaluate(() => {
        document.documentElement.dataset.theme = 'dark'
      })
      await settle(page)
      contrast.push(...(await page.evaluate(findPairContrastFailures)))
      await page.evaluate(() => {
        document.documentElement.dataset.theme = 'light'
      })
    }
    await page.setViewportSize({ width: 390, height: 844 })
    await settle(page)
    const narrow = await page.evaluate(findBrokenPairs)
    expect(
      [
        ...wide.map((finding) => `1280: ${finding.kind} ${finding.where}`),
        ...narrow.map((finding) => `390: ${finding.kind} ${finding.where}`)
      ],
      "a Do and a Don't render through the shared pair (apps/docs/README.md, Do and Don't): two columns from md, Do first when stacked"
    ).toEqual([])
    expect(
      contrast.map((finding) => `${finding.kind} ${finding.where}`),
      "every label, icon, text and code in a Do / Don't card meets WCAG 2.1 against the card, light and dark (apps/docs/README.md, Do and Don't)"
    ).toEqual([])
  })
}
