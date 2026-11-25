#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(SCRIPT_DIR, '../../..')
const SIZE_LIMIT = 'packages/webkit/.size-limit.json'
export const FALLBACK_BASE = 'origin/main'
const RECORD = 'packages/webkit/docs/reviews/size-budgets-v6.md'

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

const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export function budgetRaiseLines(text) {
  return String(text ?? '')
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^Budget-raise:[ \t]*\S/.test(line))
}

export function justifies(line, raise) {
  const head = line.match(new RegExp(`^Budget-raise:\\s*${escape(raise.name)}\\s+(.*)$`))
  if (!head) return false
  const to = String(raise.to).trim()
  const limit = to.split(' (')[0]
  if (limit !== to) return true
  const target = limitToBytes(limit)
  const unit = limit.match(/(B|KB|MB)$/i)[1]
  return [...head[1].matchAll(/(?:→|->)\s*([\d.]+)\s*(B|KB|MB)?/gi)].some(
    (m) => limitToBytes(`${m[1]} ${m[2] ?? unit}`) >= target
  )
}

export function unjustified(raised, ...texts) {
  const lines = texts.flatMap(budgetRaiseLines)
  return raised.filter((raise) => !lines.some((line) => justifies(line, raise)))
}

const MERGE = /\bmerg(?:e|ed|es|ing)\b/i
const SUMMED =
  /\b(?:both sides|each (?:lane|side|fit|grew|raised)|landed together|its own (?:budget|fix)|each (?:of them )?fit)\b/i

export function reasonOf(line) {
  return line.replace(/^Budget-raise:\s*\S+[^:]*:\s*/, '')
}

export function mergeOnly(line) {
  const reason = reasonOf(line)
  return MERGE.test(reason) && SUMMED.test(reason)
}

export const MERGE_ONLY_FROM = '## Raises after audit 6'

export function linesAfter(text, heading = MERGE_ONLY_FROM) {
  const source = String(text ?? '')
  const at = source.indexOf(`\n${heading}\n`)
  return at < 0 ? [] : budgetRaiseLines(source.slice(at))
}

export function mergeOnlyRaises(raised, fresh, ...texts) {
  const lines = texts.flatMap(budgetRaiseLines)
  return raised.filter((raise) => {
    const reasons = lines.filter((line) => justifies(line, raise))
    return reasons.length > 0 && reasons.every((line) => mergeOnly(line) && fresh.includes(line))
  })
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
  const record = readFileSync(join(ROOT, RECORD), 'utf-8')
  const missing = unjustified(raised, process.env.PR_BODY, record)
  const fresh = [...budgetRaiseLines(process.env.PR_BODY), ...linesAfter(record)]
  const merged = missing.length ? [] : mergeOnlyRaises(raised, fresh, process.env.PR_BODY, record)
  if (merged.length) {
    console.error(
      `✖ ${merged.length} size budget(s) raised with only a merge as the reason:\n` +
        merged.map((r) => `  ${r.name}: ${r.from} → ${r.to}`).join('\n') +
        `\n\nA merge adds no feature: "each side fit its own budget" does not explain the growth. Shrink the entry, or name what grew in the Budget-raise: line (.claude/rules/bundle-budget.md).`
    )
    return 1
  }
  if (!missing.length) {
    console.log(
      `✓ size ratchet: ${raised.length} budget(s) raised, each with its Budget-raise: line (PR body or ${RECORD}):\n${list}`
    )
    return 0
  }
  const missingList = missing.map((r) => `  ${r.name}: ${r.from} → ${r.to}`).join('\n')
  console.error(
    `✖ ${raised.length} size budget(s) raised against ${base.ref} (merge base ${short}):\n${list}\n\n` +
      `${missing.length} have no Budget-raise: line naming the entry and its new limit:\n${missingList}\n\n` +
      `Budgets only ratchet down. Shrink the entry, or add one line per entry, "Budget-raise: <name> <old> → <new> (measured …): <reason>", to ${RECORD} or the PR body (.claude/rules/bundle-budget.md).`
  )
  return 1
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  process.exit(main())
}
