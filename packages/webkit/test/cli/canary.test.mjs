import { test } from 'node:test'
import assert from 'node:assert/strict'
import { chmodSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { CANARY_DIR, runCanary } from '../../src/cli/canary.js'

function makeProject() {
  const dir = mkdtempSync(join(tmpdir(), 'webkit-canary-'))
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'demo', version: '1.0.0' }))
  return dir
}

/**
 * Installs a fake `node_modules/.bin/eslint` shim. `perFile` maps a fixture filename to
 * either `{ rule }` (flagged), `{ fatal }` (parse error), or is omitted (not flagged at
 * all). The shim reads the linted directory from argv and reports every file it finds
 * there so the byFile map always includes every written fixture unless told otherwise.
 */
function installFakeEslint(dir, perFile) {
  const binDir = join(dir, 'node_modules', '.bin')
  mkdirSync(binDir, { recursive: true })
  const shim = join(binDir, 'eslint')
  // The shim is handed the canary dir as its first positional arg; it lists that
  // directory itself (at runtime) so the test doesn't need to know the fixture list.
  writeFileSync(
    shim,
    `#!/usr/bin/env node
const { readdirSync } = require('node:fs')
const { join } = require('node:path')
const perFile = ${JSON.stringify(perFile)}
const dir = process.argv[2]
const files = readdirSync(join(process.cwd(), dir))
const results = files
  .filter((f) => perFile[f] !== undefined)
  .map((f) => {
    const spec = perFile[f]
    const messages = spec.fatal
      ? [{ fatal: true, message: spec.fatal }]
      : spec.rule
        ? [{ ruleId: spec.rule, message: 'x' }]
        : []
    return { filePath: join(process.cwd(), dir, f), messages }
  })
process.stdout.write(JSON.stringify(results))
`
  )
  chmodSync(shim, 0o755)
}

const FIXTURES = [
  {
    file: 'a.vue',
    rule: 'webkit/no-deep-internal-import',
    optional: false,
    content: '<template></template>'
  },
  {
    file: 'b.vue',
    rule: 'webkit/valid-import-path',
    optional: false,
    content: '<template></template>'
  },
  {
    file: 'c.astro',
    rule: 'webkit/no-hardcoded-color',
    optional: true,
    why: 'astro not installed',
    content: '<div></div>'
  }
]

test('runCanary reports OK when every fixture is flagged by its exact rule', () => {
  const dir = makeProject()
  try {
    installFakeEslint(dir, {
      'a.vue': { rule: 'webkit/no-deep-internal-import' },
      'b.vue': { rule: 'webkit/valid-import-path' },
      'c.astro': { rule: 'webkit/no-hardcoded-color' }
    })
    const result = runCanary(dir, { fixtures: FIXTURES })
    assert.equal(result.exitCode, 0)
    assert.ok(result.lines.some((l) => l.startsWith('OK    webkit/no-deep-internal-import a.vue')))
    assert.ok(result.lines.some((l) => l.startsWith('OK    webkit/valid-import-path b.vue')))
    assert.ok(result.lines.some((l) => l.startsWith('OK    webkit/no-hardcoded-color c.astro')))
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('runCanary fails when a required fixture is not flagged', () => {
  const dir = makeProject()
  try {
    installFakeEslint(dir, {
      'a.vue': {}, // not flagged at all
      'b.vue': { rule: 'webkit/valid-import-path' }
    })
    const result = runCanary(dir, { fixtures: FIXTURES })
    assert.equal(result.exitCode, 1)
    assert.ok(result.lines.some((l) => l.startsWith('FAIL  webkit/no-deep-internal-import a.vue')))
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('runCanary fails when a fixture flagged by the wrong rule', () => {
  const dir = makeProject()
  try {
    installFakeEslint(dir, {
      'a.vue': { rule: 'webkit/some-other-rule' },
      'b.vue': { rule: 'webkit/valid-import-path' }
    })
    const result = runCanary(dir, { fixtures: FIXTURES })
    assert.equal(result.exitCode, 1)
    assert.ok(result.lines.some((l) => l.startsWith('FAIL  webkit/no-deep-internal-import a.vue')))
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('runCanary fails on a fatal parse error, never counts it as a pass', () => {
  const dir = makeProject()
  try {
    installFakeEslint(dir, {
      'a.vue': { fatal: 'Unexpected token' },
      'b.vue': { rule: 'webkit/valid-import-path' }
    })
    const result = runCanary(dir, { fixtures: FIXTURES })
    assert.equal(result.exitCode, 1)
    assert.ok(result.lines.some((l) => l.includes('failed to parse')))
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('runCanary skips the optional fixture without failing when it is not flagged', () => {
  const dir = makeProject()
  try {
    installFakeEslint(dir, {
      'a.vue': { rule: 'webkit/no-deep-internal-import' },
      'b.vue': { rule: 'webkit/valid-import-path' }
      // c.astro deliberately omitted — not linted at all.
    })
    const result = runCanary(dir, { fixtures: FIXTURES })
    assert.equal(result.exitCode, 0)
    assert.ok(result.lines.some((l) => l.startsWith('SKIP  webkit/no-hardcoded-color c.astro')))
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('runCanary always removes .webkit-canary/, even on failure', () => {
  const dir = makeProject()
  try {
    installFakeEslint(dir, { 'a.vue': {}, 'b.vue': { rule: 'webkit/valid-import-path' } })
    runCanary(dir, { fixtures: FIXTURES })
    assert.equal(existsSync(join(dir, CANARY_DIR)), false)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('runCanary reports a clean failure message when eslint cannot be resolved at all', () => {
  const dir = makeProject() // no node_modules/.bin/eslint installed
  const result = runCanary(dir, { fixtures: FIXTURES })
  try {
    assert.equal(result.exitCode, 1)
    assert.ok(result.lines[0].startsWith('FAIL'))
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})
