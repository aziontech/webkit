#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { exportTarget } from './lib/exports.mjs'
import { getSection, parseSpecFile } from '../../../.claude/hooks/_lib/spec.mjs'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
export const DEFAULT_ROOT = resolve(SCRIPT_DIR, '../../..')
export const BASELINE = join(SCRIPT_DIR, 'complete-baseline.json')

export const CHECKS = {
  export: 'The spec is implemented but packages/webkit/package.json#exports has no entry for it.',
  'root-export':
    'The compound export points at index.ts but there is no "./<name>-root" export pointing at the root .vue (compound-api.md).',
  'size-budget':
    'No entry in packages/webkit/.size-limit.json for the component or its -root path (bundle-budget.md).',
  examples: 'No packages/webkit/examples/<name>/examples.json.',
  'examples-count':
    'examples.json ships fewer examples than the spec lists in its ## Examples section.',
  'visual-baseline':
    "No apps/visual baseline for the group's first example (<first>--light-1280.png).",
  'spec-status':
    'The component ships but its spec is still status: approved (flip it to implemented).'
}

function splitTopLevel(text) {
  const parts = []
  let depth = 0
  let current = ''
  for (const ch of text) {
    if (ch === '(' || ch === '[') depth++
    else if (ch === ')' || ch === ']') depth = Math.max(0, depth - 1)
    if (ch === ',' && depth === 0) {
      parts.push(current)
      current = ''
    } else current += ch
  }
  parts.push(current)
  return parts.map((p) => p.trim()).filter(Boolean)
}

const MAX_NAME_WORDS = 6

function bulletName(text) {
  const bold = text.match(/^\*\*(.+?)\*\*/)
  const raw = bold ? bold[1] : text.split(/\s+[—–]\s+|\s+-\s+|:\s/)[0]
  const name = raw.replace(/[`*_]/g, '').trim()
  const words = name
    .replace(/\s*\(.*?\)/g, '')
    .split(/\s+/)
    .filter(Boolean)
  return words.length > MAX_NAME_WORDS ? '' : name
}

export function parseSpecExamples(section) {
  if (!section) return []
  const text = section.replace(/<!--[\s\S]*?-->/g, '')
  const lines = text.split('\n')
  const bullets = lines
    .filter((l) => /^[-*+]\s+\S/.test(l) || /^\d+[.)]\s+\S/.test(l))
    .map((l) => bulletName(l.replace(/^([-*+]|\d+[.)])\s+/, '')))
    .filter(Boolean)
  if (bullets.length) return bullets

  const rows = lines.filter((l) => /^\s*\|/.test(l))
  if (rows.length > 2 && /^\s*\|[\s:|-]+\|\s*$/.test(rows[1])) {
    return rows
      .slice(2)
      .map((r) =>
        r
          .trim()
          .replace(/^\||\|$/g, '')
          .split('|')[0]
          .replace(/[`*_]/g, '')
          .trim()
      )
      .filter(Boolean)
  }

  const inline = text.match(/_Examples?\s+in\s+[^:]*:\s*([\s\S]+?)\.?_\s*$/m)
  if (inline) return splitTopLevel(inline[1]).map((p) => p.replace(/\s*\(.*\)$/, '').trim())

  return []
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf-8'))
}

function walkExamplesJson(dir, out = []) {
  if (!existsSync(dir)) return out
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) walkExamplesJson(p, out)
    else if (entry.name === 'examples.json') out.push(p)
  }
  return out
}

function loadSpec(root, name) {
  const path = join(root, '.specs', `${name}.md`)
  if (!existsSync(path)) return null
  const { frontmatter, body } = parseSpecFile(path)
  return { status: frontmatter?.status ?? null, body: body ?? '' }
}

export function collectFindings(root = DEFAULT_ROOT) {
  const pkgDir = join(root, 'packages/webkit')
  const catalog = readJson(join(pkgDir, 'catalog.json'))
  const exportsMap = Object.fromEntries(
    Object.entries(readJson(join(pkgDir, 'package.json')).exports ?? {}).map(([k, v]) => [
      k,
      exportTarget(v)
    ])
  )
  const sizeEntries = readJson(join(pkgDir, '.size-limit.json'))
  const budgetNames = new Set(sizeEntries.map((e) => e.name))
  const budgetPaths = new Set(sizeEntries.map((e) => String(e.path).replace(/^\.\//, '')))
  const findings = new Map()
  const add = (subject, check, detail = CHECKS[check]) =>
    findings.set(`${subject}::${check}`, detail)

  const components = Object.entries(catalog.imports ?? {})
    .filter(([, e]) => e.kind === 'component')
    .map(([name]) => name)
    .sort()
  const shipped = new Set(components)

  const specsDir = join(root, '.specs')
  if (existsSync(specsDir)) {
    for (const file of readdirSync(specsDir)) {
      if (!file.endsWith('.md') || file.startsWith('_') || file === 'README.md') continue
      const name = file.slice(0, -3)
      if (shipped.has(name) || exportsMap[`./${name}`]) continue
      if (loadSpec(root, name)?.status === 'implemented') add(name, 'export')
    }
  }

  for (const name of components) {
    const target = exportsMap[`./${name}`] ?? ''
    const rootTarget = exportsMap[`./${name}-root`] ?? ''
    if (!target) add(name, 'export')
    if (/\/index\.(ts|js)$/.test(target) && !rootTarget.endsWith('.vue')) add(name, 'root-export')

    const budgeted =
      budgetNames.has(name) ||
      budgetNames.has(`${name}-root`) ||
      [target, rootTarget].some((t) => t && budgetPaths.has(t.replace(/^\.\//, '')))
    if (!budgeted) add(name, 'size-budget')

    const spec = loadSpec(root, name)
    const examplesJson = join(pkgDir, 'examples', name, 'examples.json')
    if (!existsSync(examplesJson)) {
      add(name, 'examples')
    } else if (spec) {
      const listed = parseSpecExamples(getSection(spec.body, 'Examples'))
      const shippedCount = (readJson(examplesJson).examples ?? []).length
      if (shippedCount < listed.length) {
        add(
          name,
          'examples-count',
          `The spec lists ${listed.length} examples (${listed.join(', ')}); examples.json ships ${shippedCount}.`
        )
      }
    }

    if (spec?.status === 'approved') add(name, 'spec-status')
  }

  const examplesDir = join(pkgDir, 'examples')
  for (const file of walkExamplesJson(examplesDir)) {
    const group = relative(examplesDir, dirname(file)).split('\\').join('/')
    const first = (readJson(file).examples ?? [])[0]
    const stem = first?.file ? first.file.replace(/\.vue$/, '') : null
    const baseline = stem
      ? join(root, 'apps/visual/baselines/examples', group, `${stem}--light-1280.png`)
      : null
    if (!baseline || !existsSync(baseline)) {
      add(
        `examples/${group}`,
        'visual-baseline',
        stem
          ? `Missing apps/visual/baselines/examples/${group}/${stem}--light-1280.png — regenerate with /regen-baselines.`
          : 'examples.json lists no example, so the visual suite has nothing to shoot.'
      )
    }
  }

  return findings
}

export function compareBaseline(current, baseline) {
  const known = new Set(baseline)
  const now = new Set(current)
  return {
    introduced: [...now].filter((k) => !known.has(k)).sort(),
    stale: [...known].filter((k) => !now.has(k)).sort()
  }
}

export function summarize(keys) {
  const counts = {}
  for (const k of keys) {
    const check = k.slice(k.lastIndexOf('::') + 2)
    counts[check] = (counts[check] ?? 0) + 1
  }
  return counts
}

function main(argv) {
  const findings = collectFindings()
  const current = [...findings.keys()].sort()
  const counts = Object.entries(summarize(current))
    .map(([k, n]) => `${k} ${n}`)
    .join(', ')

  if (argv.includes('--update')) {
    writeFileSync(BASELINE, JSON.stringify(current, null, 2) + '\n')
    console.log(`complete-baseline.json updated: ${current.length} known gaps (${counts}).`)
    return 0
  }

  let baseline
  try {
    baseline = readJson(BASELINE)
  } catch {
    console.error(
      'No complete-baseline.json — run `node scripts/check-complete.mjs --update` once.'
    )
    return 1
  }
  const { introduced, stale } = compareBaseline(current, baseline)

  if (argv.includes('--prune')) {
    const gone = new Set(stale)
    writeFileSync(
      BASELINE,
      JSON.stringify(
        baseline.filter((k) => !gone.has(k)),
        null,
        2
      ) + '\n'
    )
    console.log(
      `complete-baseline.json pruned: ${stale.length} closed gap(s) removed, nothing added.`
    )
    return introduced.length ? fail(introduced, [], findings) : 0
  }

  if (introduced.length || stale.length) return fail(introduced, stale, findings)
  console.log(
    `✓ component-complete: ${current.length} known gaps in the baseline (${counts}), 0 new.`
  )
  return 0
}

function fail(introduced, stale, findings) {
  if (introduced.length) {
    console.error(`\n✖ ${introduced.length} NEW incomplete component piece(s):\n`)
    for (const k of introduced) {
      const subject = k.slice(0, k.lastIndexOf('::'))
      const check = k.slice(k.lastIndexOf('::') + 2)
      console.error(`  ${subject} [${check}] ${findings.get(k)}`)
    }
    console.error(
      '\nShip the missing piece. The baseline only shrinks: it records debt, it never admits new debt.'
    )
  }
  if (stale.length) {
    console.error(
      `\n✖ ${stale.length} baseline entr${stale.length === 1 ? 'y is' : 'ies are'} fixed — trim the baseline with \`node scripts/check-complete.mjs --prune\`:\n`
    )
    for (const k of stale) console.error(`  - ${k}`)
  }
  return 1
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  process.exit(main(process.argv.slice(2)))
}
