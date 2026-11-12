import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

import stylelintConfig from '../stylelint-config.js'
import { firstExisting, STYLELINT_CONFIG_CANDIDATES } from './plan.js'
import { resolvePackageBin } from './report.js'

const STYLE_EXT = /\.(css|scss|vue)$/
const SKIP_DIRS = new Set([
  'node_modules',
  'dist',
  '.git',
  '.nuxt',
  '.output',
  'coverage',
  'public'
])
const STYLE_BLOCK = /(<style\b[^>]*>)([\s\S]*?)<\/style>/g
const STYLE_ATTR = /(\sstyle\s*=\s*")([^"]*)"/g
const COMMENT = /\/\*[\s\S]*?\*\//g
const LINE_COMMENT = /(^|[^:])\/\/[^\n]*/g
const DECLARATION = /(^|[;{\s])(--[\w-]+|-?[a-zA-Z][\w-]*)\s*:\s*([^;{}]*?)\s*(?=;|}|$)/g
const HEX = /#[0-9a-fA-F]{3,8}\b/
const ZERO_WITH_UNIT =
  /(^|[\s,(])[-+]?0*\.?0+(px|rem|em|ex|ch|vw|vh|vmin|vmax|vi|vb|svh|lvh|dvh|svw|lvw|dvw|cqw|cqh|cqi|cqb|cqmin|cqmax|cm|mm|q|in|pt|pc)\b/i
const MATH_FUNCTION = /\b(calc|min|max|clamp)\(/i

const toPosix = (p) => p.split(sep).join('/')

export const STYLELINT_PATTERN = '**/*.{css,scss,vue}'

export function stylelintRoot(projectDir) {
  return existsSync(join(projectDir, 'src')) ? 'src' : '.'
}

function pattern(projectDir) {
  const root = stylelintRoot(projectDir)
  return root === '.' ? STYLELINT_PATTERN : `${root}/${STYLELINT_PATTERN}`
}

export function hasStylelintConfig(projectDir) {
  if (firstExisting(projectDir, STYLELINT_CONFIG_CANDIDATES)) return true
  try {
    return Boolean(JSON.parse(readFileSync(join(projectDir, 'package.json'), 'utf8')).stylelint)
  } catch {
    return false
  }
}

function parseReport(text) {
  try {
    const parsed = JSON.parse(text)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

const stripRuleSuffix = (text, rule) =>
  rule && text.endsWith(` (${rule})`) ? text.slice(0, -rule.length - 3) : text

export function stylelintFindings(projectDir) {
  if (!hasStylelintConfig(projectDir)) {
    return { ran: false, reason: 'no Stylelint config', findings: [] }
  }
  let cmd
  try {
    cmd = resolvePackageBin(projectDir, 'stylelint')
  } catch {
    return { ran: false, reason: 'Stylelint is not installed', findings: [] }
  }
  const proc = spawnSync(
    cmd.command,
    [...cmd.prefix, pattern(projectDir), '--allow-empty-input', '--formatter', 'json'],
    { cwd: projectDir, encoding: 'utf-8', maxBuffer: 256 * 1024 * 1024 }
  )
  if (proc.error) return { ran: false, reason: proc.error.message, findings: [] }
  const results = parseReport(proc.stdout) ?? parseReport(proc.stderr)
  if (!results) {
    const detail = (proc.stderr || proc.stdout || '').trim().split('\n')[0]
    return {
      ran: false,
      reason: `Stylelint produced no JSON report (exit ${proc.status})${detail ? `: ${detail}` : ''}`,
      findings: []
    }
  }
  const findings = []
  for (const result of results) {
    const file = toPosix(relative(projectDir, result.source))
    for (const w of result.warnings || []) {
      findings.push({
        source: 'stylelint',
        severity: w.severity === 'error' ? 'error' : 'warn',
        file,
        line: w.line,
        rule: w.rule,
        message: stripRuleSuffix(w.text, w.rule)
      })
    }
    for (const w of result.invalidOptionWarnings || []) {
      findings.push({ source: 'stylelint', severity: 'error', file, message: w.text })
    }
  }
  return { ran: true, findings }
}

function styleFiles(dir, out = []) {
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
    if (s.isDirectory()) styleFiles(p, out)
    else if (STYLE_EXT.test(name)) out.push(p)
  }
  return out
}

function lineOf(text, index) {
  let line = 1
  for (let i = 0; i < index; i++) if (text.charCodeAt(i) === 10) line++
  return line
}

function blank(text) {
  return text.replace(/[^\n]/g, ' ')
}

function chunks(rel, source) {
  if (!rel.endsWith('.vue')) return [{ offset: 0, css: source }]
  const out = []
  for (const m of source.matchAll(STYLE_BLOCK)) {
    out.push({ offset: m.index + m[1].length, css: m[2] })
  }
  const template = source.replace(STYLE_BLOCK, (all) => blank(all))
  for (const m of template.matchAll(STYLE_ATTR)) {
    out.push({ offset: m.index + m[1].length, css: m[2] })
  }
  return out
}

function toRegExp(pattern) {
  const m = /^\/(.*)\/([a-z]*)$/s.exec(pattern)
  return m ? new RegExp(m[1], m[2]) : new RegExp(`^${pattern}$`)
}

function messageOf(rule) {
  const options = Array.isArray(rule) ? rule[1] : null
  return options?.message
}

const RULES = stylelintConfig.rules
const DISALLOWED_FUNCTIONS = new RegExp(
  `\\b(${RULES['function-disallowed-list'][0].join('|')})\\(`,
  'i'
)
const DISALLOWED_VALUES = Object.entries(
  RULES['declaration-property-value-disallowed-list'][0]
).map(([prop, values]) => ({ prop: toRegExp(prop), values: values.map(toRegExp) }))
const DISALLOWED_VALUES_MESSAGE = messageOf(RULES['declaration-property-value-disallowed-list'])

function declarationFindings(prop, value) {
  const out = []
  const property = prop.toLowerCase()
  if (HEX.test(value)) {
    out.push({ rule: 'color-no-hex', message: messageOf(RULES['color-no-hex']) })
  }
  if (DISALLOWED_FUNCTIONS.test(value)) {
    out.push({
      rule: 'function-disallowed-list',
      message: messageOf(RULES['function-disallowed-list'])
    })
  }
  if (DISALLOWED_VALUES.some((d) => d.prop.test(property) && d.values.some((v) => v.test(value)))) {
    out.push({
      rule: 'declaration-property-value-disallowed-list',
      message:
        typeof DISALLOWED_VALUES_MESSAGE === 'function'
          ? DISALLOWED_VALUES_MESSAGE(property, value)
          : DISALLOWED_VALUES_MESSAGE
    })
  }
  if (!MATH_FUNCTION.test(value) && ZERO_WITH_UNIT.test(value)) {
    out.push({ rule: 'length-zero-no-unit', message: messageOf(RULES['length-zero-no-unit']) })
  }
  return out
}

export function cssScanFindings(projectDir) {
  const root = stylelintRoot(projectDir)
  const files = styleFiles(root === '.' ? projectDir : join(projectDir, root))
  const findings = []
  for (const file of files) {
    const rel = toPosix(relative(projectDir, file))
    const source = readFileSync(file, 'utf8')
    for (const { offset, css } of chunks(rel, source)) {
      let clean = css.replace(COMMENT, (c) => blank(c))
      if (!rel.endsWith('.css')) {
        clean = clean.replace(LINE_COMMENT, (c, lead) => lead + blank(c.slice(lead.length)))
      }
      for (const m of clean.matchAll(DECLARATION)) {
        const at = offset + m.index + m[1].length
        for (const hit of declarationFindings(m[2], m[3])) {
          findings.push({
            source: 'css',
            severity: 'error',
            file: rel,
            line: lineOf(source, at),
            rule: hit.rule,
            message: `${hit.message} (\`${m[2]}: ${m[3]}\`)`
          })
        }
      }
    }
  }
  return { files: files.length, findings }
}
