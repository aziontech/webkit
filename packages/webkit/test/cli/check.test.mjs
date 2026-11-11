import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { applyPlan } from '../../src/cli/apply.js'
import { planInit } from '../../src/cli/plan.js'
import { cleanup, cli, cliJson, makeProject } from './_helpers/cli-project.mjs'

const BAD = `<script setup>
import Paginator from '@aziontech/webkit/paginator'
import Ghost from '@aziontech/webkit/not-a-thing'
</script>

<template>
  <div class="ml-2 text-left bg-[#ff0000]"><Paginator /><Ghost /></div>
</template>

<style scoped>
.x { color: #123456; }
</style>
`

const by = (json, source) => json.findings.filter((f) => f.source === source)

function initialised(files) {
  const dir = makeProject(files, { installWebkit: true })
  applyPlan(dir, planInit(dir, { icons: false }))
  return dir
}

test('check gathers doctor, v5 names, unknown imports and the built-in style scan', () => {
  const dir = makeProject({ 'src/views/Bad.vue': BAD })
  try {
    const r = cliJson(dir, 'check', '--no-lint')
    assert.equal(r.code, 1)
    assert.equal(r.json.exitCode, 1)
    assert.ok(
      by(r.json, 'doctor').some((f) => f.check === 'eslint config' && f.severity === 'error')
    )
    const migration = by(r.json, 'migration')
    assert.equal(migration.length, 1)
    assert.match(migration[0].message, /paginator → @aziontech\/webkit\/pagination/)
    const imports = by(r.json, 'imports')
    assert.equal(imports.length, 1)
    assert.equal(imports[0].line, 3)
    assert.match(imports[0].message, /not-a-thing is not exported/)
    const style = by(r.json, 'style').map((f) => f.message)
    assert.ok(style.some((m) => m.includes('"ml-2"') && m.includes('"ms-2"')))
    assert.ok(style.some((m) => m.includes('"text-left"')))
    assert.ok(style.some((m) => m.includes('#ff0000')))
    assert.ok(style.some((m) => m.includes('#123456')))
    assert.ok(
      by(r.json, 'lint').some((f) => f.severity === 'warn' && /did not run/.test(f.message))
    )
    assert.equal(r.json.errors, r.json.findings.filter((f) => f.severity === 'error').length)

    const text = cli(dir, 'check', '--no-lint')
    assert.match(text.stdout, /^\[migration\]$/m)
    assert.match(text.stdout, /ERROR src\/views\/Bad\.vue:3 — /)
    assert.match(text.stdout, /\d+ error\(s\), \d+ warning\(s\) in 1 source file\(s\)\./)
  } finally {
    cleanup(dir)
  }
})

test('check passes a wired project and enforces --max-warnings', () => {
  const dir = initialised({
    'src/main.ts': "import './webkit.css'\n",
    'src/App.vue':
      '<script setup>\nimport WebkitProvider from \'@aziontech/webkit/webkit-provider\'\nimport Button from \'@aziontech/webkit/button\'\n</script>\n<template><WebkitProvider><Button label="Go" class="ms-2" /></WebkitProvider></template>\n'
  })
  try {
    const r = cliJson(dir, 'check', '--no-lint')
    const errors = r.json.findings.filter((f) => f.severity === 'error')
    assert.deepEqual(errors, [])
    assert.equal(r.code, 0)
    assert.ok(r.json.warnings > 0)
    const capped = cliJson(dir, 'check', '--no-lint', '--max-warnings', '0')
    assert.equal(capped.code, 1)
    const loose = cliJson(dir, 'check', '--no-lint', '--max-warnings', String(r.json.warnings))
    assert.equal(loose.code, 0)
    assert.equal(cli(dir, 'check', '--max-warnings', 'x').code, 2)
  } finally {
    cleanup(dir)
  }
})

test('check warns when a copied block drifted from the canonical one', () => {
  const dir = initialised({ 'src/main.ts': "import './webkit.css'\n" })
  try {
    assert.equal(cli(dir, 'add', 'headers/auth-header').code, 0)
    const manifestPath = join(dir, 'webkit.blocks.json')
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
    manifest.blocks['headers/auth-header'].files[0].checksum = 'sha256:old'
    manifest.blocks['headers/auth-header'].files.push({
      path: 'src/views/Gone.vue',
      source: 'blocks/headers/auth-header/auth-header.vue',
      variant: 'Default',
      checksum: 'sha256:x'
    })
    writeFileSync(manifestPath, JSON.stringify(manifest))
    const r = cliJson(dir, 'check', '--no-lint')
    const drift = by(r.json, 'blocks')
    assert.ok(
      drift.some((f) => f.file === 'src/views/AuthHeader.vue' && /changed since/.test(f.message))
    )
    assert.ok(drift.some((f) => f.file === 'src/views/Gone.vue' && /file is gone/.test(f.message)))
    assert.ok(drift.every((f) => f.severity === 'warn'))
  } finally {
    cleanup(dir)
  }
})
