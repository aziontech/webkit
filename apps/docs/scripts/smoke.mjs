import { readdirSync, statSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { chromium } from 'playwright'

import { serve } from './serve.mjs'

const DIST = resolve(dirname(fileURLToPath(import.meta.url)), '../dist')
const AXE = createRequire(import.meta.url).resolve('axe-core/axe.min.js')
const CONCURRENCY = Number(process.env.SMOKE_CONCURRENCY ?? 6)
const AXE_EVERY = Number(process.env.SMOKE_AXE_EVERY ?? 8)

function routes(dir = DIST, out = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) routes(path, out)
    else if (name === 'index.html') out.push(`/${relative(DIST, dir)}`.replace(/\/$/, '') || '/')
  }
  return out.sort()
}

const all = routes().filter((route) => !route.startsWith('/llms'))
const only = process.env.SMOKE_ONLY
  ? all.filter((route) => route.includes(process.env.SMOKE_ONLY))
  : all
const axeRoutes = new Set(
  only.filter(
    (route, at) =>
      at % AXE_EVERY === 0 ||
      ['/', '/components', '/blocks', '/foundations', '/foundations/color'].includes(route)
  )
)

const server = await serve(0)
const origin = `http://localhost:${server.address().port}`
const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })

const failures = []
const axeFailures = []
let axeChecked = 0
let knownPrimary = 0

async function visit(route) {
  const page = await context.newPage()
  const errors = []
  page.on('console', (message) => {
    if (message.type() !== 'error') return
    const url = message.location()?.url ?? ''
    if (url && !url.startsWith(origin)) return
    errors.push(message.text())
  })
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))
  page.on('response', (response) => {
    if (response.url().startsWith(origin) && response.status() >= 400)
      errors.push(`${response.status()} ${response.url().slice(origin.length)}`)
  })
  try {
    const response = await page.goto(origin + route, { waitUntil: 'load', timeout: 60000 })
    if (!response || response.status() >= 400) errors.push(`status ${response?.status()}`)
    await page.waitForTimeout(400)
    const text = await page.evaluate(() => document.body.innerText.trim().length)
    if (!route.startsWith('/frame') && text < 20) errors.push('empty page')
    if (axeRoutes.has(route)) {
      await page.addScriptTag({ path: AXE })
      const result = await page.evaluate(async () => {
        const out = []
        let known = 0
        for (const theme of ['dark', 'light']) {
          const root = document.documentElement
          root.classList.remove('azion-dark', 'azion-light')
          root.classList.add(`azion-${theme}`)
          root.dataset.theme = theme
          const run = await globalThis.axe.run(document, {
            runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] }
          })
          for (const violation of run.violations) {
            const nodes = violation.nodes.filter((node) => {
              if (violation.id !== 'color-contrast' || theme !== 'dark') return true
              const element = document.querySelector(node.target.join(' '))
              const onPrimary = element?.closest('[class*="bg-(--primary)"]')
              if (onPrimary) known++
              return !onPrimary
            })
            if (!nodes.length) continue
            out.push({
              id: `${violation.id} [${theme}]`,
              impact: violation.impact,
              nodes: nodes.length,
              target: nodes[0].target.join(' '),
              summary: nodes[0].failureSummary?.split('\n').slice(1).join(' ')
            })
          }
        }
        return { violations: out, known }
      })
      knownPrimary += result.known
      axeChecked++
      if (result.violations.length) axeFailures.push({ route, violations: result.violations })
    }
  } catch (error) {
    errors.push(`navigation: ${error.message}`)
  }
  if (errors.length) failures.push({ route, errors: [...new Set(errors)] })
  await page.close()
}

const queue = [...only]
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) await visit(queue.shift())
  })
)

await browser.close()
server.close()

for (const failure of failures) {
  console.log(`\n✗ ${failure.route}`)
  for (const error of failure.errors.slice(0, 8)) console.log(`    ${error.slice(0, 300)}`)
}
for (const failure of axeFailures) {
  console.log(`\n✗ axe ${failure.route}`)
  for (const v of failure.violations)
    console.log(
      `    ${v.id} (${v.impact}) ×${v.nodes}: ${v.target} — ${v.summary ?? ''}`.slice(0, 500)
    )
}
console.log(
  `\nRoutes: ${only.length}, console/page errors on ${failures.length}; axe (dark + light) on ${axeChecked}, violations on ${axeFailures.length}; known theme gap (white on --primary in dark, ROADMAP M2.10): ${knownPrimary} nodes`
)
process.exit(failures.length || axeFailures.length ? 1 : 0)
