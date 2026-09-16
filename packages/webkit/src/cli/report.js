// `webkit report` — measures how much of a consumer's UI is actually the design system.
//
// Runs the project's own ESLint, keeps only `webkit/*` results, and writes Markdown to
// stdout so a CI step can redirect it into a run summary. Why it spawns the installed
// `.bin/eslint` shim and not the ESLint Node API: docs/toolkit/report.md § Why the shim.

import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, relative } from 'node:path'

import { loadCatalog } from '../eslint-plugin/catalog.js'

/** Extensions the design system governs — the denominator of the adoption score. */
export const UI_EXTENSIONS = ['vue', 'astro']

/** What each rule catches, keyed by the bare name so a namespace change cannot break it. */
export const RULE_PURPOSE = {
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

export const FORMATS = new Set(['markdown', 'json'])
export const FAIL_MODES = new Set(['never', 'any'])

function extensionOf(path) {
  const base = path.slice(path.lastIndexOf('/') + 1)
  const dot = base.lastIndexOf('.')
  return dot === -1 ? '' : base.slice(dot + 1)
}

/**
 * Resolve the consumer's own ESLint entry point. Always the `node_modules/.bin/eslint`
 * shim when present: under pnpm, both `new ESLint().lintFiles()` and
 * `node node_modules/.../eslint/bin/eslint.js` return a fatal parse error for every
 * `.astro` file (0 findings, silently) — pnpm's shim exports `NODE_PATH` before exec'ing
 * node, which `astro-eslint-parser` needs to resolve; without it ESLint falls back to the
 * default parser. Falls back to resolving `eslint/package.json`'s own `bin` entry only
 * when the shim is missing (unusual install layout).
 */
export function resolveEslintBin(cwd) {
  const shim = join(
    cwd,
    'node_modules',
    '.bin',
    process.platform === 'win32' ? 'eslint.cmd' : 'eslint'
  )
  if (existsSync(shim)) return { command: shim, prefix: [] }

  const require = createRequire(join(cwd, '__webkit_report__.js'))
  const manifestPath = require.resolve('eslint/package.json')
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'))
  const entry = typeof manifest.bin === 'string' ? manifest.bin : manifest.bin?.eslint
  if (!entry) throw new Error('eslint package.json declares no bin')
  return { command: process.execPath, prefix: [join(dirname(manifestPath), entry)] }
}

function runESLint(cwd, patterns) {
  let cmd
  try {
    cmd = resolveEslintBin(cwd)
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

/**
 * Aggregate raw ESLint JSON results into the report shape. Pure — no I/O.
 *
 * The score counts CLEAN FILES, not violations: a file with twenty findings weighs the
 * same as a file with one, so the number moves when a file is finished, not when the
 * cheapest findings across the repo are cleared (same shape as console-kit's architecture
 * report). `keys` is a flat `"<relpath>::<rule>"` list, one entry per occurrence, so a
 * future `--baseline`/`--fail-on new` can diff it as a multiset without changing the shape.
 */
export function collect(results, cwd) {
  const byRule = new Map()
  const byFile = new Map()
  const byExtension = new Map()
  const uiFiles = new Set()
  const fatalFiles = new Set()
  const keys = []

  for (const result of results) {
    const path = relative(cwd, result.filePath) || result.filePath
    const extension = extensionOf(path)
    const isUiFile = UI_EXTENSIONS.includes(extension)
    if (isUiFile) uiFiles.add(path)

    for (const message of result.messages) {
      if (message.fatal || !message.ruleId) {
        // A fatal parse error means the rules never ran on this file — count it as a
        // blind spot, never as a webkit/* finding.
        if (message.fatal && isUiFile) fatalFiles.add(path)
        continue
      }
      const rule = message.ruleId
      if (!rule.startsWith('webkit/')) continue
      keys.push(`${path}::${rule}`)
      byRule.set(rule, (byRule.get(rule) ?? 0) + 1)
      byExtension.set(extension, (byExtension.get(extension) ?? 0) + 1)
      const entry = byFile.get(path) ?? { count: 0, rules: new Set() }
      entry.count += 1
      entry.rules.add(rule)
      byFile.set(path, entry)
    }
  }

  if (uiFiles.size === 0) {
    throw new Error('measured nothing: no .vue/.astro file reached ESLint')
  }

  // A UI file is "clean" iff it has no fatal parse error AND no webkit/* finding — a file
  // we could not actually check is a blind spot, not evidence of adoption.
  const dirtyUi = new Set([...byFile.keys(), ...fatalFiles].filter((f) => uiFiles.has(f)))
  const uiFilesClean = uiFiles.size - dirtyUi.size
  const score = Math.round((uiFilesClean / uiFiles.size) * 100)

  return {
    total: keys.length,
    keys,
    filesAffected: byFile.size,
    uiFilesTotal: uiFiles.size,
    uiFilesClean,
    score,
    fatalFiles: [...fatalFiles].sort(),
    byRule: [...byRule.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])),
    byExtension: [...byExtension.entries()].sort((a, b) => b[1] - a[1]),
    byFile: [...byFile.entries()]
      .map(([file, entry]) => ({ file, count: entry.count, rules: [...entry.rules].sort() }))
      .sort((a, b) => b.count - a.count || a.file.localeCompare(b.file))
  }
}

function bare(rule) {
  return rule.replace(/^webkit\//, '')
}

export function renderMarkdown(report, { catalog }) {
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
  push()

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
  if (report.fatalFiles.length) {
    push(
      `- ${report.fatalFiles.length} file(s) had a fatal parse error and were not checked at all: ` +
        report.fatalFiles.map((f) => `\`${f}\``).join(', ') +
        '.'
    )
  }
  push()

  return out.join('\n') + '\n'
}

/**
 * Runs the consumer's own ESLint and returns `{exitCode, stdout, error?, report?}`; the
 * caller writes stdout/stderr, so this stays testable without touching real streams.
 */
export function runReport(cwd, options = {}) {
  const { format = 'markdown', failOn = 'never', patterns = ['.'] } = options
  const log = options.log ?? (() => {})

  const catalog = loadCatalog(cwd)
  if (!catalog.available) {
    log('WARNING: no webkit catalog resolved — the catalog-backed rules were disabled.')
  }

  log('Linting…')
  const lint = runESLint(cwd, patterns)
  if (!lint.ok) {
    return { exitCode: 2, stdout: '', error: `Could not run ESLint: ${lint.reason}` }
  }

  let report
  try {
    report = collect(lint.results, cwd)
  } catch (error) {
    return { exitCode: 2, stdout: '', error: error.message }
  }

  log(
    `${report.total} webkit/* violation(s) in ${report.filesAffected} file(s); adoption ${report.score}%.`
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
            fatalFiles: report.fatalFiles,
            byRule: Object.fromEntries(report.byRule),
            byFile: report.byFile,
            keys: report.keys
          },
          null,
          2
        ) + '\n'
      : renderMarkdown(report, { catalog })

  const exitCode = failOn === 'any' && report.total > 0 ? 1 : 0
  return { exitCode, stdout, report }
}
