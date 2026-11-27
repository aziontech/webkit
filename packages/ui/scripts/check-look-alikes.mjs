#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { compare, comparePairs, COPY_AT, describeAll } from './lib/look-alikes.mjs'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
export const PKG_DIR = resolve(SCRIPT_DIR, '..')
export const ROOT = resolve(PKG_DIR, '../..')
export const BASELINE = join(SCRIPT_DIR, 'look-alikes-baseline.json')

export function findCopies(pkgDir = PKG_DIR, root = ROOT) {
  const all = describeAll(pkgDir, root)
  return { all, pairs: comparePairs(all) }
}

export function compareBaseline(pairs, baseline) {
  const copies = pairs.filter((p) => p.verdict === 'copy')
  const keys = new Set(copies.map((p) => p.key))
  const known = new Set(baseline.known || [])
  const accepted = baseline.accepted || {}
  const introduced = copies.filter((p) => !known.has(p.key) && !(p.key in accepted))
  const stale = [...known, ...Object.keys(accepted)].filter((k) => !keys.has(k))
  return { copies, introduced, stale }
}

const pct = (x) => `${Math.round(x * 100)}%`

function line(p) {
  const s = p.signals
  return (
    `  ${pct(p.score).padStart(4)}  ${p.key}\n` +
    `        props ${pct(s.props)}, behaviour ${pct(s.behaviour)}, classes ${pct(s.classes)}, ` +
    `purpose ${pct(s.purpose)}; shared props: ${p.sharedProps.join(', ') || 'none'}; ` +
    `shared behaviour: ${p.sharedBehaviour.map((f) => f.slice(5)).join(', ') || 'none'}`
  )
}

function readBaseline() {
  return JSON.parse(readFileSync(BASELINE, 'utf8'))
}

function writeBaseline(baseline) {
  const known = [...new Set(baseline.known)].sort()
  const accepted = Object.fromEntries(Object.entries(baseline.accepted || {}).sort())
  writeFileSync(BASELINE, JSON.stringify({ known, accepted }, null, 2) + '\n')
}

function explain(names) {
  const { all } = findCopies()
  const byName = new Map(all.map((c) => [c.name, c]))
  const missing = names.filter((n) => !byName.has(n))
  if (missing.length) {
    console.error(`✖ Not an exported component: ${missing.join(', ')}`)
    return 1
  }
  for (let i = 0; i < names.length; i++)
    for (let j = i + 1; j < names.length; j++) {
      const p = compare(byName.get(names[i]), byName.get(names[j]))
      console.log(
        `${line(p)}\n        verdict: ${p.verdict}${p.reuse ? ' (one uses the other)' : ''}`
      )
    }
  for (const name of names) {
    const near = all
      .filter((c) => c.name !== name)
      .map((c) => compare(byName.get(name), c))
      .sort((x, y) => y.score - x.score)
      .slice(0, 5)
    console.log(`\nClosest to ${name}:`)
    for (const p of near) console.log(`${line(p)}\n        verdict: ${p.verdict}`)
  }
  return 0
}

function main(argv) {
  const names = argv.filter((a) => !a.startsWith('--'))
  if (names.length) return explain(names)

  const { all, pairs } = findCopies()
  if (argv.includes('--json')) {
    console.log(
      JSON.stringify(
        pairs.map(({ key, score, signals, reuse, verdict }) => ({
          key,
          score,
          signals,
          reuse,
          verdict
        })),
        null,
        2
      )
    )
    return 0
  }
  if (argv.includes('--report')) {
    for (const verdict of ['copy', 'check']) {
      const list = pairs.filter((p) => p.verdict === verdict)
      console.log(`\n${verdict} (${list.length}):`)
      for (const p of list) console.log(line(p))
    }
    return 0
  }

  if (argv.includes('--update')) {
    const previous = readBaselineOrEmpty()
    const copies = pairs.filter((p) => p.verdict === 'copy').map((p) => p.key)
    writeBaseline({
      known: copies.filter((k) => !(k in previous.accepted)),
      accepted: previous.accepted
    })
    console.log(`look-alikes-baseline.json updated: ${copies.length} look-alike pairs.`)
    return 0
  }

  const baseline = readBaseline()
  const { copies, introduced, stale } = compareBaseline(pairs, baseline)

  if (argv.includes('--prune') && stale.length) {
    const gone = new Set(stale)
    writeBaseline({
      known: baseline.known.filter((k) => !gone.has(k)),
      accepted: Object.fromEntries(
        Object.entries(baseline.accepted || {}).filter(([k]) => !gone.has(k))
      )
    })
    console.log(`look-alikes-baseline.json pruned: ${stale.length} pair(s) removed, nothing added.`)
    return 0
  }

  if (!introduced.length && !stale.length) {
    console.log(
      `✓ look-alikes: ${all.length} components, ${copies.length} look-alike pairs at or over ${pct(COPY_AT)}, all in the baseline, 0 new.`
    )
    return 0
  }
  if (introduced.length) {
    console.error(
      `✖ ${introduced.length} new pair(s) of components that do the same job and neither uses the other:\n`
    )
    for (const p of introduced) console.error(line(p))
    console.error(
      '\nBuild one on the other (import it, or move the shared part to a composable), or make one a variant of the other.' +
        '\nIf the two are alike on purpose, add the pair to "accepted" in scripts/look-alikes-baseline.json with the reason.' +
        '\nSee one pair in detail: node scripts/check-look-alikes.mjs <a> <b>'
    )
  }
  if (stale.length) {
    console.error(
      `\n✖ ${stale.length} baseline pair(s) no longer look alike — trim the baseline with \`node scripts/check-look-alikes.mjs --prune\`:\n`
    )
    for (const k of stale) console.error(`  ${k}`)
  }
  return 1
}

function readBaselineOrEmpty() {
  try {
    const b = readBaseline()
    return { known: b.known || [], accepted: b.accepted || {} }
  } catch {
    return { known: [], accepted: {} }
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  process.exit(main(process.argv.slice(2)))
}
