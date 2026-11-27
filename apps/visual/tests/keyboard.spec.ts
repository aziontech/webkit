import { existsSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, type Page, test } from '@playwright/test'

import {
  baselineKey,
  blockTarget,
  DEMO_ROUTES,
  type KeyboardTarget,
  newViolations,
  readKeyboardBaseline,
  sweepKeyboard
} from './keyboard'
import { blocks, DEMOS, DOCS, exampleGroups, type Mode, prepare, query, settle, stem } from './lib'

const WIDTH = 1280
const MODE: Mode = { theme: 'light', width: WIDTH }
const BASELINE = readKeyboardBaseline()

const FOUNDATIONS = resolve(dirname(fileURLToPath(import.meta.url)), '../../docs/dist/foundations')

const foundationPages = () =>
  existsSync(FOUNDATIONS)
    ? readdirSync(FOUNDATIONS, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => `/foundations/${entry.name}`)
        .sort()
    : []

async function expectKeyboard(page: Page, key: string, target: KeyboardTarget) {
  const result = await sweepKeyboard(page, target)
  const fresh = newViolations(result.violations, BASELINE[key])
  const fixed = newViolations(BASELINE[key] ?? [], result.violations)
  if (fixed.length > 0)
    test.info().annotations.push({
      type: 'keyboard baseline can shrink',
      description: `${key}: ${fixed.join('; ')} (run scripts/keyboard.mjs --write-baseline)`
    })
  expect(
    fresh,
    `new keyboard violations on ${key}; every interactive element is reached by Tab, shows a focus ring, and focus is never trapped outside a modal`
  ).toEqual([])
}

const pages = [
  '/',
  ...['/foundations', ...foundationPages()].map((path) => path)
].map((path) => ({ name: `docs ${path}`, path, url: `${DOCS}${path}` }))

for (const { name, path, url } of pages) {
  test(`keyboard ${name}`, async ({ page }) => {
    await prepare(page, MODE)
    await page.goto(`${url}${query(MODE)}`)
    await settle(page)
    await expectKeyboard(page, baselineKey(path, WIDTH), { entry: 'page' })
  })
}

for (const group of exampleGroups()) {
  const [first] = group.examples
  if (!first) continue
  const path = `/frame/example/${group.dir}/${stem(first.file)}`
  test(`keyboard example ${group.dir}/${stem(first.file)}`, async ({ page }) => {
    await prepare(page, MODE)
    await page.goto(`${DOCS}${path}${query(MODE)}`)
    await page.locator('[data-example][data-ready]').waitFor()
    await settle(page)
    await expectKeyboard(page, baselineKey(path, WIDTH), { entry: 'page' })
  })
}

for (const block of blocks()) {
  const [state] = block.states
  if (!state) continue
  const path = `/frame/block/${block.id}/${state.slug}`
  test(`keyboard block ${block.id} ${state.slug}`, async ({ page }) => {
    await prepare(page, MODE)
    await page.goto(`${DOCS}${path}${query(MODE)}`)
    await settle(page)
    await expectKeyboard(page, baselineKey(path, WIDTH), blockTarget(block.id))
  })
}

for (const route of DEMO_ROUTES) {
  const path = `demos${route.path}`
  test(`keyboard demo ${route.name}`, async ({ page }) => {
    await prepare(page, MODE)
    await page.goto(`${DEMOS}${route.path}${query(MODE)}`)
    await settle(page)
    await expectKeyboard(page, baselineKey(path, WIDTH), route.target)
  })
}
