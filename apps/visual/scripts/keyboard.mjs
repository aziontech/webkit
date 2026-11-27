#!/usr/bin/env node

import { existsSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

import { chromium } from '@playwright/test'

import {
  baselineKey,
  blockTarget,
  DEMO_ROUTES,
  KEYBOARD_BASELINE,
  newViolations,
  readKeyboardBaseline,
  sweepKeyboard
} from '../tests/keyboard.ts'
import { blocks, exampleGroups, stem } from '../tests/lib.ts'

const { values } = parseArgs({
  options: {
    base: { type: 'string', default: 'http://localhost:4173' },
    demos: { type: 'string', default: 'http://localhost:4174' },
    widths: { type: 'string', default: '1280' },
    only: { type: 'string', default: 'pages,examples,blocks,demos' },
    all: { type: 'boolean', default: false },
    filter: { type: 'string', default: '' },
    workers: { type: 'string', default: '6' },
    'write-baseline': { type: 'boolean', default: false },
    init: { type: 'boolean', default: false },
    json: { type: 'string', default: '' }
  }
})

const DIST = resolve(dirname(fileURLToPath(import.meta.url)), '../../docs/dist')

function docsPages() {
  if (!values.all) {
    const foundations = join(DIST, 'foundations')
    return [
      '/',
      '/foundations',
      ...(existsSync(foundations)
        ? readdirSync(foundations, { withFileTypes: true })
            .filter((entry) => entry.isDirectory())
            .map((entry) => `/foundations/${entry.name}`)
            .sort()
        : [])
    ]
  }
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
  ...(only.has('pages')
    ? docsPages().map((path) => ({ path, url: `${values.base}${path}`, target: { entry: 'page' } }))
    : []),
  ...(only.has('examples')
    ? exampleGroups().flatMap((group) =>
        (values.all ? group.examples : group.examples.slice(0, 1)).map((example) => {
          const path = `/frame/example/${group.dir}/${stem(example.file)}`
          return { path, url: `${values.base}${path}`, target: { entry: 'page' }, example: true }
        })
      )
    : []),
  ...(only.has('blocks')
    ? blocks().flatMap((block) =>
        (values.all ? block.states : block.states.slice(0, 1)).map((state) => {
          const path = `/frame/block/${block.id}/${state.slug}`
          return { path, url: `${values.base}${path}`, target: blockTarget(block.id) }
        })
      )
    : []),
  ...(only.has('demos')
    ? DEMO_ROUTES.map((route) => ({
        path: `demos${route.path}`,
        url: `${values.demos}${route.path}`,
        target: route.target
      }))
    : [])
].filter((route) => new RegExp(values.filter).test(route.path))

const jobs = values.widths
  .split(',')
  .map(Number)
  .flatMap((width) => routes.map((route) => ({ ...route, width })))

const browser = await chromium.launch()
const results = []
let next = 0

async function worker() {
  while (next < jobs.length) {
    const job = jobs[next++]
    const context = await browser.newContext({
      viewport: { width: job.width, height: job.width < 600 ? 844 : 900 },
      colorScheme: 'light',
      reducedMotion: 'reduce',
      locale: 'en-US',
      timezoneId: 'UTC'
    })
    await context.route(
      (url) => url.hostname !== 'localhost',
      (route) => route.abort()
    )
    await context.addInitScript(() => {
      try {
        for (const key of ['azion-ui-docs:', 'azion-ui-demos:']) {
          localStorage.setItem(`${key}theme`, 'light')
          localStorage.setItem(`${key}dir`, 'ltr')
          localStorage.setItem(`${key}locale`, 'en')
        }
      } catch {}
    })
    const page = await context.newPage()
    await page.clock.setFixedTime(new Date('2026-11-10T12:00:00Z'))
    try {
      await page.goto(`${job.url}?theme=light&dir=ltr`, {
        waitUntil: 'networkidle',
        timeout: 30_000
      })
      if (job.example) await page.locator('[data-example][data-ready]').waitFor({ timeout: 15_000 })
      await page.evaluate(async () => {
        await document.fonts.ready
        await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)))
      })
      const result = await sweepKeyboard(page, job.target)
      results.push({ key: baselineKey(job.path, job.width), ...result })
    } catch (error) {
      results.push({
        key: baselineKey(job.path, job.width),
        error: String(error).split('\n')[0].slice(0, 160)
      })
    }
    await context.close()
  }
}

await Promise.all(Array.from({ length: Number(values.workers) }, worker))
await browser.close()

results.sort((a, b) => a.key.localeCompare(b.key))
const baseline = readKeyboardBaseline()
let total = 0
let fresh = 0
const kinds = {}
for (const result of results) {
  if (result.error) {
    console.log(`${result.key}\n  error ${result.error}`)
    continue
  }
  if (result.violations.length === 0) continue
  const added = newViolations(result.violations, baseline[result.key])
  console.log(`${result.key} (${result.stops} stops${result.limit ? ', limit' : ''})`)
  for (const violation of result.violations) {
    total++
    const kind = violation.split(':')[0]
    kinds[kind] = (kinds[kind] ?? 0) + 1
    console.log(`  ${added.includes(violation) ? '+' : ' '} ${violation}`)
  }
  fresh += added.length
}

if (values.json) writeFileSync(values.json, `${JSON.stringify(results, null, 2)}\n`)

if (values['write-baseline']) {
  const next = {}
  for (const result of results) {
    if (result.error) {
      if (baseline[result.key]) next[result.key] = baseline[result.key]
      continue
    }
    const kept = values.init
      ? result.violations
      : newViolations(
          baseline[result.key] ?? [],
          newViolations(baseline[result.key] ?? [], result.violations)
        )
    if (kept.length > 0) next[result.key] = [...kept].sort()
  }
  for (const [key, list] of Object.entries(baseline))
    if (!results.some((result) => result.key === key)) next[key] = list
  const sorted = Object.fromEntries(Object.entries(next).sort(([a], [b]) => a.localeCompare(b)))
  writeFileSync(KEYBOARD_BASELINE, `${JSON.stringify(sorted, null, 2)}\n`)
  console.log(
    `${relative(process.cwd(), KEYBOARD_BASELINE)} written: ${Object.keys(sorted).length} pages${values.init ? '' : ' (only shrinks; pass --init to record new violations)'}`
  )
}

console.log(
  `${jobs.length} pages checked, ${results.filter((r) => r.violations?.length).length} with violations, ${total} violations (${Object.entries(
    kinds
  )
    .map(([kind, count]) => `${kind} ${count}`)
    .join(', ')}), ${fresh} not in the baseline, ${results.filter((r) => r.error).length} errors`
)
process.exitCode = fresh > 0 || results.some((r) => r.error) ? 1 : 0
