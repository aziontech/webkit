import { existsSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, type Page, test } from '@playwright/test'

import { findDoubledLines } from './doubled-lines'
import { blocks, DOCS, exampleGroups, label, type Mode, prepare, query, settle, stem } from './lib'

const WIDTHS = [390, 1280]

const FOUNDATIONS = resolve(dirname(fileURLToPath(import.meta.url)), '../../docs/dist/foundations')

const foundationPages = () =>
  existsSync(FOUNDATIONS)
    ? readdirSync(FOUNDATIONS, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => `/foundations/${entry.name}`)
        .sort()
    : []

async function expectOneHairline(page: Page) {
  const lines = await page.evaluate(findDoubledLines)
  expect(
    lines.map(
      (line) =>
        `${line.orientation} at ${line.at}px (${line.overlap}px long, gap ${line.gap}px): ${line.first} | ${line.second}`
    ),
    'two visible borders sit flush or 1px apart: the container draws the frame, the parts only the dividers'
  ).toEqual([])
}

const pages: { name: string; path: string; modes: Mode[] }[] = [
  {
    name: 'docs home',
    path: '/',
    modes: [
      ...WIDTHS.map((width) => ({ theme: 'dark' as const, width })),
      { theme: 'light', width: 1280, dir: 'rtl' }
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
    test(`one hairline ${name} ${label(mode)}`, async ({ page }) => {
      await prepare(page, mode)
      await page.goto(`${DOCS}${path}${query(mode)}`)
      await settle(page)
      await expectOneHairline(page)
    })
  }
}

for (const group of exampleGroups()) {
  const [first] = group.examples
  if (!first) continue
  for (const width of WIDTHS) {
    const mode: Mode = { theme: 'light', width }
    test(`one hairline example ${group.dir}/${stem(first.file)} ${label(mode)}`, async ({
      page
    }) => {
      await prepare(page, mode)
      await page.goto(`${DOCS}/frame/example/${group.dir}/${stem(first.file)}${query(mode)}`)
      await page.locator('[data-example][data-ready]').waitFor()
      await settle(page)
      await expectOneHairline(page)
    })
  }
}

for (const block of blocks()) {
  const [state] = block.states
  if (!state) continue
  for (const width of WIDTHS) {
    const mode: Mode = { theme: 'light', width }
    test(`one hairline block ${block.id} ${state.slug} ${label(mode)}`, async ({ page }) => {
      await prepare(page, mode)
      await page.goto(`${DOCS}/frame/block/${block.id}/${state.slug}${query(mode)}`)
      await settle(page)
      await expectOneHairline(page)
    })
  }
}
