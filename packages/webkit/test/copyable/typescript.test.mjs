// A block or example written in TypeScript must type-check in a strict consumer app, so an agent
// can copy it and turn it into a typed component without rework. This suite type-checks every
// `<script setup lang="ts">` block, variant and example with vue-tsc under the compiler options
// of a create-vue app (strict, no unused locals or parameters, verbatim module syntax), and pins
// the folders that are already TypeScript so they cannot fall back to plain JavaScript.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

import { CONSUMER_COMPILER_OPTIONS, CONSUMER_ENV_FILES } from './consumer-app.mjs'

const PKG_DIR = fileURLToPath(new URL('../..', import.meta.url))
const require = createRequire(import.meta.url)

const TYPESCRIPT_FOLDERS = ['blocks/headers', 'blocks/shells']

// Type errors that come from a component's own typings, not from the copied file: { id, pattern }.
// The fix belongs in the component; the last test fails once a listed signature no longer occurs.
const KNOWN_CONFLICTS = []

function vueFiles(dir) {
  return readdirSync(join(PKG_DIR, dir), { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.vue'))
    .map((entry) => relative(PKG_DIR, join(entry.parentPath, entry.name)).split('\\').join('/'))
}

const isTypeScript = (file) =>
  /<script\s+setup\s+lang="ts">/.test(readFileSync(join(PKG_DIR, file), 'utf8'))

const copyable = [...vueFiles('blocks'), ...vueFiles('examples')]
const typed = copyable.filter(isTypeScript)

test('the TypeScript folders hold only TypeScript SFCs', () => {
  const plain = copyable.filter(
    (file) => TYPESCRIPT_FOLDERS.some((dir) => file.startsWith(`${dir}/`)) && !typed.includes(file)
  )
  assert.deepEqual(plain, [], `write these as <script setup lang="ts">:\n${plain.join('\n')}`)
})

let typeErrors = []

test('every TypeScript block, variant and example type-checks in a strict consumer app', () => {
  assert.ok(typed.length > 0, 'expected TypeScript blocks')
  const dir = mkdtempSync(join(tmpdir(), 'webkit-copyable-ts-'))
  try {
    const tsconfig = join(dir, 'tsconfig.json')
    writeFileSync(
      tsconfig,
      JSON.stringify({
        compilerOptions: CONSUMER_COMPILER_OPTIONS,
        files: [...CONSUMER_ENV_FILES, ...typed.map((file) => join(PKG_DIR, file))]
      })
    )
    const vueTsc = join(dirname(require.resolve('vue-tsc/package.json')), 'bin/vue-tsc.js')
    const run = spawnSync(process.execPath, [vueTsc, '-p', tsconfig, '--pretty', 'false'], {
      cwd: PKG_DIR,
      encoding: 'utf8',
      timeout: 240_000
    })
    assert.equal(run.error, undefined, String(run.error))
    const output = `${run.stdout}${run.stderr}`
    typeErrors = output
      .split('\n')
      .filter((line) => /error TS\d+/.test(line))
      .map((line) => line.replace(PKG_DIR, ''))
      .filter((line) => line.startsWith('blocks/') || line.startsWith('examples/'))
    const errors = typeErrors.filter(
      (line) => !KNOWN_CONFLICTS.some((conflict) => conflict.pattern.test(line))
    )
    assert.deepEqual(errors, [], `${errors.length} type error(s):\n${errors.join('\n')}`)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('every known type conflict still occurs, so a fixed one leaves the list', () => {
  const stale = KNOWN_CONFLICTS.filter(
    (conflict) => !typeErrors.some((line) => conflict.pattern.test(line))
  ).map((conflict) => conflict.id)
  assert.deepEqual(stale, [], `remove these from KNOWN_CONFLICTS: ${stale.join(', ')}`)
})
