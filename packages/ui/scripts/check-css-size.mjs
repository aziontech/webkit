#!/usr/bin/env node

import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync
} from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { gzipSync } from 'node:zlib'
import tailwind from '@tailwindcss/vite'
import vuePlugin from '@vitejs/plugin-vue'
import { build } from 'vite'

import { planSources } from '../src/cli/css-sources.js'
import { _internals as initInternals } from '../src/cli/plan.js'
import azionUi from '../src/vite-plugin.js'
import { limitToBytes } from './check-size-ratchet.mjs'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const PKG = join(SCRIPT_DIR, '..')
const BUDGETS = join(PKG, '.size-limit-css.json')

const kb = (n) => `${(n / 1024).toFixed(2)} KB`

function link(target, path) {
  mkdirSync(dirname(path), { recursive: true })
  symlinkSync(target, path, 'dir')
}

export function writeFixture(dir, imports, entries = [], markup = '') {
  const require = createRequire(join(PKG, 'package.json'))
  const nm = join(dir, 'node_modules')
  link(PKG, join(nm, '@aziontech', 'ui'))
  link(
    realpathSync(join(PKG, 'node_modules', '@aziontech', 'theme')),
    join(nm, '@aziontech', 'theme')
  )
  link(
    realpathSync(join(PKG, 'node_modules', '@aziontech', 'icons')),
    join(nm, '@aziontech', 'icons')
  )
  link(dirname(require.resolve('tailwindcss/package.json')), join(nm, 'tailwindcss'))
  mkdirSync(join(dir, 'src'), { recursive: true })
  writeFileSync(
    join(dir, 'src', 'azion-ui.css'),
    `${initInternals.styleEntryContent()}@source not '../node_modules/@aziontech/ui/src/**/*.test.ts';\n`
  )
  const bindings = imports.map((_, i) => `C${i}`)
  writeFileSync(
    join(dir, 'src', 'main.js'),
    [
      "import './azion-ui.css'",
      ...entries.map((entry) => `import '${entry}'`),
      ...imports.map((sub, i) => `import ${bindings[i]} from '@aziontech/ui/${sub}'`),
      `export const markup = ${JSON.stringify(markup)}`,
      `export default [${bindings.join(', ')}]`,
      ''
    ].join('\n')
  )
}

export async function measureFixture(dir) {
  const cwd = process.cwd()
  process.chdir(dir)
  try {
    return await buildFixture(dir)
  } finally {
    process.chdir(cwd)
  }
}

async function buildFixture(dir) {
  const result = await build({
    root: dir,
    configFile: false,
    logLevel: 'error',
    plugins: [azionUi(), vuePlugin(), tailwind()],
    define: { 'process.env.NODE_ENV': JSON.stringify('production') },
    build: {
      write: false,
      cssMinify: true,
      rollupOptions: { input: join(dir, 'src', 'main.js'), external: ['vue'] }
    }
  })
  const outputs = (Array.isArray(result) ? result : [result]).flatMap((r) => r.output)
  let raw = 0
  let gzip = 0
  for (const o of outputs) {
    if (!o.fileName.endsWith('.css')) continue
    const bytes = Buffer.from(o.source)
    raw += bytes.length
    gzip += gzipSync(bytes).length
  }
  return { raw, gzip }
}

async function main(only) {
  const all = JSON.parse(readFileSync(BUDGETS, 'utf8'))
  const entries = only.length ? all.filter((e) => only.includes(e.name)) : all
  const failures = []
  for (const e of entries) {
    const dir = mkdtempSync(join(tmpdir(), 'azion-ui-css-'))
    try {
      writeFixture(dir, e.imports, e.entries, e.markup)
      const { raw, gzip } = await measureFixture(dir)
      const sources = planSources(dir)
      const limit = limitToBytes(e.limit)
      const problems = []
      if (sources.stale) problems.push('the plugin did not write src/azion-ui.sources.css')
      if (!sources.files.length) problems.push('no Azion UI file reached the scan')
      if (gzip > limit) problems.push('OVER')
      if (problems.length) failures.push(e.name)
      console.log(
        `${problems.length ? '✖' : '✓'} ${e.name.padEnd(12)} ${kb(gzip).padStart(10)} gzip, ${kb(raw)} raw  (budget ${e.limit}; ${e.imports.length} import(s), ${sources.files.length} scanned file(s))${problems.length ? `  ${problems.join('; ')}` : ''}`
      )
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  }
  if (failures.length) {
    console.error(
      `\n✖ CSS budget: ${failures.join(', ')}. An app's stylesheet holds the classes of the Azion UI files it imports; shrink what those files emit, or justify a raise in the PR (Budget-raise:) — contributing/rules/bundle-budget.md.`
    )
    return 1
  }
  console.log('✓ check-css-size: every fixture app is within its CSS budget.')
  return 0
}

if (import.meta.url === pathToFileURL(resolve(process.argv[1] ?? '')).href) {
  process.exit(await main(process.argv.slice(2)))
}
