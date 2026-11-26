import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { chmodSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { collect, renderMarkdown } from '../../src/cli/report.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CLI_PATH = join(__dirname, '../../src/cli/cli.js')

function makeProject() {
  const dir = mkdtempSync(join(tmpdir(), 'webkit-report-'))
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'demo', version: '1.0.0' }))
  return dir
}

/** Installs a fake `node_modules/.bin/eslint` shim that always prints `resultsJson`. */
function installFakeEslint(dir, resultsJson) {
  const binDir = join(dir, 'node_modules', '.bin')
  mkdirSync(binDir, { recursive: true })
  const shim = join(binDir, 'eslint')
  writeFileSync(
    shim,
    `#!/usr/bin/env node\nprocess.stdout.write(${JSON.stringify(JSON.stringify(resultsJson))})\n`
  )
  chmodSync(shim, 0o755)
  return shim
}

function eslintResult(filePath, messages) {
  return { filePath, messages }
}

// ---------------------------------------------------------------------------
// collect()
// ---------------------------------------------------------------------------

test('collect keeps only webkit/* rule findings', () => {
  const cwd = '/proj'
  const results = [
    eslintResult('/proj/src/a.vue', [
      { ruleId: 'webkit/no-hardcoded-color', message: 'x' },
      { ruleId: 'vue/no-unused-vars', message: 'y' }
    ]),
    eslintResult('/proj/src/b.vue', [])
  ]
  const report = collect(results, cwd)
  assert.equal(report.total, 1)
  assert.equal(report.byRule[0][0], 'webkit/no-hardcoded-color')
  assert.equal(report.uiFilesTotal, 2)
  assert.equal(report.uiFilesClean, 1)
  assert.equal(report.score, 50)
})

test('collect ignores fatal/null-ruleId messages as findings but counts the file as not clean', () => {
  const cwd = '/proj'
  const results = [
    eslintResult('/proj/src/broken.vue', [{ fatal: true, message: 'Unexpected token' }]),
    eslintResult('/proj/src/clean.vue', [])
  ]
  const report = collect(results, cwd)
  assert.equal(report.total, 0)
  assert.deepEqual(report.fatalFiles, ['src/broken.vue'])
  assert.equal(report.uiFilesTotal, 2)
  // broken.vue is not clean (fatal), clean.vue is clean.
  assert.equal(report.uiFilesClean, 1)
  assert.equal(report.score, 50)
})

test('collect scores by clean file, not by finding count', () => {
  const cwd = '/proj'
  const results = [
    // One file with 20 findings weighs the same as a file with 1.
    eslintResult(
      '/proj/src/messy.vue',
      Array.from({ length: 20 }, () => ({ ruleId: 'webkit/no-hardcoded-color', message: 'x' }))
    ),
    eslintResult('/proj/src/oneoff.vue', [{ ruleId: 'webkit/no-hardcoded-color', message: 'x' }]),
    eslintResult('/proj/src/clean-a.vue', []),
    eslintResult('/proj/src/clean-b.vue', [])
  ]
  const report = collect(results, cwd)
  assert.equal(report.total, 21)
  assert.equal(report.filesAffected, 2)
  assert.equal(report.uiFilesTotal, 4)
  assert.equal(report.uiFilesClean, 2)
  assert.equal(report.score, 50)
})

test('collect ignores non-UI extensions for the score denominator but still counts their findings', () => {
  const cwd = '/proj'
  const results = [
    eslintResult('/proj/src/a.vue', []),
    eslintResult('/proj/src/util.ts', [{ ruleId: 'webkit/no-deprecated-component', message: 'x' }])
  ]
  const report = collect(results, cwd)
  assert.equal(report.uiFilesTotal, 1)
  assert.equal(report.total, 1)
  assert.equal(report.score, 100) // the one .vue file is clean; .ts isn't in the denominator
})

test('collect throws when no .vue/.astro file reached ESLint', () => {
  const results = [eslintResult('/proj/src/util.ts', [])]
  assert.throws(() => collect(results, '/proj'), /measured nothing/)
})

// ---------------------------------------------------------------------------
// renderMarkdown()
// ---------------------------------------------------------------------------

test('renderMarkdown includes the summary row and the coverage section', () => {
  const report = collect(
    [eslintResult('/proj/a.vue', [{ ruleId: 'webkit/no-hardcoded-color', message: 'x' }])],
    '/proj'
  )
  const md = renderMarkdown(report, {
    catalog: { available: true, package: '@aziontech/webkit', version: '1.0.0' }
  })
  assert.match(md, /\| Violations \| \*\*1\*\* \|/)
  assert.match(md, /### Coverage — what this did and did not look at/)
  assert.match(md, /no-style-override/)
})

test('renderMarkdown warns when the catalog is unavailable', () => {
  const report = collect([eslintResult('/proj/a.vue', [])], '/proj')
  const md = renderMarkdown(report, {
    catalog: { available: false, package: '@aziontech/webkit', version: null }
  })
  assert.match(md, /catalog could not be resolved/)
})

// ---------------------------------------------------------------------------
// CLI end-to-end: --fail-on exit codes
// ---------------------------------------------------------------------------

function runCli(dir, args) {
  return spawnSync(process.execPath, [CLI_PATH, 'report', ...args], { cwd: dir, encoding: 'utf-8' })
}

test('cli report --fail-on never exits 0 even with violations', () => {
  const dir = makeProject()
  try {
    installFakeEslint(dir, [
      {
        filePath: join(dir, 'a.vue'),
        messages: [{ ruleId: 'webkit/no-hardcoded-color', message: 'x' }]
      }
    ])
    const proc = runCli(dir, ['--fail-on', 'never'])
    assert.equal(proc.status, 0)
    assert.match(proc.stdout, /Webkit adoption/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('cli report --fail-on any exits 1 when there are violations', () => {
  const dir = makeProject()
  try {
    installFakeEslint(dir, [
      {
        filePath: join(dir, 'a.vue'),
        messages: [{ ruleId: 'webkit/no-hardcoded-color', message: 'x' }]
      }
    ])
    const proc = runCli(dir, ['--fail-on', 'any'])
    assert.equal(proc.status, 1)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('cli report --fail-on any exits 0 when clean', () => {
  const dir = makeProject()
  try {
    installFakeEslint(dir, [{ filePath: join(dir, 'a.vue'), messages: [] }])
    const proc = runCli(dir, ['--fail-on', 'any'])
    assert.equal(proc.status, 0)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('cli report --format json prints machine-readable output', () => {
  const dir = makeProject()
  try {
    installFakeEslint(dir, [{ filePath: join(dir, 'a.vue'), messages: [] }])
    const proc = runCli(dir, ['--format', 'json'])
    assert.equal(proc.status, 0)
    const parsed = JSON.parse(proc.stdout)
    assert.equal(parsed.total, 0)
    assert.equal(parsed.uiFilesTotal, 1)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('cli report exits 2 when no UI file reached ESLint', () => {
  const dir = makeProject()
  try {
    installFakeEslint(dir, [{ filePath: join(dir, 'a.ts'), messages: [] }])
    const proc = runCli(dir, [])
    assert.equal(proc.status, 2)
    assert.match(proc.stderr, /measured nothing/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('cli rejects an unknown --format value', () => {
  const dir = makeProject()
  try {
    const proc = runCli(dir, ['--format', 'yaml'])
    assert.equal(proc.status, 1)
    assert.match(proc.stderr, /Unknown --format value/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('cli rejects an unknown --fail-on value', () => {
  const dir = makeProject()
  try {
    const proc = runCli(dir, ['--fail-on', 'new'])
    assert.equal(proc.status, 1)
    assert.match(proc.stderr, /Unknown --fail-on value/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})
