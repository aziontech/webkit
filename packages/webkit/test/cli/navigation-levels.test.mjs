import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, symlinkSync } from 'node:fs'
import { createServer } from 'node:http'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

import { formatCheck, withNavigation } from '../../src/cli/check.js'
import { parseUrls, runNavigationCheck } from '../../src/cli/navigation-check.js'
import { navigationFindings, routeOf } from '../../src/cli/navigation-levels.js'
import { CLI, cleanup, makeProject, PKG_ROOT } from './_helpers/cli-project.mjs'

const FIXTURES = join(PKG_ROOT, 'test', 'cli', 'fixtures', 'navigation-levels')
const PAGE = 'http://localhost:5173/policies/acme/private-access/access-rules'
const ACCESS_RULES = '/policies/acme/private-access/access-rules'

const link = (raw, label, current = false) => ({
  href: new URL(raw, PAGE).href,
  raw,
  label,
  current
})

const control = (name, kind, links) => ({
  name,
  kind,
  currentCount: links.filter((l) => l.current).length,
  currentLabels: links.filter((l) => l.current).map((l) => l.label),
  links
})

const rail = (withAccessRules) =>
  control('Console navigation', 'nav', [
    link('/', 'Overview'),
    link('/policies', 'Policies', !withAccessRules),
    ...(withAccessRules ? [link(ACCESS_RULES, 'Access rules', true)] : [])
  ])

const pageMenu = control('Private access', 'role=navigation', [
  link('/policies/acme/private-access/app-segments', 'App segments'),
  link(ACCESS_RULES, 'Access rules', true)
])

test('a route offered by the rail and a page menu fails, naming both controls and the route', () => {
  const findings = navigationFindings({ url: PAGE, controls: [rail(true), pageMenu] })
  assert.equal(findings.length, 1)
  const [f] = findings
  assert.equal(f.rule, 'webkit-navigation-levels/duplicate-route')
  assert.equal(f.route, ACCESS_RULES)
  assert.deepEqual(f.controls, ['Console navigation', 'Private access'])
  assert.match(f.message, /"Console navigation" \(nav\)/)
  assert.match(f.message, /"Private access" \(role=navigation\)/)
  assert.match(f.message, new RegExp(ACCESS_RULES))
})

test('the same screen without the rail row passes', () => {
  assert.deepEqual(navigationFindings({ url: PAGE, controls: [rail(false), pageMenu] }), [])
})

test('the query and the hash do not make two routes different', () => {
  const tabs = control('Policy sections', 'tablist', [
    link(`${ACCESS_RULES}/?view=compact#top`, 'Rules')
  ])
  const [f] = navigationFindings({ url: PAGE, controls: [tabs, pageMenu] })
  assert.equal(f.route, ACCESS_RULES)
})

test('a control with two current rows fails (rule 5)', () => {
  const menu = control('Private access', 'role=navigation', [
    link('/policies/acme/private-access/app-segments', 'App segments', true),
    link(ACCESS_RULES, 'Access rules', true)
  ])
  const findings = navigationFindings({ url: PAGE, controls: [menu] })
  assert.equal(findings.length, 1)
  assert.equal(findings[0].rule, 'webkit-navigation-levels/many-current')
  assert.match(findings[0].message, /2 rows as aria-current="page"/)
})

test('current rows that point at different places fail; an ancestor agrees (rule 5)', () => {
  const railElsewhere = control('Console navigation', 'nav', [
    link('/policies/default/private-access/server-groups', 'Server groups', true)
  ])
  const findings = navigationFindings({ url: PAGE, controls: [railElsewhere, pageMenu] })
  assert.equal(findings.length, 1)
  assert.equal(findings[0].rule, 'webkit-navigation-levels/current-disagrees')
  assert.match(findings[0].message, /Server groups/)
  assert.match(findings[0].message, /Access rules/)

  const home = control('Console navigation', 'nav', [link('/', 'Overview', true)])
  assert.equal(navigationFindings({ url: PAGE, controls: [home, pageMenu] }).length, 1)
})

test('routeOf keeps same-origin paths and hash routes, drops anchors and other origins', () => {
  assert.equal(routeOf(undefined, '/a/b/?x=1#y', PAGE), '/a/b')
  assert.equal(routeOf(undefined, '#/a/b?x=1', PAGE), '/a/b')
  assert.equal(routeOf(undefined, '#section', PAGE), null)
  assert.equal(routeOf(undefined, 'https://example.com/a', PAGE), null)
  assert.equal(routeOf(undefined, 'mailto:jane.doe@example.com', PAGE), null)
  assert.equal(routeOf(undefined, '/', PAGE), '/')
})

test('parseUrls splits a comma list', () => {
  assert.deepEqual(parseUrls(' http://a.example.com/x , http://a.example.com/y,'), [
    'http://a.example.com/x',
    'http://a.example.com/y'
  ])
  assert.deepEqual(parseUrls(undefined), [])
})

test('--url without Playwright in the project is an error that says how to install it', async () => {
  const dir = makeProject()
  try {
    const result = await withNavigation(
      { findings: [], errors: 0, warnings: 0, scanned: 0, version: '0.0.0' },
      dir,
      ['http://localhost:1/']
    )
    assert.equal(result.errors, 1)
    assert.equal(result.findings[0].source, 'navigation')
    assert.match(result.findings[0].message, /playwright install chromium/)
    assert.match(formatCheck(result), /\[navigation\]/)
    assert.match(formatCheck(result), /and 1 route\(s\)/)
  } finally {
    cleanup(dir)
  }
})

const require = createRequire(join(PKG_ROOT, 'package.json'))
const { chromium } = await import('playwright')
const noBrowser = existsSync(chromium.executablePath())
  ? false
  : 'Chromium is not installed (npx playwright install chromium)'

async function serveFixtures() {
  const server = createServer((req, res) => {
    const fixture = new URL(req.url, 'http://localhost').searchParams.get('fixture')
    const file = join(FIXTURES, `${fixture}.html`)
    if (!fixture || !existsSync(file)) {
      res.writeHead(404).end()
      return
    }
    res.writeHead(200, { 'content-type': 'text/html' }).end(readFileSync(file))
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const base = `http://127.0.0.1:${server.address().port}${ACCESS_RULES}`
  return { server, url: (fixture) => `${base}?fixture=${fixture}` }
}

function runCli(dir, ...args) {
  return new Promise((resolve) => {
    const env = { ...process.env, NO_COLOR: '1' }
    delete env.FORCE_COLOR
    const child = spawn(process.execPath, [CLI, ...args], { cwd: dir, env })
    let stdout = ''
    child.stdout.on('data', (chunk) => (stdout += chunk))
    child.on('close', (code) => resolve({ code, stdout }))
  })
}

test(
  'the fixture app fails in a real browser, and passes without the rail row',
  { skip: noBrowser },
  async () => {
    const { server, url } = await serveFixtures()
    try {
      const shared = await runNavigationCheck(PKG_ROOT, [url('shared-route')])
      assert.equal(shared.length, 1, JSON.stringify(shared, null, 2))
      assert.equal(shared[0].source, 'navigation')
      assert.equal(shared[0].route, ACCESS_RULES)
      assert.match(shared[0].message, /"Console navigation" \(nav\) as "Access rules"/)
      assert.match(shared[0].message, /"Private access" \(role=navigation\) as "Access rules"/)

      assert.deepEqual(await runNavigationCheck(PKG_ROOT, [url('unique-route')]), [])
    } finally {
      server.close()
    }
  }
)

test('check --url fails the fixture app through the CLI', { skip: noBrowser }, async () => {
  const { server, url } = await serveFixtures()
  const dir = makeProject()
  try {
    mkdirSync(join(dir, 'node_modules'), { recursive: true })
    symlinkSync(
      dirname(require.resolve('playwright/package.json')),
      join(dir, 'node_modules', 'playwright'),
      'dir'
    )
    const failing = await runCli(dir, 'check', '--no-lint', '--json', '--url', url('shared-route'))
    const nav = JSON.parse(failing.stdout).findings.filter((f) => f.source === 'navigation')
    assert.equal(failing.code, 1)
    assert.equal(nav.length, 1)
    assert.match(nav[0].message, new RegExp(ACCESS_RULES))

    const passing = await runCli(dir, 'check', '--no-lint', '--json', '--url', url('unique-route'))
    const clean = JSON.parse(passing.stdout).findings.filter((f) => f.source === 'navigation')
    assert.deepEqual(clean, [])
  } finally {
    server.close()
    cleanup(dir)
  }
})
