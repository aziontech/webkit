import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { planInit } from '../src/plan.js'
import { applyPlan } from '../src/apply.js'
import { planDoctor } from '../src/doctor.js'

function makeProject(pkg = { name: 'demo', version: '1.0.0' }) {
  const dir = mkdtempSync(join(tmpdir(), 'webkit-doctor-'))
  writeFileSync(join(dir, 'package.json'), JSON.stringify(pkg, null, 2))
  return dir
}

const statusOf = (report, check) => report.find((c) => c.check === check)?.status

test('doctor on a bare project fails the required checks', () => {
  const dir = makeProject()
  try {
    const report = planDoctor(dir)
    assert.equal(statusOf(report, 'webkit catalog'), 'fail')
    assert.equal(statusOf(report, 'eslint config'), 'fail')
    assert.equal(statusOf(report, 'stylelint config'), 'fail')
    assert.equal(statusOf(report, 'mcp server'), 'fail')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('doctor after init passes the config/mcp/husky checks', () => {
  const dir = makeProject()
  try {
    applyPlan(dir, planInit(dir, {}))
    const report = planDoctor(dir)
    assert.equal(statusOf(report, 'eslint config'), 'ok')
    assert.equal(statusOf(report, 'stylelint config'), 'ok')
    assert.equal(statusOf(report, 'mcp server'), 'ok')
    assert.equal(statusOf(report, 'husky prepare script'), 'ok')
    assert.equal(statusOf(report, 'pre-commit hook'), 'ok')
    // webkit is not actually installed in the scratch project → catalog still fails.
    assert.equal(statusOf(report, 'webkit catalog'), 'fail')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('doctor resolves the catalog via WEBKIT_CATALOG_PATH', () => {
  const dir = makeProject()
  const catalog = join(dir, 'catalog.json')
  writeFileSync(catalog, JSON.stringify({ package: '@aziontech/webkit', webkitVersion: '1.2.3', imports: {} }))
  const prev = process.env.WEBKIT_CATALOG_PATH
  process.env.WEBKIT_CATALOG_PATH = catalog
  try {
    const report = planDoctor(dir)
    const c = report.find((x) => x.check === 'webkit catalog')
    assert.equal(c.status, 'ok')
    assert.match(c.detail, /1\.2\.3/)
  } finally {
    if (prev === undefined) delete process.env.WEBKIT_CATALOG_PATH
    else process.env.WEBKIT_CATALOG_PATH = prev
    rmSync(dir, { recursive: true, force: true })
  }
})

test('doctor warns when a toolkit dependency is pinned as "latest" and reports installed version', () => {
  const dir = makeProject({
    name: 'demo',
    version: '1.0.0',
    dependencies: { '@aziontech/webkit': 'latest' }
  })
  try {
    // Simulate the installed package so doctor can read its resolved version.
    const inst = join(dir, 'node_modules', '@aziontech', 'webkit')
    mkdirSync(inst, { recursive: true })
    writeFileSync(join(inst, 'package.json'), JSON.stringify({ name: '@aziontech/webkit', version: '2.5.0' }))

    const report = planDoctor(dir)
    const dep = report.find((c) => c.check === 'dependency versions')
    assert.ok(dep, 'expected a dependency-versions check')
    assert.equal(dep.status, 'warn')
    assert.match(dep.detail, /latest/)
    assert.match(dep.detail, /2\.5\.0/) // installed version surfaced
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('doctor reports a malformed .mcp.json as a failure, not a crash', () => {
  const dir = makeProject()
  try {
    writeFileSync(join(dir, '.mcp.json'), '{ not valid json')
    const report = planDoctor(dir)
    const mcp = report.find((c) => c.check === 'mcp server')
    assert.equal(mcp.status, 'fail')
    assert.match(mcp.detail, /not valid JSON/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})
