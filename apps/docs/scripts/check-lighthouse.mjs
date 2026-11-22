import { execFile, spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

import { chromium } from 'playwright'

import { serve } from './serve.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const DOCS_DIST = resolve(HERE, '../dist')
const DEMOS_DIST = resolve(HERE, '../../demos/dist')
const ACCEPTED = JSON.parse(
  readFileSync(resolve(HERE, '../../../packages/webkit/src/test/a11y-accepted.json'), 'utf8')
).exceptions

const LIGHTHOUSE = 'lighthouse@12.8.2'
const RUNS = Number(process.env.LIGHTHOUSE_RUNS ?? 3)
const OUT = process.env.LIGHTHOUSE_OUT ? resolve(process.env.LIGHTHOUSE_OUT) : null

const BUDGET = { accessibility: 100, lcp: 2500, cls: 0.1, tbt: 200 }

const PAGES = [
  { name: 'docs-home', site: 'docs', path: '/', preset: 'mobile' },
  { name: 'docs-button', site: 'docs', path: '/components/button', preset: 'mobile' },
  { name: 'demos-resources', site: 'demos', path: '/resources', preset: 'desktop' }
]

function certificate() {
  const dir = mkdtempSync(join(tmpdir(), 'webkit-lighthouse-'))
  const key = join(dir, 'key.pem')
  const cert = join(dir, 'cert.pem')
  const made = spawnSync(
    'openssl',
    [
      'req',
      '-x509',
      '-newkey',
      'rsa:2048',
      '-nodes',
      '-days',
      '1',
      '-subj',
      '/CN=localhost',
      '-keyout',
      key,
      '-out',
      cert
    ],
    { stdio: 'ignore' }
  )
  if (made.status !== 0) throw new Error('openssl could not create the local TLS certificate')
  const tls = { key: readFileSync(key), cert: readFileSync(cert) }
  rmSync(dir, { recursive: true, force: true })
  return tls
}

async function lighthouse(url, preset) {
  const { stdout } = await promisify(execFile)(
    'npx',
    [
      '--yes',
      LIGHTHOUSE,
      url,
      '--quiet',
      '--output=json',
      '--output-path=stdout',
      '--only-categories=accessibility,performance',
      '--chrome-flags=--headless=new --no-sandbox --ignore-certificate-errors',
      ...(preset === 'desktop' ? ['--preset=desktop'] : [])
    ],
    {
      encoding: 'utf8',
      maxBuffer: 256 * 1024 * 1024,
      env: { ...process.env, CHROME_PATH: chromium.executablePath() }
    }
  )
  return JSON.parse(stdout)
}

function failingA11yAudits(report) {
  const refs = report.categories.accessibility.auditRefs.filter((ref) => ref.weight > 0)
  return refs
    .map((ref) => report.audits[ref.id])
    .filter((audit) => audit.score !== null && audit.score < 1)
}

async function unacceptedNodes(browser, url, audit) {
  const page = await browser.newPage({ ignoreHTTPSErrors: true })
  await page.goto(url, { waitUntil: 'networkidle' })
  const paths = (audit.details?.items ?? []).map((item) => item.node?.path ?? '')
  const left = await page.evaluate(
    ({ paths, rule, accepted }) => {
      const theme = document.documentElement.dataset.theme ?? 'light'
      const resolveNode = (path) => {
        const steps = path.split(',')
        let node = document
        for (let at = 0; at < steps.length; at += 2) {
          const index = Number(steps[at])
          const children = [...node.childNodes].filter(
            (child) => child.nodeType !== Node.TEXT_NODE || (child.nodeValue ?? '').trim()
          )
          node = children[index]
          if (!node || node.nodeName !== steps[at + 1]) return null
        }
        return node instanceof Element ? node : null
      }
      return paths.filter((path) => {
        const element = path ? resolveNode(path) : null
        return !accepted.some(
          (entry) =>
            entry.rule === rule && entry.themes.includes(theme) && element?.closest(entry.selector)
        )
      })
    },
    { paths, rule: audit.id, accepted: ACCEPTED }
  )
  await page.close()
  return left.length
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}

const tls = certificate()
const servers = {
  docs: await serve(0, { root: DOCS_DIST, tls }),
  demos: await serve(0, { root: DEMOS_DIST, spa: true, tls })
}
const browser = await chromium.launch({ args: ['--ignore-certificate-errors'] })
if (OUT) mkdirSync(OUT, { recursive: true })

const failures = []
for (const target of PAGES) {
  const url = `https://localhost:${servers[target.site].address().port}${target.path}`
  const runs = []
  const audits = new Set()
  for (let run = 1; run <= RUNS; run++) {
    const report = await lighthouse(url, target.preset)
    if (OUT) writeFileSync(join(OUT, `${target.name}-${run}.json`), JSON.stringify(report))
    const failing = []
    for (const audit of failingA11yAudits(report)) {
      const left = await unacceptedNodes(browser, url, audit)
      if (left || !audit.details?.items?.length) failing.push(`${audit.id} (${left} node(s))`)
    }
    failing.forEach((audit) => audits.add(audit))
    runs.push({
      accessibility: failing.length ? Math.round(report.categories.accessibility.score * 100) : 100,
      lcp: report.audits['largest-contentful-paint'].numericValue,
      cls: report.audits['cumulative-layout-shift'].numericValue,
      tbt: report.audits['total-blocking-time'].numericValue
    })
  }
  const result = {
    accessibility: Math.min(...runs.map((run) => run.accessibility)),
    lcp: Math.round(median(runs.map((run) => run.lcp))),
    cls: Number(median(runs.map((run) => run.cls)).toFixed(3)),
    tbt: Math.round(median(runs.map((run) => run.tbt)))
  }
  console.log(
    `${target.name} (${target.preset}, median of ${RUNS}): accessibility ${result.accessibility}, LCP ${result.lcp} ms, CLS ${result.cls}, TBT ${result.tbt} ms`
  )
  if (result.accessibility < BUDGET.accessibility)
    failures.push(
      `${target.name}: accessibility ${result.accessibility}: ${[...audits].join(', ')}`
    )
  if (result.lcp > BUDGET.lcp) failures.push(`${target.name}: LCP ${result.lcp} ms > ${BUDGET.lcp}`)
  if (result.cls > BUDGET.cls) failures.push(`${target.name}: CLS ${result.cls} > ${BUDGET.cls}`)
  if (result.tbt > BUDGET.tbt) failures.push(`${target.name}: TBT ${result.tbt} ms > ${BUDGET.tbt}`)
}

await browser.close()
for (const server of Object.values(servers)) server.close()

if (failures.length) {
  console.error(`check-lighthouse: ${failures.length} problem(s)\n${failures.join('\n')}`)
  process.exit(1)
}
console.log('check-lighthouse: every page meets the accessibility and performance budget.')
