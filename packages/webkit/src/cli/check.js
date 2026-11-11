import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

import { physicalDirectionClasses } from '../eslint-plugin/direction-classes.js'
import { blockDrift } from './blocks.js'
import { planDoctor } from './doctor.js'
import { loadMigration, migrateSource } from './migrate.js'
import { ESLINT_CONFIG_CANDIDATES, firstExisting } from './plan.js'
import { resolveEslintBin, runESLint } from './report.js'
import { PACKAGE_NAME } from './source.js'

const SOURCE_EXT = /\.(vue|ts|tsx|js|jsx|mjs|cjs)$/
const SKIP_DIRS = new Set([
  'node_modules',
  'dist',
  '.git',
  '.nuxt',
  '.output',
  'coverage',
  'public'
])
const SUBPATH = /['"`]@aziontech\/webkit\/([^'"`\s]+)['"`]/g
const CLASS_ATTR = /\bclass\s*=\s*"([^"]*)"/g
const STYLE_BLOCK = /<style\b[^>]*>([\s\S]*?)<\/style>/g
const STYLE_ATTR = /\bstyle\s*=\s*"([^"]*)"/g
const HEX = /#[0-9a-fA-F]{3,8}\b/
const PALETTE =
  /\b(?:bg|text|border|ring|outline|fill|stroke|divide|placeholder|caret|accent)-(?:gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/

const toPosix = (p) => p.split(sep).join('/')

function sourceFiles(dir, out = []) {
  let names = []
  try {
    names = readdirSync(dir)
  } catch {
    return out
  }
  for (const name of names) {
    if (SKIP_DIRS.has(name) || name.startsWith('.')) continue
    const p = join(dir, name)
    const s = statSync(p)
    if (s.isDirectory()) sourceFiles(p, out)
    else if (SOURCE_EXT.test(name)) out.push(p)
  }
  return out
}

function lineOf(text, index) {
  let line = 1
  for (let i = 0; i < index; i++) if (text.charCodeAt(i) === 10) line++
  return line
}

function migrationFindings(rel, source, migration) {
  const { changes, warnings } = migrateSource(source, migration)
  return [
    ...(changes.length
      ? [
          {
            source: 'migration',
            severity: 'error',
            file: rel,
            message: `v5 names: ${changes.join('; ')} — run \`npx ${PACKAGE_NAME} migrate v6\`.`
          }
        ]
      : []),
    ...warnings
      .filter((w) => !/is not an export of v\d/.test(w))
      .map((w) => ({
        source: 'migration',
        severity: 'error',
        file: rel,
        message: `v5 API to replace by hand: ${w} (MIGRATION-v6.md).`
      }))
  ]
}

function importFindings(rel, source, exportsSet, renamed) {
  const out = []
  for (const m of source.matchAll(SUBPATH)) {
    const sub = m[1]
    if (exportsSet.has(sub) || renamed.has(sub)) continue
    out.push({
      source: 'imports',
      severity: 'error',
      file: rel,
      line: lineOf(source, m.index),
      message: `${PACKAGE_NAME}/${sub} is not exported by the installed ${PACKAGE_NAME}: look it up with \`npx ${PACKAGE_NAME} search ${sub.split('/').pop()}\`.`
    })
  }
  return out
}

function styleFindings(rel, source) {
  if (!rel.endsWith('.vue')) return []
  const out = []
  for (const m of source.matchAll(CLASS_ATTR)) {
    const line = lineOf(source, m.index)
    for (const hit of physicalDirectionClasses(m[1])) {
      out.push({
        source: 'style',
        severity: 'error',
        file: rel,
        line,
        rule: 'no-physical-direction',
        message: `physical direction utility "${hit.cls}" does not mirror under RTL: use "${hit.fix}".`
      })
    }
    const palette = m[1].match(PALETTE)
    const hex = m[1].match(HEX)
    if (palette || hex) {
      out.push({
        source: 'style',
        severity: 'error',
        file: rel,
        line,
        rule: 'no-hardcoded-color',
        message: `hardcoded colour "${(palette || hex)[0]}": use a semantic token class.`
      })
    }
  }
  for (const re of [STYLE_ATTR, STYLE_BLOCK]) {
    for (const m of source.matchAll(re)) {
      const hex = m[1].match(HEX)
      if (!hex) continue
      out.push({
        source: 'style',
        severity: 'error',
        file: rel,
        line: lineOf(source, m.index + m[0].indexOf(hex[0])),
        rule: 'no-hardcoded-color',
        message: `hardcoded colour "${hex[0]}": use var(--…) semantic tokens.`
      })
    }
  }
  return out
}

function lintFindings(projectDir) {
  const config = firstExisting(projectDir, ESLINT_CONFIG_CANDIDATES)
  if (!config) return { ran: false, reason: 'no ESLint config', findings: [] }
  try {
    resolveEslintBin(projectDir)
  } catch {
    return { ran: false, reason: 'ESLint is not installed', findings: [] }
  }
  const lint = runESLint(projectDir, [existsSync(join(projectDir, 'src')) ? 'src' : '.'])
  if (!lint.ok) return { ran: false, reason: lint.reason.split('\n')[0], findings: [] }
  const findings = []
  for (const result of lint.results) {
    const rel = toPosix(relative(projectDir, result.filePath))
    for (const message of result.messages) {
      if (!message.ruleId?.startsWith('webkit/')) continue
      findings.push({
        source: 'lint',
        severity: 'error',
        file: rel,
        line: message.line,
        rule: message.ruleId,
        message: message.message
      })
    }
  }
  return { ran: true, findings }
}

export function runCheck(projectDir, webkit, { lint = true } = {}) {
  const findings = []

  for (const c of planDoctor(projectDir)) {
    if (c.status === 'ok') continue
    findings.push({
      source: 'doctor',
      severity: c.status === 'fail' ? 'error' : 'warn',
      check: c.check,
      message: c.detail
    })
  }

  const migration = loadMigration(6)
  const renamed = new Set([...Object.keys(migration.components), ...Object.keys(migration.removed)])
  const files = sourceFiles(projectDir)
  const linted = lint ? lintFindings(projectDir) : { ran: false, reason: '--no-lint', findings: [] }

  for (const file of files) {
    const rel = toPosix(relative(projectDir, file))
    const source = readFileSync(file, 'utf8')
    if (!source.includes('@aziontech/webkit') && !rel.endsWith('.vue')) continue
    findings.push(...migrationFindings(rel, source, migration))
    findings.push(...importFindings(rel, source, webkit.exports, renamed))
    if (!linted.ran) findings.push(...styleFindings(rel, source))
  }

  findings.push(...linted.findings)
  if (!linted.ran) {
    findings.push({
      source: 'lint',
      severity: 'warn',
      message: `ESLint did not run (${linted.reason}): only the built-in colour and direction scan covered the templates. Run \`npx ${PACKAGE_NAME} init\` to wire the full rule set.`
    })
  }

  for (const f of blockDrift(projectDir, webkit)) findings.push({ source: 'blocks', ...f })

  const errors = findings.filter((f) => f.severity === 'error').length
  const warnings = findings.length - errors
  return {
    package: PACKAGE_NAME,
    version: webkit.version,
    installed: webkit.installed,
    eslint: linted.ran,
    scanned: files.length,
    errors,
    warnings,
    findings
  }
}

export function exitCodeFor(result, maxWarnings) {
  if (result.errors > 0) return 1
  if (maxWarnings != null && maxWarnings >= 0 && result.warnings > maxWarnings) return 1
  return 0
}

export function formatCheck(result, maxWarnings) {
  const out = [`@aziontech/webkit check — ${PACKAGE_NAME}@${result.version}`, '']
  const order = ['doctor', 'migration', 'imports', 'lint', 'style', 'blocks']
  for (const source of order) {
    const group = result.findings.filter((f) => f.source === source)
    if (!group.length) continue
    out.push(`[${source}]`)
    for (const f of group) {
      const where = f.check || (f.file ? `${f.file}${f.line ? `:${f.line}` : ''}` : '')
      const [head, ...rest] = f.message.split('\n')
      out.push(`${f.severity === 'error' ? 'ERROR' : 'WARN '} ${where ? `${where} — ` : ''}${head}`)
      for (const line of rest) out.push(`      ${line}`)
    }
    out.push('')
  }
  const limit = maxWarnings != null && maxWarnings >= 0 ? ` (max ${maxWarnings})` : ''
  out.push(
    `${result.errors} error(s), ${result.warnings} warning(s)${limit} in ${result.scanned} source file(s).`,
    ''
  )
  return out.join('\n')
}
