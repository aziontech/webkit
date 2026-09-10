// `webkit report` — measures how much of a consumer's UI is actually the design system.
//
// Runs the project's own ESLint, keeps only `webkit/*` results, and writes Markdown to
// stdout so a CI step can redirect it into a run summary. With a baseline it becomes a
// ratchet. Why it spawns the CLI and not the API: docs/toolkit/report.md.

import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, relative } from 'node:path'

import { loadCatalog } from '../eslint-plugin/catalog.js'

/** Extensions the design system governs — the denominator of the adoption score. */
export const UI_EXTENSIONS = ['vue', 'astro']

/** Default baseline location in the consumer's repo. */
export const BASELINE_FILE = '.webkit-baseline.json'

/** What each rule catches, keyed by the bare name so a namespace change cannot break it. */
const RULE_PURPOSE = {
  'valid-import-path': 'import path that does not exist in the installed version',
  'no-deep-internal-import': 'reaches into the package internals instead of a published entry',
  'no-barrel-import': 'bare-package barrel import (there is no barrel entry)',
  'no-whole-icon-set-import': 'pulls the whole icon set instead of one icon',
  'no-hardcoded-color': 'hardcoded colour, palette class or raw text size',
  'no-hardcoded-motion': 'literal duration/easing, or motion with no reduced-motion escape',
  'prefer-tree-shakeable-root': 'compound entry imported where the root would do',
  'no-deprecated-component': 'component marked deprecated in the catalog',
  'prefer-webkit-component': 'foreign UI library where a webkit component exists',
  'prefer-define-model': 'hand-rolled modelValue + update:modelValue pair',
  'no-style-override': 'class/style on a webkit component — restyling it',
  'authoring-standards': 'shared authoring standards (typed slots, comments, deprecation)'
}

/** Cannot run on `.astro` — needs vue-eslint-parser's template visitor. Reported as a gap. */
const TEMPLATE_ONLY_RULES = ['no-style-override']

export const FAIL_MODES = new Set(['never', 'new', 'any'])

function extensionOf(path) {
  const base = path.slice(path.lastIndexOf('/') + 1)
  const dot = base.lastIndexOf('.')
  return dot === -1 ? '' : base.slice(dot + 1)
}

/**
 * The `.bin/eslint` shim, not the API and not the bin file: both of those lose `.astro`
 * findings silently on a pnpm install. See docs/toolkit/report.md § Why the shim.
 */
function eslintCommand(cwd) {
  const shim = join(
    cwd,
    'node_modules',
    '.bin',
    process.platform === 'win32' ? 'eslint.cmd' : 'eslint'
  )
  if (existsSync(shim)) return { command: shim, prefix: [] }

  // Unusual install layout: fall back to the manifest's bin with node.
  const require = createRequire(join(cwd, '__webkit_report__.js'))
  const manifestPath = require.resolve('eslint/package.json')
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'))
  const entry = typeof manifest.bin === 'string' ? manifest.bin : manifest.bin?.eslint
  if (!entry) throw new Error('eslint package.json declares no bin')
  return { command: process.execPath, prefix: [join(dirname(manifestPath), entry)], viaShim: false }
}

function runESLint(cwd, patterns) {
  let cmd
  try {
    cmd = eslintCommand(cwd)
  } catch (error) {
    return {
      ok: false,
      reason:
        `could not resolve ESLint from ${cwd} (${error.message}) — the report runs the ` +
        "project's own ESLint, so install it as a devDependency first"
    }
  }

  const proc = spawnSync(
    cmd.command,
    [...cmd.prefix, ...patterns, '--format', 'json', '--no-error-on-unmatched-pattern'],
    { cwd, encoding: 'utf-8', maxBuffer: 256 * 1024 * 1024 }
  )

  if (proc.error) return { ok: false, reason: proc.error.message }

  // ESLint exits 1 when it finds errors, which is the normal case here — only unparsable
  // output means the run itself failed.
  let results
  try {
    results = JSON.parse(proc.stdout)
  } catch {
    const detail = (proc.stderr || proc.stdout || '').trim().split('\n').slice(0, 6).join('\n')
    return { ok: false, reason: `ESLint produced no JSON report (exit ${proc.status}).\n${detail}` }
  }
  if (!Array.isArray(results)) return { ok: false, reason: 'ESLint JSON report was not an array' }
  return { ok: true, results }
}

/** Aggregate ESLint results into the shape both output formats render. */
export function collect(results, cwd) {
  const byRule = new Map()
  const byFile = new Map()
  const byExtension = new Map()
  const uiFiles = new Set()
  const keys = []

  for (const result of results) {
    const path = relative(cwd, result.filePath) || result.filePath
    const extension = extensionOf(path)
    if (UI_EXTENSIONS.includes(extension)) uiFiles.add(path)

    for (const message of result.messages) {
      const rule = message.ruleId
      if (!rule || !rule.startsWith('webkit/')) continue
      keys.push(`${path}::${rule}`)
      byRule.set(rule, (byRule.get(rule) ?? 0) + 1)
      byExtension.set(extension, (byExtension.get(extension) ?? 0) + 1)
      const entry = byFile.get(path) ?? { count: 0, rules: new Set() }
      entry.count += 1
      entry.rules.add(rule)
      byFile.set(path, entry)
    }
  }

  const dirtyUi = [...byFile.keys()].filter((f) => UI_EXTENSIONS.includes(extensionOf(f)))
  // Share of clean UI files, not of violations: a file counts once however many findings
  // it has, so the number moves when a file is finished.
  const score = uiFiles.size === 0 ? 100 : Math.round((1 - dirtyUi.length / uiFiles.size) * 100)

  return {
    total: keys.length,
    keys,
    filesAffected: byFile.size,
    uiFilesTotal: uiFiles.size,
    uiFilesClean: uiFiles.size - dirtyUi.length,
    score,
    byRule: [...byRule.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])),
    byExtension: [...byExtension.entries()].sort((a, b) => b[1] - a[1]),
    byFile: [...byFile.entries()]
      .map(([file, entry]) => ({ file, count: entry.count, rules: [...entry.rules].sort() }))
      .sort((a, b) => b.count - a.count || a.file.localeCompare(b.file))
  }
}

/** Multiset diff against the baseline — mirrors scripts/check-authoring.mjs exactly. */
export function diffBaseline(currentKeys, baselineKeys) {
  const counts = (list) => {
    const map = new Map()
    for (const key of list) map.set(key, (map.get(key) ?? 0) + 1)
    return map
  }
  const current = counts(currentKeys)
  const base = counts(baselineKeys)

  const introduced = []
  for (const [key, n] of current) {
    const extra = n - (base.get(key) ?? 0)
    for (let i = 0; i < extra; i++) introduced.push(key)
  }
  const fixed = []
  for (const [key, n] of base) {
    const gone = n - (current.get(key) ?? 0)
    for (let i = 0; i < gone; i++) fixed.push(key)
  }
  return { introduced: introduced.sort(), fixed: fixed.sort() }
}

function bare(rule) {
  return rule.replace(/^webkit\//, '')
}

export function renderMarkdown(report, { catalog, diff, baselinePath }) {
  const out = []
  const push = (line = '') => out.push(line)

  push('## Webkit adoption')
  push()

  if (!catalog.available) {
    push(
      '> **The webkit catalog could not be resolved, so the catalog-backed rules did nothing.** ' +
        'This is not a clean bill of health — install `@aziontech/webkit`, or set ' +
        '`WEBKIT_CATALOG_PATH`, and run it again.'
    )
    push()
  }

  push(
    catalog.version
      ? `Measured against \`${catalog.package}@${catalog.version}\`.`
      : `Measured against \`${catalog.package}\` (version unknown).`
  )
  push()
  push('| | |')
  push('|---|---|')
  push(`| Violations | **${report.total}** |`)
  push(`| Files affected | ${report.filesAffected} |`)
  push(
    `| UI files clean | ${report.uiFilesClean} of ${report.uiFilesTotal} — **${report.score}%** |`
  )
  if (diff) {
    push(
      `| New since the baseline | ${diff.introduced.length === 0 ? 'none' : `**${diff.introduced.length}**`} |`
    )
    if (diff.fixed.length) push(`| Fixed since the baseline | ${diff.fixed.length} |`)
  }
  push()

  if (diff && diff.introduced.length) {
    push(`### ${diff.introduced.length} new violation(s) — not in the baseline`)
    push()
    for (const key of diff.introduced) {
      const at = key.lastIndexOf('::')
      push(`- \`${key.slice(0, at)}\` — \`${bare(key.slice(at + 2))}\``)
    }
    push()
  }

  if (diff && diff.fixed.length) {
    push(
      `_${diff.fixed.length} baseline violation(s) no longer present — prune them with ` +
        '`webkit report --update`._'
    )
    push()
  }

  if (report.total === 0) {
    push('No `webkit/*` violations. Read the coverage note before celebrating.')
    push()
  } else {
    push('### By rule')
    push()
    push('| Rule | Count | What it catches |')
    push('|---|---:|---|')
    for (const [rule, count] of report.byRule) {
      push(`| \`${bare(rule)}\` | ${count} | ${RULE_PURPOSE[bare(rule)] ?? '—'} |`)
    }
    push()

    push('### By file')
    push()
    push('| File | Count | Rules |')
    push('|---|---:|---|')
    const shown = report.byFile.slice(0, 15)
    for (const { file, count, rules } of shown) {
      push(`| \`${file}\` | ${count} | ${rules.map((r) => `\`${bare(r)}\``).join(', ')} |`)
    }
    if (report.byFile.length > shown.length) {
      push()
      push(`_${report.byFile.length - shown.length} more file(s) not shown._`)
    }
    push()
  }

  push('### Coverage — what this did and did not look at')
  push()
  const found = report.byExtension.length
    ? report.byExtension.map(([ext, n]) => `\`.${ext || 'no extension'}\` (${n})`).join(', ')
    : 'none'
  push(`- Violations found in: ${found}.`)
  push(
    `- The score counts ${UI_EXTENSIONS.map((e) => `\`.${e}\``).join(' and ')} files only — those are ` +
      'the ones the design system governs.'
  )
  push(
    `- ${TEMPLATE_ONLY_RULES.map((r) => `\`${r}\``).join(', ')} cannot run on \`.astro\`: it needs ` +
      "vue-eslint-parser's template visitor, which astro-eslint-parser does not provide. Restyled " +
      'components inside Astro files are invisible here.'
  )
  push(
    '- Raw HTML where a webkit component exists (`<button>`, `<input>`, a hand-rolled modal) is ' +
      'caught by no rule yet — `prefer-webkit-component` matches imports from a foreign package, ' +
      'not markup.'
  )
  if (baselinePath) push(`- Baseline: \`${baselinePath}\`.`)
  push()

  return out.join('\n') + '\n'
}

/** Returns `{ exitCode, stdout, report }`; the caller writes, so this stays testable. */
export async function runReport(cwd, options = {}) {
  const { format = 'markdown', failOn = 'never', patterns = ['.'], update = false } = options
  const log = options.log ?? (() => {})

  const catalog = loadCatalog(cwd)
  if (!catalog.available) {
    log('WARNING: no webkit catalog resolved — the catalog-backed rules were disabled.')
  }

  log('Linting…')
  const lint = runESLint(cwd, patterns)
  if (!lint.ok) {
    return { exitCode: 1, stdout: '', error: `Could not run ESLint: ${lint.reason}` }
  }
  const report = collect(lint.results, cwd)

  const baselinePath = options.baseline ?? BASELINE_FILE
  const baselineAbs = join(cwd, baselinePath)

  if (update) {
    writeFileSync(baselineAbs, JSON.stringify(report.keys.slice().sort(), null, 2) + '\n')
    log(`${baselinePath} updated: ${report.total} known violation(s) recorded.`)
    return { exitCode: 0, stdout: '', report }
  }

  let diff = null
  if (existsSync(baselineAbs)) {
    try {
      const baseline = JSON.parse(readFileSync(baselineAbs, 'utf-8'))
      if (!Array.isArray(baseline)) throw new Error('expected an array of keys')
      diff = diffBaseline(report.keys, baseline)
    } catch (error) {
      return {
        exitCode: 1,
        stdout: '',
        error: `Could not read ${baselinePath} (${error.message}). Re-snapshot it with \`webkit report --update\`.`
      }
    }
  } else if (failOn === 'new') {
    return {
      exitCode: 1,
      stdout: '',
      error:
        `--fail-on new needs a baseline and ${baselinePath} does not exist. ` +
        'Create it once with `webkit report --update` and commit it.'
    }
  }

  log(
    `${report.total} webkit/* violation(s) in ${report.filesAffected} file(s); adoption ${report.score}%` +
      (diff ? `; ${diff.introduced.length} new since the baseline.` : '.')
  )

  const stdout =
    format === 'json'
      ? JSON.stringify(
          {
            package: catalog.package,
            webkitVersion: catalog.version,
            catalogAvailable: catalog.available,
            total: report.total,
            filesAffected: report.filesAffected,
            uiFilesTotal: report.uiFilesTotal,
            uiFilesClean: report.uiFilesClean,
            score: report.score,
            byRule: Object.fromEntries(report.byRule),
            byFile: report.byFile,
            introduced: diff?.introduced ?? null,
            fixed: diff?.fixed ?? null
          },
          null,
          2
        ) + '\n'
      : renderMarkdown(report, {
          catalog,
          diff,
          baselinePath: existsSync(baselineAbs) ? baselinePath : null
        })

  let exitCode = 0
  if (failOn === 'any' && report.total > 0) exitCode = 1
  if (failOn === 'new' && diff && diff.introduced.length > 0) exitCode = 1

  return { exitCode, stdout, report, diff }
}
