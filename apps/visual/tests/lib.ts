import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { Page } from '@playwright/test'

export const DOCS = 'http://localhost:4173'
export const DEMOS = process.env.VISUAL_DEMOS_URL ?? 'http://localhost:4174'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')
const AZION_UI = join(ROOT, 'packages/ui')

export type Theme = 'light' | 'dark'
export type Mode = { theme: Theme; width: number; dir?: 'ltr' | 'rtl'; locale?: string }

export const label = (mode: Mode) =>
  [mode.theme, mode.width, mode.dir === 'rtl' ? 'rtl' : '', mode.locale ?? '']
    .filter(Boolean)
    .join('-')

const NOW = new Date('2026-11-10T12:00:00Z')

export async function prepare(page: Page, mode: Mode, { freeze = false } = {}) {
  await page.setViewportSize({ width: mode.width, height: mode.width < 600 ? 844 : 900 })
  if (freeze) await page.clock.install({ time: NOW })
  else await page.clock.setFixedTime(NOW)
  await page.route(
    (url) => url.hostname !== 'localhost',
    (route) => route.abort()
  )
  await page.emulateMedia({ colorScheme: mode.theme, reducedMotion: 'reduce' })
  await page.addInitScript(
    ({ theme, dir, locale }) => {
      try {
        for (const key of ['azion-ui-docs:', 'azion-ui-demos:']) {
          localStorage.setItem(`${key}theme`, theme)
          localStorage.setItem(`${key}dir`, dir)
          localStorage.setItem(`${key}locale`, locale)
        }
      } catch {}
    },
    { theme: mode.theme, dir: mode.dir ?? 'ltr', locale: mode.locale ?? 'en' }
  )
}

export async function advance(page: Page, ms: number) {
  await page.waitForLoadState('networkidle')
  await page.clock.runFor(ms)
  await page.evaluate(() => document.fonts.ready)
}

export async function settle(page: Page) {
  await page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => undefined)
  await page.evaluate(async () => {
    await document.fonts.ready
    await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)))
    const frame = () => new Promise((done) => requestAnimationFrame(done))
    const positions = () =>
      [document.scrollingElement, ...document.querySelectorAll('*')]
        .filter((el): el is Element => !!el && el.scrollHeight > el.clientHeight + 1)
        .map((el) => `${el.scrollTop},${el.scrollLeft},${el.scrollHeight}`)
        .join('|')
    let last = positions()
    let still = 0
    const until = performance.now() + 5000
    while (still < 20 && performance.now() < until) {
      await frame()
      const now = positions()
      still = now === last ? still + 1 : 0
      last = now
    }
    for (const root of document.querySelectorAll('[data-pinned]')) {
      for (const el of [root, ...root.querySelectorAll('*')]) {
        if (
          el.scrollHeight > el.clientHeight + 1 &&
          /auto|scroll/.test(getComputedStyle(el).overflowY)
        )
          el.scrollTop = el.scrollHeight
      }
    }
    await frame()
    await frame()
  })
}

export function query(mode: Mode) {
  const params = new URLSearchParams({ theme: mode.theme, dir: mode.dir ?? 'ltr' })
  if (mode.locale) params.set('lang', mode.locale)
  return `?${params}`
}

export type ExampleGroup = {
  component: string
  dir: string
  examples: { name: string; file: string }[]
}

function walk(dir: string, match: (name: string) => boolean, out: string[] = []): string[] {
  if (!existsSync(dir)) return out
  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name)
  )) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) walk(path, match, out)
    else if (match(entry.name)) out.push(path)
  }
  return out
}

export function exampleGroups(): ExampleGroup[] {
  return walk(join(AZION_UI, 'examples'), (name) => name === 'examples.json').map((file) => {
    const data = JSON.parse(readFileSync(file, 'utf8')) as {
      component: string
      examples: { name: string; file: string }[]
    }
    return {
      component: data.component,
      dir: relative(join(AZION_UI, 'examples'), dirname(file)),
      examples: data.examples
    }
  })
}

function slugify(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export type Block = { id: string; states: { name: string; slug: string }[] }

export function blocks(): Block[] {
  return walk(join(AZION_UI, 'blocks'), (name) => name === 'block.json').map((file) => {
    const manifest = JSON.parse(readFileSync(file, 'utf8')) as {
      id?: string
      primary: { name: string }
      variants?: { name: string }[]
    }
    const dir = relative(join(AZION_UI, 'blocks'), dirname(file))
    return {
      id: manifest.id ?? dir,
      states: [manifest.primary, ...(manifest.variants ?? [])].map((state) => ({
        name: state.name,
        slug: slugify(state.name)
      }))
    }
  })
}

export const stem = (file: string) => file.replace(/\.vue$/, '')

export const shot = (path: string) => path.split('/')
