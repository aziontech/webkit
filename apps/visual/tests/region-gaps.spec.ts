import { existsSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, type Page, test } from '@playwright/test'

import { blocks, DOCS, exampleGroups, label, type Mode, prepare, query, settle, stem } from './lib'
import { findTightRegions } from './region-gaps'

const WIDTHS = [390, 1280]

const FOUNDATIONS = resolve(dirname(fileURLToPath(import.meta.url)), '../../docs/dist/foundations')

const foundationPages = () =>
  existsSync(FOUNDATIONS)
    ? readdirSync(FOUNDATIONS, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => `/foundations/${entry.name}`)
        .sort()
    : []

async function expectRegionGap(page: Page) {
  const regions = await page.evaluate(findTightRegions)
  expect(
    regions.map(
      (region) =>
        `gap ${region.gap}px (min ${region.min}px) at ${region.at}px: ${region.above} | ${region.below}`
    ),
    'two page regions sit closer than the group gap: put them in a stack that carries --layout-section-gap or --layout-group-gap'
  ).toEqual([])
}

const pages: { name: string; path: string }[] = [
  { name: 'docs home', path: '/' },
  ...['/foundations', ...foundationPages()].map((path) => ({ name: `docs ${path}`, path }))
]

for (const { name, path } of pages) {
  for (const width of WIDTHS) {
    const mode: Mode = { theme: 'light', width }
    test(`region gap ${name} ${label(mode)}`, async ({ page }) => {
      await prepare(page, mode)
      await page.goto(`${DOCS}${path}${query(mode)}`)
      await settle(page)
      await expectRegionGap(page)
    })
  }
}

for (const group of exampleGroups()) {
  const [first] = group.examples
  if (!first) continue
  for (const width of WIDTHS) {
    const mode: Mode = { theme: 'light', width }
    test(`region gap example ${group.dir}/${stem(first.file)} ${label(mode)}`, async ({ page }) => {
      await prepare(page, mode)
      await page.goto(`${DOCS}/frame/example/${group.dir}/${stem(first.file)}${query(mode)}`)
      await page.locator('[data-example][data-ready]').waitFor()
      await settle(page)
      await expectRegionGap(page)
    })
  }
}

for (const block of blocks()) {
  const [state] = block.states
  if (!state) continue
  for (const width of WIDTHS) {
    const mode: Mode = { theme: 'light', width }
    test(`region gap block ${block.id} ${state.slug} ${label(mode)}`, async ({ page }) => {
      await prepare(page, mode)
      await page.goto(`${DOCS}/frame/block/${block.id}/${state.slug}${query(mode)}`)
      await settle(page)
      await expectRegionGap(page)
    })
  }
}
