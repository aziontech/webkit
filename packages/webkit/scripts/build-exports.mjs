#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { exportTarget, typedExports } from './lib/exports.mjs'

const PKG = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const PKG_JSON = join(PKG, 'package.json')

export function exportsProblems(pkg, pkgDir = PKG) {
  const problems = []
  const expected = typedExports(pkg.exports ?? {})
  for (const [key, entry] of Object.entries(pkg.exports ?? {})) {
    if (JSON.stringify(entry) !== JSON.stringify(expected[key])) {
      problems.push(`${key}: expected ${JSON.stringify(expected[key])}`)
    }
    const target = exportTarget(entry)
    if (!target) problems.push(`${key}: no default target`)
    else if (!existsSync(join(pkgDir, target))) problems.push(`${key}: ${target} does not exist`)
  }
  return problems
}

const invoked = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (invoked) {
  const check = process.argv.includes('--check')
  const raw = readFileSync(PKG_JSON, 'utf8')
  const pkg = JSON.parse(raw)
  if (check) {
    const problems = exportsProblems(pkg)
    if (problems.length) {
      console.error(`package.json#exports is not in the typed shape (${problems.length}):`)
      for (const p of problems.slice(0, 50)) console.error(`  - ${p}`)
      console.error('Run: pnpm --filter @aziontech/webkit exports:build')
      process.exit(1)
    }
    console.log(`Exports OK: ${Object.keys(pkg.exports).length} entries, every source entry typed.`)
  } else {
    pkg.exports = typedExports(pkg.exports ?? {})
    const next = `${JSON.stringify(pkg, null, 2)}\n`
    if (next !== raw) writeFileSync(PKG_JSON, next)
    const missing = exportsProblems(pkg)
    if (missing.length) {
      for (const p of missing) console.error(`  - ${p}`)
      process.exit(1)
    }
    console.log(`Wrote typed exports for ${Object.keys(pkg.exports).length} entries.`)
  }
}
