import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, relative } from 'node:path'

import { loadCatalog } from '../eslint-plugin/lib/catalog.js'
import { renderMarkdown, UI_EXTENSIONS } from './report-markdown.js'

export const FORMATS = new Set(['markdown', 'json'])
export const FAIL_MODES = new Set(['never', 'any'])

function extensionOf(path) {
  const base = path.slice(path.lastIndexOf('/') + 1)
  const dot = base.lastIndexOf('.')
  return dot === -1 ? '' : base.slice(dot + 1)
}

export function resolvePackageBin(cwd, name) {
  const shim = join(
    cwd,
    'node_modules',
    '.bin',
    process.platform === 'win32' ? `${name}.cmd` : name
  )
  if (existsSync(shim)) return { command: shim, prefix: [] }

  const require = createRequire(join(cwd, '__webkit_report__.js'))
  const manifestPath = require.resolve(`${name}/package.json`)
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'))
  const entry = typeof manifest.bin === 'string' ? manifest.bin : manifest.bin?.[name]
  if (!entry) throw new Error(`${name} package.json declares no bin`)
  return { command: process.execPath, prefix: [join(dirname(manifestPath), entry)] }
}

export function resolveEslintBin(cwd) {
  return resolvePackageBin(cwd, 'eslint')
}

export function runESLint(cwd, patterns) {
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

function tally(state, path, extension, rule) {
  state.keys.push(`${path}::${rule}`)
  state.byRule.set(rule, (state.byRule.get(rule) ?? 0) + 1)
  state.byExtension.set(extension, (state.byExtension.get(extension) ?? 0) + 1)
  const entry = state.byFile.get(path) ?? { count: 0, rules: new Set() }
  entry.count += 1
  entry.rules.add(rule)
  state.byFile.set(path, entry)
}

function collectResult(state, result, cwd) {
  const path = relative(cwd, result.filePath) || result.filePath
  const extension = extensionOf(path)
  const isUiFile = UI_EXTENSIONS.includes(extension)
  if (isUiFile) state.uiFiles.add(path)
  for (const message of result.messages) {
    if (message.fatal || !message.ruleId) {
      if (message.fatal && isUiFile) state.fatalFiles.add(path)
      continue
    }
    if (message.ruleId.startsWith('webkit/')) tally(state, path, extension, message.ruleId)
  }
}

function summarizeCollected(state) {
  const { byRule, byFile, byExtension, uiFiles, fatalFiles, keys } = state
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

export function collect(results, cwd) {
  const state = {
    byRule: new Map(),
    byFile: new Map(),
    byExtension: new Map(),
    uiFiles: new Set(),
    fatalFiles: new Set(),
    keys: []
  }
  for (const result of results) collectResult(state, result, cwd)
  if (state.uiFiles.size === 0) {
    throw new Error('measured nothing: no .vue/.astro file reached ESLint')
  }
  return summarizeCollected(state)
}

function renderJson(report, catalog) {
  const body = {
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
  }
  return JSON.stringify(body, null, 2) + '\n'
}

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
    format === 'json' ? renderJson(report, catalog) : renderMarkdown(report, { catalog })

  const exitCode = failOn === 'any' && report.total > 0 ? 1 : 0
  return { exitCode, stdout, report }
}

export { renderMarkdown }
