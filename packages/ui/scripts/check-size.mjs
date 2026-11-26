#!/usr/bin/env node

import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { gzipSync } from 'node:zlib'
import vuePlugin from '@vitejs/plugin-vue'
import { build } from 'vite'

import { limitToBytes } from './check-size-ratchet.mjs'
import { exportTarget } from './lib/exports.mjs'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const PKG = join(SCRIPT_DIR, '..')

export function initialOutputs(outputs) {
  const byName = new Map(outputs.map((o) => [o.fileName, o]))
  const initial = new Set()
  const visit = (o) => {
    if (!o || initial.has(o)) return
    initial.add(o)
    if (o.type !== 'chunk') return
    for (const name of o.imports ?? []) visit(byName.get(name))
    for (const name of o.viteMetadata?.importedCss ?? []) visit(byName.get(name))
    for (const name of o.viteMetadata?.importedAssets ?? []) visit(byName.get(name))
  }
  for (const o of outputs) if (o.isEntry) visit(o)
  return outputs.filter((o) => initial.has(o))
}

export function lazyEntries(outputs, counted) {
  const byName = new Map(outputs.map((o) => [o.fileName, o]))
  const seen = new Set(counted)
  const closure = (start) => {
    const own = []
    const visit = (o) => {
      if (!o || seen.has(o) || own.includes(o)) return
      own.push(o)
      if (o.type !== 'chunk') return
      for (const name of o.imports ?? []) visit(byName.get(name))
      for (const name of o.viteMetadata?.importedCss ?? []) visit(byName.get(name))
    }
    visit(start)
    return own
  }
  const firstLevel = []
  for (const o of counted) {
    if (o.type !== 'chunk') continue
    for (const name of o.dynamicImports ?? []) {
      const target = byName.get(name)
      if (target && !seen.has(target) && !firstLevel.includes(target)) firstLevel.push(target)
    }
  }
  return firstLevel.map((o) => ({ fileName: o.fileName, outputs: closure(o) }))
}

const gzipOf = (o) => gzipSync(Buffer.from(o.type === 'chunk' ? o.code : o.source)).length

async function gzippedSize(entryPath, { entryOnly = false } = {}) {
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
  const initial = initialOutputs(outputs)
  const counted = entryOnly ? initial : outputs
  let bytes = 0
  for (const o of counted) bytes += gzipOf(o)
  const lazy = entryOnly
    ? lazyEntries(outputs, counted).map((l) => ({
        fileName: l.fileName,
        bytes: l.outputs.reduce((sum, o) => sum + gzipOf(o), 0)
      }))
    : []
  return {
    bytes,
    split: outputs.length - counted.length,
    lazy,
    lazyUncounted: !entryOnly && initial.length < outputs.length
  }
}

const kb = (n) => `${(n / 1024).toFixed(2)} KB`

async function main(args) {
  const listLazy = args.includes('--lazy')
  const only = args.filter((a) => !a.startsWith('--'))
  const all = JSON.parse(readFileSync(join(PKG, '.size-limit.json'), 'utf-8'))
  const entries = only.length ? all.filter((e) => only.includes(e.name)) : all
  const unknown = only.filter((name) => !all.some((e) => e.name === name))
  if (unknown.length) {
    console.error(`✖ no budget named ${unknown.join(', ')} in .size-limit.json.`)
    return 1
  }
  const failures = []
  const unsplit = []

  for (const e of entries) {
    const limit = limitToBytes(e.limit)
    const {
      bytes: size,
      split,
      lazy,
      lazyUncounted
    } = await gzippedSize(e.path, { entryOnly: e.entryOnly })
    const over = size > limit
    if (over) failures.push(e.name)
    if (lazyUncounted) unsplit.push(e.name)
    const note = e.entryOnly
      ? `  · entry and its static imports, ${split} lazy chunk(s) excluded`
      : ''
    console.log(
      `${over ? '✖' : '✓'} ${e.name.padEnd(18)} ${kb(size).padStart(10)}  (budget ${e.limit})${over ? '  OVER' : ''}${note}`
    )
    if (listLazy)
      for (const l of [...lazy].sort((a, b) => b.bytes - a.bytes))
        console.log(`    lazy ${kb(l.bytes).padStart(10)}  ${l.fileName}`)
  }

  const exportsMap = JSON.parse(readFileSync(join(PKG, 'package.json'), 'utf-8')).exports ?? {}
  const componentExports = Object.values(exportsMap).filter((entry) =>
    exportTarget(entry).startsWith('./src/components/')
  ).length
  if (!only.length) {
    console.log(
      `\n${entries.length} budgeted entr${entries.length === 1 ? 'y' : 'ies'} of ${componentExports} component export paths — a root component with no budget fails check-complete (bundle-budget.md).`
    )
  }

  if (unsplit.length) {
    console.error(
      `\n✖ ${unsplit.length} entr${unsplit.length === 1 ? 'y loads' : 'ies load'} lazy chunks without \`entryOnly\`: ${unsplit.join(', ')}.` +
        `\nSet \`"entryOnly": true\` and the limit to the entry measurement, so the budget counts what loads first (audit-6 A6-271).`
    )
  }
  if (failures.length) {
    console.error(
      `\n✖ ${failures.length} entr${failures.length === 1 ? 'y' : 'ies'} over budget: ${failures.join(', ')}.` +
        `\nShrink the entry (budgets only ratchet down) or justify a raise in the PR — contributing/rules/bundle-budget.md.`
    )
    return 1
  }
  if (unsplit.length) return 1
  console.log(
    `✓ check-size: ${only.length ? 'the named entries are' : 'every budgeted entry is'} within budget.`
  )
  return 0
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  process.exit(await main(process.argv.slice(2)))
}
