#!/usr/bin/env node

import { existsSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

import { chromium } from '@playwright/test'

import { findTightRegions } from '../tests/region-gaps.ts'
import { blocks, exampleGroups, stem } from '../tests/lib.ts'

const { values } = parseArgs({
  options: {
    base: { type: 'string', default: 'http://localhost:4173' },
    widths: { type: 'string', default: '390,1280' },
    themes: { type: 'string', default: 'light' },
    dir: { type: 'string', default: 'ltr' },
    only: { type: 'string', default: 'pages,examples,blocks' },
    filter: { type: 'string', default: '' },
    workers: { type: 'string', default: '6' }
  }
})

const DIST = resolve(dirname(fileURLToPath(import.meta.url)), '../../docs/dist')

function pages() {
  const out = []
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name)
      if (statSync(path).isDirectory()) {
        if (!['frame', '_app', 'assets', 'llms'].includes(name) && !name.startsWith('.')) walk(path)
      } else if (name === 'index.html') out.push(`/${relative(DIST, dir)}`)
    }
  }
  if (existsSync(DIST)) walk(DIST)
  return out.sort()
}

const only = new Set(values.only.split(','))
const routes = [
  ...(only.has('pages') ? pages() : []),
  ...(only.has('examples')
    ? exampleGroups().flatMap((group) =>
        group.examples.map((example) => `/frame/example/${group.dir}/${stem(example.file)}`)
      )
    : []),
  ...(only.has('blocks')
    ? blocks().flatMap((block) =>
        block.states.map((state) => `/frame/block/${block.id}/${state.slug}`)
      )
    : [])
].filter((route) => new RegExp(values.filter).test(route))

const jobs = values.widths
  .split(',')
  .map(Number)
  .flatMap((width) =>
    values.themes.split(',').flatMap((theme) => routes.map((route) => ({ route, width, theme })))
  )

const browser = await chromium.launch()
const failures = []
let next = 0

async function worker() {
  while (next < jobs.length) {
    const { route, width, theme } = jobs[next++]
    const context = await browser.newContext({
      viewport: { width, height: width < 600 ? 844 : 900 },
      colorScheme: theme,
      reducedMotion: 'reduce'
    })
    await context.addInitScript(
      ({ theme, dir }) => {
        try {
          localStorage.setItem('azion-ui-docs:theme', theme)
          localStorage.setItem('azion-ui-docs:dir', dir)
        } catch {}
      },
      { theme, dir: values.dir }
    )
    const page = await context.newPage()
    try {
      const params = new URLSearchParams({ theme, dir: values.dir })
      await page.goto(`${values.base}${route}?${params}`, {
        waitUntil: 'networkidle',
        timeout: 30_000
      })
      await page.evaluate(() => document.fonts.ready)
      const lines = await page.evaluate(findTightRegions)
      if (lines.length > 0) failures.push({ route, width, theme, lines })
    } catch (error) {
      failures.push({ route, width, theme, error: String(error).slice(0, 120) })
    }
    await context.close()
  }
}

await Promise.all(Array.from({ length: Number(values.workers) }, worker))
await browser.close()

let count = 0
for (const failure of failures.sort(
  (a, b) => a.route.localeCompare(b.route) || a.width - b.width
)) {
  console.log(`${failure.route} ${failure.theme} ${failure.width}`)
  if (failure.error) console.log(`  error ${failure.error}`)
  for (const line of failure.lines ?? []) {
    count++
    console.log(
      `  at ${line.at}px, gap ${line.gap}px (min ${line.min}px): ${line.above} | ${line.below}`
    )
  }
}
console.log(
  `${jobs.length} pages checked, ${failures.filter((f) => f.lines).length} with tight regions, ${count} tight region gaps, ${failures.filter((f) => f.error).length} errors`
)
process.exitCode = count > 0 || failures.some((f) => f.error) ? 1 : 0
