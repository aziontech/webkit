import { existsSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, type Page, test } from '@playwright/test'

import { blocks, DOCS, exampleGroups, label, type Mode, prepare, query, settle, stem } from './lib'
import { findTextOnLines } from './text-on-line'

const WIDTHS = [390, 1280]

const FOUNDATIONS = resolve(dirname(fileURLToPath(import.meta.url)), '../../docs/dist/foundations')

const foundationPages = () =>
  existsSync(FOUNDATIONS)
    ? readdirSync(FOUNDATIONS, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => `/foundations/${entry.name}`)
        .sort()
    : []

async function expectTextOffLines(page: Page) {
  const findings = await page.evaluate(findTextOnLines)
  expect(
    findings.map(
      (finding) =>
        `gap ${finding.gap}px (min ${finding.min}px) at ${finding.at}px: ${finding.text} sits on the line ${finding.side} it, ${finding.line}`
    ),
    'text sits on a border or divider: give the text block padding on that side (at least --spacing-2xs, a card region uses --spacing-md)'
  ).toEqual([])
}

const pages: { name: string; path: string }[] = [
  { name: 'docs home', path: '/' },
  { name: 'docs /components', path: '/components' },
  { name: 'docs /blocks', path: '/blocks' },
  ...['/foundations', ...foundationPages()].map((path) => ({ name: `docs ${path}`, path }))
]

for (const { name, path } of pages) {
  for (const width of WIDTHS) {
    const mode: Mode = { theme: 'light', width }
    test(`text on line ${name} ${label(mode)}`, async ({ page }) => {
      await prepare(page, mode)
      await page.goto(`${DOCS}${path}${query(mode)}`)
      await settle(page)
      await expectTextOffLines(page)
    })
  }
}

for (const group of exampleGroups()) {
  const [first] = group.examples
  if (!first) continue
  for (const width of WIDTHS) {
    const mode: Mode = { theme: 'light', width }
    test(`text on line example ${group.dir}/${stem(first.file)} ${label(mode)}`, async ({
      page
    }) => {
      await prepare(page, mode)
      await page.goto(`${DOCS}/frame/example/${group.dir}/${stem(first.file)}${query(mode)}`)
      await page.locator('[data-example][data-ready]').waitFor()
      await settle(page)
      await expectTextOffLines(page)
    })
  }
}

for (const block of blocks()) {
  const [state] = block.states
  if (!state) continue
  for (const width of WIDTHS) {
    const mode: Mode = { theme: 'light', width }
    test(`text on line block ${block.id} ${state.slug} ${label(mode)}`, async ({ page }) => {
      await prepare(page, mode)
      await page.goto(`${DOCS}/frame/block/${block.id}/${state.slug}${query(mode)}`)
      await settle(page)
      await expectTextOffLines(page)
    })
  }
}
