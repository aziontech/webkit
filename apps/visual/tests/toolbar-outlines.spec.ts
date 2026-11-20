import { existsSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, type Page, test } from '@playwright/test'

import { blocks, DOCS, exampleGroups, label, type Mode, prepare, query, settle, stem } from './lib'
import { findMixedToolbarOutlines } from './toolbar-outlines'

const WIDTHS = [390, 1280]

const FOUNDATIONS = resolve(dirname(fileURLToPath(import.meta.url)), '../../docs/dist/foundations')

const foundationPages = () =>
  existsSync(FOUNDATIONS)
    ? readdirSync(FOUNDATIONS, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => `/foundations/${entry.name}`)
        .sort()
    : []

async function expectOneOutline(page: Page) {
  await expect
    .poll(
      async () =>
        (await page.evaluate(findMixedToolbarOutlines)).map(
          (pair) =>
            `${pair.toolbar}: ${pair.first} (${pair.firstColor}) | ${pair.second} (${pair.secondColor}), ${pair.height}px`
        ),
      {
        message:
          'side-by-side outlined controls in one toolbar draw two border colours: a header control takes the toolbar outline, only a text field keeps the field outline',
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
    test(`one outline per toolbar ${name} ${label(mode)}`, async ({ page }) => {
      await prepare(page, mode)
      await page.goto(`${DOCS}${path}${query(mode)}`)
      await settle(page)
      await expectOneOutline(page)
    })
  }
}

for (const group of exampleGroups()) {
  const [first] = group.examples
  if (!first) continue
  for (const width of WIDTHS) {
    const mode: Mode = { theme: 'light', width }
    test(`one outline per toolbar example ${group.dir}/${stem(first.file)} ${label(mode)}`, async ({
      page
    }) => {
      await prepare(page, mode)
      await page.goto(`${DOCS}/frame/example/${group.dir}/${stem(first.file)}${query(mode)}`)
      await page.locator('[data-example][data-ready]').waitFor()
      await settle(page)
      await expectOneOutline(page)
    })
  }
}

for (const block of blocks()) {
  const [state] = block.states
  if (!state) continue
  for (const width of WIDTHS) {
    const mode: Mode = { theme: 'light', width }
    test(`one outline per toolbar block ${block.id} ${state.slug} ${label(mode)}`, async ({ page }) => {
      await prepare(page, mode)
      await page.goto(`${DOCS}/frame/block/${block.id}/${state.slug}${query(mode)}`)
      await settle(page)
      await expectOneOutline(page)
    })
  }
}
