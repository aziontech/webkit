#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(SCRIPT_DIR, '../../..')
const SIZE_LIMIT = 'packages/webkit/.size-limit.json'
const REVIEWS = 'packages/webkit/docs/reviews'
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
    const narrowed = Boolean(e.entryOnly) && !before.entryOnly
    if (narrowed || limitToBytes(e.limit) > limitToBytes(before.limit)) {
      raised.push({
        name: e.name,
        from: before.limit,
        to: narrowed ? `${e.limit} (entryOnly: lazy chunks no longer counted)` : e.limit
      })
    }
  }
  return raised.sort((a, b) => a.name.localeCompare(b.name))
}

export function budgetRaiseNames(...texts) {
  const names = new Set()
  const line = /^[ \t]*Budget-raise:[ \t]*([A-Za-z0-9][A-Za-z0-9-]*)[ \t][^\n]*?:[ \t]*\S/gm
  for (const text of texts) {
    for (const m of String(text ?? '')
      .replace(/\r\n?/g, '\n')
      .matchAll(line))
      names.add(m[1])
  }
  return names
}

export function unjustifiedRaises(raised, ...texts) {
  const names = budgetRaiseNames(...texts)
  return raised.filter((r) => !names.has(r.name))
}

function reviewTexts() {
  const dir = join(ROOT, REVIEWS)
  return readdirSync(dir)
    .filter((f) => /^size-budgets.*\.md$/.test(f))
    .map((f) => readFileSync(join(dir, f), 'utf-8'))
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
  const list = (rows) => rows.map((r) => `  ${r.name}: ${r.from} → ${r.to}`).join('\n')
  const missing = unjustifiedRaises(raised, process.env.PR_BODY, ...reviewTexts())
  if (!missing.length) {
    console.log(
      `✓ size ratchet: ${raised.length} budget(s) raised, each with its own Budget-raise: line:\n${list(raised)}`
    )
    return 0
  }
  console.error(
    `✖ ${missing.length} of ${raised.length} raised size budget(s) against ${base.ref} (merge base ${short}) have no Budget-raise: line:\n${list(missing)}\n\n` +
      'Budgets only ratchet down. Shrink the entry, or add one line per raised entry, "Budget-raise: <name> <from> → <to> (measured <n>): <reason>", to the PR body or to packages/webkit/docs/reviews/size-budgets-*.md (.claude/rules/bundle-budget.md).'
  )
  return 1
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  process.exit(main())
}
