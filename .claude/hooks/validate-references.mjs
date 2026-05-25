#!/usr/bin/env node
// PreToolUse hook: blocks Write/Edit/MultiEdit on JS/TS/Vue files when the new
// content introduces imports/requires that point to non-existent files, exports,
// or packages. Prevents the agent from "hallucinating" paths and modules.

import { existsSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'

const ROOT = process.cwd()

function readStdin() {
  return new Promise((res) => {
    let data = ''
    process.stdin.on('data', (c) => (data += c))
    process.stdin.on('end', () => res(data))
  })
}

function collectContent(input) {
  const tool = input.tool_name
  const ti = input.tool_input ?? {}
  if (tool === 'Write') return [ti.content ?? '']
  if (tool === 'Edit') return [ti.new_string ?? '']
  if (tool === 'MultiEdit') return (ti.edits ?? []).map((e) => e.new_string ?? '')
  return []
}

function extractImports(content) {
  const imports = new Set()
  const re1 = /(?:^|\n)\s*import\s+(?:[^'"\n]*?\sfrom\s+)?['"]([^'"]+)['"]/g
  const re2 = /(?:^|[^.\w])import\s*\(\s*['"]([^'"]+)['"]\s*\)/g
  const re3 = /(?:^|[^.\w])require\s*\(\s*['"]([^'"]+)['"]\s*\)/g
  let m
  while ((m = re1.exec(content))) imports.add(m[1])
  while ((m = re2.exec(content))) imports.add(m[1])
  while ((m = re3.exec(content))) imports.add(m[1])
  return imports
}

function readBaselineImports(filePath) {
  try {
    return extractImports(readFileSync(filePath, 'utf-8'))
  } catch {
    return new Set()
  }
}

function resolveAziontechWebkit(specifier) {
  try {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'packages/webkit/package.json'), 'utf-8'))
    const subpath = specifier.replace(/^@aziontech\/webkit/, '.')
    const target = pkg.exports?.[subpath]
    if (!target) return false
    const rel = target.replace(/^\.\//, '')
    return existsSync(join(ROOT, 'packages/webkit', rel))
  } catch {
    return false
  }
}

function resolveAziontechWorkspace(specifier) {
  // Other workspaces: @aziontech/theme, @aziontech/icons
  const match = specifier.match(/^@aziontech\/([^/]+)/)
  if (!match) return false
  const wsName = match[1]
  return existsSync(join(ROOT, 'packages', wsName, 'package.json'))
}

function resolveRelativeImport(specifier, fromFile) {
  const baseDir = dirname(resolve(fromFile))
  const target = resolve(baseDir, specifier)
  const candidates = [
    target,
    `${target}.vue`,
    `${target}.ts`,
    `${target}.tsx`,
    `${target}.js`,
    `${target}.jsx`,
    `${target}.mjs`,
    `${target}.cjs`,
    join(target, 'index.vue'),
    join(target, 'index.ts'),
    join(target, 'index.tsx'),
    join(target, 'index.js'),
    join(target, 'index.jsx'),
    join(target, 'index.mjs'),
    join(target, 'index.cjs')
  ]
  return candidates.some((c) => {
    try {
      return statSync(c).isFile()
    } catch {
      return false
    }
  })
}

function resolveNodeModule(specifier) {
  const parts = specifier.split('/')
  const pkgName = specifier.startsWith('@') ? `${parts[0]}/${parts[1]}` : parts[0]
  const dirs = [
    'node_modules',
    'packages/webkit/node_modules',
    'packages/theme/node_modules',
    'packages/icons/node_modules',
    'apps/storybook/node_modules',
    'apps/icons-gallery/node_modules'
  ]
  return dirs.some((d) => existsSync(join(ROOT, d, pkgName)))
}

async function main() {
  const raw = await readStdin()
  let input
  try {
    input = JSON.parse(raw)
  } catch {
    process.exit(0)
  }
  if (!['Write', 'Edit', 'MultiEdit'].includes(input.tool_name)) process.exit(0)
  const filePath = input.tool_input?.file_path
  if (!filePath) process.exit(0)
  if (!/\.(vue|ts|tsx|js|jsx|mjs|cjs)$/.test(filePath)) process.exit(0)

  const newContent = collectContent(input).join('\n')
  const newImports = extractImports(newContent)
  if (newImports.size === 0) process.exit(0)

  const baselineImports = input.tool_name === 'Write' ? new Set() : readBaselineImports(filePath)

  const invalid = []
  for (const spec of newImports) {
    if (baselineImports.has(spec)) continue
    // skip Vue / virtual imports
    if (/^(virtual:|vue|vue\/.*)$/.test(spec)) continue
    // node: prefix is always valid
    if (spec.startsWith('node:')) continue

    let ok = false
    let reason = ''

    if (spec.startsWith('@aziontech/webkit')) {
      ok = resolveAziontechWebkit(spec)
      reason = 'no matching entry in packages/webkit/package.json#exports'
    } else if (spec.startsWith('@aziontech/')) {
      ok = resolveAziontechWorkspace(spec)
      reason = 'no such workspace under packages/'
    } else if (spec.startsWith('.') || spec.startsWith('/')) {
      ok = resolveRelativeImport(spec, filePath)
      reason = 'relative path does not resolve to any file'
    } else {
      ok = resolveNodeModule(spec)
      reason = 'package not installed in any node_modules'
    }

    if (!ok) invalid.push({ spec, reason })
  }

  if (invalid.length === 0) process.exit(0)

  const relPath = relative(ROOT, resolve(filePath))
  const lines = [
    `Reference validation blocked ${input.tool_name} on ${relPath}.`,
    '',
    'These imports reference paths/packages that do not exist:'
  ]
  for (const v of invalid) {
    lines.push(`  ✗ ${v.spec}`)
    lines.push(`    Reason: ${v.reason}`)
  }
  lines.push('')
  lines.push('Do not invent paths. Either:')
  lines.push(
    '  1) Import an existing export — for @aziontech/webkit see packages/webkit/package.json#exports.'
  )
  lines.push(
    '  2) Install the missing package via `pnpm --filter <workspace> add <pkg>` before importing it.'
  )
  lines.push(
    '  3) Create the referenced file first (with its package.json entry where required), then import.'
  )
  lines.push('  4) Remove the import.')

  process.stderr.write(lines.join('\n') + '\n')
  process.exit(2)
}

main().catch((err) => {
  process.stderr.write(`validate-references hook error: ${err?.message ?? err}\n`)
  process.exit(0)
})
