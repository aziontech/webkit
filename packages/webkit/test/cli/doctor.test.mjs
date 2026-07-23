import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { planInit } from '../../src/cli/plan.js'
import { applyPlan } from '../../src/cli/apply.js'
import { planDoctor } from '../../src/cli/doctor.js'

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
    assert.equal(statusOf(report, 'webkit.css @source'), 'fail')
    assert.equal(statusOf(report, 'mcp server'), 'fail')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('doctor after init passes the config/mcp/husky/style checks', () => {
  const dir = makeProject()
  try {
    applyPlan(dir, planInit(dir, {}))
    const report = planDoctor(dir)
    assert.equal(statusOf(report, 'eslint config'), 'ok')
    assert.equal(statusOf(report, 'stylelint config'), 'ok')
    assert.equal(statusOf(report, 'webkit.css @source'), 'ok')
    assert.equal(statusOf(report, 'postcss config'), 'ok')
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
  writeFileSync(
    catalog,
    JSON.stringify({ package: '@aziontech/webkit', webkitVersion: '1.2.3', imports: {} })
  )
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
    writeFileSync(
      join(inst, 'package.json'),
      JSON.stringify({ name: '@aziontech/webkit', version: '2.5.0' })
    )

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

test('doctor warns when @aziontech/icons is a dependency but not imported at the entry', () => {
  const dir = makeProject({
    name: 'demo',
    version: '1.0.0',
    dependencies: { '@aziontech/icons': 'latest' }
  })
  try {
    mkdirSync(join(dir, 'src'))
    writeFileSync(join(dir, 'src/main.ts'), "import { createApp } from 'vue'\n")
    let report = planDoctor(dir)
    assert.equal(statusOf(report, 'icons import'), 'warn')

    writeFileSync(join(dir, 'src/main.ts'), "import '@aziontech/icons'\n")
    report = planDoctor(dir)
    assert.equal(statusOf(report, 'icons import'), 'ok')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('doctor flags toast usage with no wired region, and passes once wired', () => {
  const dir = makeProject()
  try {
    mkdirSync(join(dir, 'src/components'), { recursive: true })

    // No toast anywhere → the check does not even appear.
    writeFileSync(join(dir, 'src/main.ts'), "import { createApp } from 'vue'\n")
    assert.equal(statusOf(planDoctor(dir), 'toast setup'), undefined)

    // toast imported, no region wired → warn with the fix.
    writeFileSync(
      join(dir, 'src/components/save.ts'),
      "import { toast } from '@aziontech/webkit/toast'\ntoast.success('Saved')\n"
    )
    const warned = planDoctor(dir).find((c) => c.check === 'toast setup')
    assert.equal(warned.status, 'warn')
    assert.match(warned.detail, /\.use\(ToastPlugin\)/)

    // Service wiring in the entry → ok.
    writeFileSync(
      join(dir, 'src/main.ts'),
      "import { ToastPlugin } from '@aziontech/webkit/toast'\nimport { createApp } from 'vue'\ncreateApp({}).use(ToastPlugin).mount('#app')\n"
    )
    assert.equal(statusOf(planDoctor(dir), 'toast setup'), 'ok')

    // A manually mounted Toaster also counts.
    writeFileSync(join(dir, 'src/main.ts'), "import { createApp } from 'vue'\n")
    writeFileSync(
      join(dir, 'src/components/App.vue'),
      "<script setup>\nimport Toaster from '@aziontech/webkit/toast-root'\n</script>\n<template>\n  <Toaster />\n</template>\n"
    )
    assert.equal(statusOf(planDoctor(dir), 'toast setup'), 'ok')
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
