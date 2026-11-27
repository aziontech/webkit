#!/usr/bin/env node
// PreToolUse hook (Write|Edit|MultiEdit): runs the naming standard (contributing/rules/naming.md)
// on the file a write produces and blocks only the violations the write ADDS. Rules in
// the "staged" stage block too while NAMING_STAGED_BLOCKS is true in
// packages/webkit/scripts/lib/naming-rules.mjs (or WEBKIT_NAMING_STRICT=1). The engine is
// the same one the CI gate (scripts/check-naming.mjs) runs. Fail-open on any error.

import { readFileSync } from 'node:fs'
import { relative, resolve } from 'node:path'

import { addedViolations, checkFile, isBlocking, loadContext } from './lib/naming-checks.mjs'

const ROOT = process.cwd()

function readStdin() {
  return new Promise((done) => {
    let data = ''
    process.stdin.on('data', (chunk) => (data += chunk))
    process.stdin.on('end', () => done(data))
  })
}

function readExisting(path) {
  try {
    return readFileSync(path, 'utf-8')
  } catch {
    return ''
  }
}

function applyEdit(base, oldS, newS, replaceAll) {
  if (typeof oldS !== 'string' || oldS === '' || !base.includes(oldS)) return base
  return replaceAll ? base.split(oldS).join(newS ?? '') : base.replace(oldS, newS ?? '')
}

export function resultingContent(tool, ti, baseline) {
  if (tool === 'Write') return ti.content ?? ''
  if (tool === 'Edit') return applyEdit(baseline, ti.old_string, ti.new_string, ti.replace_all)
  if (tool === 'MultiEdit') {
    let result = baseline
    for (const e of ti.edits ?? [])
      result = applyEdit(result, e.old_string, e.new_string, e.replace_all)
    return result
  }
  return baseline
}

export function blockingAdditions(rel, baseline, result, ctx, strict) {
  const before = baseline ? checkFile(rel, baseline, ctx) : []
  const after = checkFile(rel, result, ctx)
  return addedViolations(before, after).filter((x) => isBlocking(x.rule, { strict }))
}

async function main() {
  let input
  try {
    input = JSON.parse(await readStdin())
  } catch {
    process.exit(0)
  }
  const tool = input.tool_name
  if (!['Write', 'Edit', 'MultiEdit'].includes(tool)) process.exit(0)
  const ti = input.tool_input ?? {}
  if (!ti.file_path) process.exit(0)
  const rel = relative(ROOT, resolve(ti.file_path)).split('\\').join('/')
  if (rel.startsWith('..') || rel.includes('node_modules/') || rel.startsWith('.claude/worktrees/'))
    process.exit(0)
  const baseline = readExisting(ti.file_path)
  const result = resultingContent(tool, ti, baseline)
  const strict = process.env.WEBKIT_NAMING_STRICT === '1'
  const blocking = blockingAdditions(rel, baseline, result, loadContext(ROOT), strict)
  if (!blocking.length) process.exit(0)
  const lines = [`Naming standard blocked ${tool} on ${rel}:`, '']
  for (const x of blocking) lines.push(`  [${x.rule}] line ${x.line}: ${x.message}`)
  lines.push(
    '',
    'Rename to the standard name (contributing/rules/naming.md) — do not work around the hook.'
  )
  process.stderr.write(`${lines.join('\n')}\n`)
  process.exit(2)
}

const invoked =
  process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)
if (invoked)
  main().catch((err) => {
    process.stderr.write(`validate-naming hook error: ${err?.message ?? err}\n`)
    process.exit(0)
  })
