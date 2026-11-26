import { existsSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, type Page, test } from '@playwright/test'

import { blocks, DOCS, exampleGroups, label, type Mode, prepare, query, settle, stem } from './lib'
import { findMixedToolbarHeights } from './toolbar-heights'

const WIDTHS = [390, 1280]

const FOUNDATIONS = resolve(dirname(fileURLToPath(import.meta.url)), '../../docs/dist/foundations')

const foundationPages = () =>
  existsSync(FOUNDATIONS)
    ? readdirSync(FOUNDATIONS, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => `/foundations/${entry.name}`)
        .sort()
    : []

async function expectOneHeight(page: Page) {
  await expect
    .poll(
      async () =>
        (await page.evaluate(findMixedToolbarHeights)).map(
          (pair) =>
            `${pair.toolbar}: ${pair.first} ${pair.firstHeight}px | ${pair.second} ${pair.secondHeight}px`
        ),
      {
        message:
          'controls side by side in one toolbar row have different heights: every control in a row takes the same size, its border included',
        timeout: 10_000
      }
    )
    .toEqual([])
}

const pages: { name: string; path: string; modes: Mode[] }[] = [
  {
    name: 'docs home',
    path: '/',
    modes: [
      ...WIDTHS.map((width) => ({ theme: 'dark' as const, width })),
      ...WIDTHS.map((width) => ({ theme: 'light' as const, width }))
    ]
  },
  ...['/foundations', ...foundationPages()].map((path) => ({
    name: `docs ${path}`,
    path,
    modes: WIDTHS.map((width) => ({ theme: 'light' as const, width }))
  }))
]

for (const { name, path, modes } of pages) {
  for (const mode of modes) {
    test(`one height per toolbar ${name} ${label(mode)}`, async ({ page }) => {
      await prepare(page, mode)
      await page.goto(`${DOCS}${path}${query(mode)}`)
      await settle(page)
      await expectOneHeight(page)
    })
  }
}

for (const group of exampleGroups()) {
  const [first] = group.examples
  if (!first) continue
  for (const width of WIDTHS) {
    const mode: Mode = { theme: 'light', width }
    test(`one height per toolbar example ${group.dir}/${stem(first.file)} ${label(mode)}`, async ({
      page
    }) => {
      await prepare(page, mode)
      await page.goto(`${DOCS}/frame/example/${group.dir}/${stem(first.file)}${query(mode)}`)
      await page.locator('[data-example][data-ready]').waitFor()
      await settle(page)
      await expectOneHeight(page)
    })
  }
}

for (const block of blocks()) {
  const [state] = block.states
  if (!state) continue
  for (const width of WIDTHS) {
    const mode: Mode = { theme: 'light', width }
    test(`one height per toolbar block ${block.id} ${state.slug} ${label(mode)}`, async ({
      page
    }) => {
      await prepare(page, mode)
      await page.goto(`${DOCS}/frame/block/${block.id}/${state.slug}${query(mode)}`)
      await settle(page)
      await expectOneHeight(page)
    })
  }
}
