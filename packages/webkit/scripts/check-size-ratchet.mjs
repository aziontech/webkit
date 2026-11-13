#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(SCRIPT_DIR, '../../..')
const SIZE_LIMIT = 'packages/webkit/.size-limit.json'
export const FALLBACK_BASE = 'origin/feat/webkit-ai-ready'

export function limitToBytes(limit) {
  const m = String(limit)
    .trim()
    .match(/^([\d.]+)\s*(B|KB|MB)$/i)
  if (!m) throw new Error(`unparseable limit "${limit}" — use "<n> B|KB|MB"`)
  const mult = { B: 1, KB: 1024, MB: 1024 * 1024 }[m[2].toUpperCase()]
  return Math.round(parseFloat(m[1]) * mult)
}

export function raisedBudgets(baseEntries, headEntries) {
  const key = (e) => e.path ?? e.name
  const base = new Map(baseEntries.map((e) => [key(e), e]))
  const raised = []
  for (const e of headEntries) {
    const before = base.get(key(e))
    if (!before) continue
    if (limitToBytes(e.limit) > limitToBytes(before.limit)) {
      raised.push({ name: e.name, from: before.limit, to: e.limit })
    }
  }
  return raised.sort((a, b) => a.name.localeCompare(b.name))
}

export function hasBudgetRaise(body) {
  return /^[ \t]*Budget-raise:[ \t]*\S/m.test(String(body ?? '').replace(/\r\n?/g, '\n'))
}

export function baseRef(env) {
  if (env.GITHUB_BASE_REF) return { ref: `origin/${env.GITHUB_BASE_REF}` }
  if (env.GITHUB_ACTIONS === 'true') {
    return { skip: 'not a pull request (no GITHUB_BASE_REF), nothing to compare against' }
  }
  return { ref: FALLBACK_BASE }
}

function git(args) {
  const res = spawnSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 })
  return res.status === 0 ? res.stdout : null
}

function main() {
  const base = baseRef(process.env)
  if (base.skip) {
    console.log(`ℹ size ratchet skipped: ${base.skip}.`)
    return 0
  }
  if (git(['rev-parse', '--verify', '--quiet', `${base.ref}^{commit}`]) === null) {
    console.log(`ℹ size ratchet skipped: ${base.ref} is not available in this checkout.`)
    return 0
  }
  const mergeBase = git(['merge-base', 'HEAD', base.ref])?.trim()
  if (!mergeBase) {
    console.log(`ℹ size ratchet skipped: no merge base between HEAD and ${base.ref}.`)
    return 0
  }
  const baseText = git(['show', `${mergeBase}:${SIZE_LIMIT}`])
  if (baseText === null) {
    console.log(`ℹ size ratchet skipped: ${SIZE_LIMIT} does not exist at the merge base.`)
    return 0
  }
  const head = JSON.parse(readFileSync(join(ROOT, SIZE_LIMIT), 'utf-8'))
  const raised = raisedBudgets(JSON.parse(baseText), head)
  const short = mergeBase.slice(0, 9)

  if (!raised.length) {
    console.log(`✓ size ratchet: no budget raised against ${base.ref} (merge base ${short}).`)
    return 0
  }
  const list = raised.map((r) => `  ${r.name}: ${r.from} → ${r.to}`).join('\n')
  if (hasBudgetRaise(process.env.PR_BODY)) {
    console.log(
      `✓ size ratchet: ${raised.length} budget(s) raised, justified by a Budget-raise: line in the PR body:\n${list}`
    )
    return 0
  }
  console.error(
    `✖ ${raised.length} size budget(s) raised against ${base.ref} (merge base ${short}):\n${list}\n\n` +
      'Budgets only ratchet down. Shrink the entry, or add a line starting "Budget-raise:" with the reason to the PR body (.claude/rules/bundle-budget.md).'
  )
  return 1
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  process.exit(main())
}
