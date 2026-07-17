#!/usr/bin/env node
// CI gate for .claude/rules/bundle-budget.md. The package ships source (.vue/.ts), so
// the stock size-limit presets can't measure it — this script IS the vue-aware gate:
// each entry in .size-limit.json is compiled in isolation with Vite + @vitejs/plugin-vue
// (vue externalized, minified), and the gzipped output is compared against its budget.
// Budgets only ratchet DOWN — raising one requires a written justification in the PR.
// Exit 1 on any over-budget entry; exit 0 when every entry fits.
//
// Coverage is intentionally per-entry (the heaviest/representative public paths), not
// all 197 exports — entries not yet budgeted are listed so the gap is never silent.

import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'
import vuePlugin from '@vitejs/plugin-vue'
import { build } from 'vite'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const PKG = join(SCRIPT_DIR, '..')

const entries = JSON.parse(readFileSync(join(PKG, '.size-limit.json'), 'utf-8'))

function limitToBytes(limit) {
  const m = String(limit)
    .trim()
    .match(/^([\d.]+)\s*(B|KB|MB)$/i)
  if (!m) throw new Error(`unparseable limit "${limit}" — use "<n> B|KB|MB"`)
  const mult = { B: 1, KB: 1024, MB: 1024 * 1024 }[m[2].toUpperCase()]
  return Math.round(parseFloat(m[1]) * mult)
}

async function gzippedSize(entryPath) {
  const result = await build({
    root: PKG,
    configFile: false,
    logLevel: 'error',
    plugins: [vuePlugin()],
    define: { 'process.env.NODE_ENV': JSON.stringify('production') },
    build: {
      write: false,
      minify: 'esbuild',
      cssMinify: true,
      lib: { entry: resolve(PKG, entryPath), formats: ['es'], fileName: 'entry' },
      rollupOptions: { external: ['vue'] }
    }
  })
  const outputs = (Array.isArray(result) ? result : [result]).flatMap((r) => r.output)
  let bytes = 0
  for (const o of outputs) {
    const content = o.type === 'chunk' ? o.code : o.source
    bytes += gzipSync(Buffer.from(content)).length
  }
  return bytes
}

const kb = (n) => `${(n / 1024).toFixed(2)} KB`
const failures = []

for (const e of entries) {
  const limit = limitToBytes(e.limit)
  const size = await gzippedSize(e.path)
  const over = size > limit
  if (over) failures.push(e.name)
  console.log(
    `${over ? '✖' : '✓'} ${e.name.padEnd(14)} ${kb(size).padStart(10)}  (budget ${e.limit})${over ? '  OVER' : ''}`
  )
}

const exportsMap = JSON.parse(readFileSync(join(PKG, 'package.json'), 'utf-8')).exports ?? {}
const componentExports = Object.values(exportsMap).filter((t) =>
  String(t).startsWith('./src/components/')
).length
console.log(
  `\n${entries.length} budgeted entr${entries.length === 1 ? 'y' : 'ies'} of ${componentExports} component export paths — unbudgeted paths are gated by review (bundle-budget.md).`
)

if (failures.length) {
  console.error(
    `\n✖ ${failures.length} entr${failures.length === 1 ? 'y' : 'ies'} over budget: ${failures.join(', ')}.` +
      `\nShrink the entry (budgets only ratchet down) or justify a raise in the PR — .claude/rules/bundle-budget.md.`
  )
  process.exit(1)
}
console.log('✓ check-size: every budgeted entry is within its gzip budget.')
