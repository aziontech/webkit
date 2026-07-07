// Shared library for spec parsing and validation.
// Used by enforce-spec-exists.mjs (Pre) and validate-spec-compliance.mjs (Post).
// No external deps — Node built-ins only.

import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { COMPONENT_CATEGORIES } from '../component-categories.mjs'

export const STRUCTURES = ['monolithic', 'composition']
export const STATUSES = ['draft', 'approved', 'implemented', 'locked']
export const KEBAB_RE = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/

// ---- Frontmatter ----

/** Split a spec file into { frontmatter (object), body (string) }. */
export function parseSpecFile(filePath) {
  const raw = readFileSync(filePath, 'utf-8')
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { frontmatter: null, body: raw, error: 'no frontmatter' }
  const [, fmText, body] = match
  const frontmatter = parseYamlFrontmatter(fmText)
  return { frontmatter, body }
}

/** Minimal YAML parser — only what _schema.json needs (strings, integers, dates, nested figma object). */
export function parseYamlFrontmatter(text) {
  const out = {}
  let currentKey = null
  for (const line of text.split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue
    const nested = line.match(/^  ([a-z_]+):\s*(.*)$/i)
    if (nested && currentKey) {
      const [, k, v] = nested
      out[currentKey][k] = unquote(v)
      continue
    }
    const top = line.match(/^([a-z_]+):\s*(.*)$/i)
    if (!top) continue
    const [, key, val] = top
    if (val.trim() === '') {
      out[key] = {}
      currentKey = key
    } else {
      out[key] = coerce(unquote(val))
      currentKey = null
    }
  }
  return out
}

function unquote(s) {
  s = s.trim()
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1)
  }
  return s
}

function coerce(v) {
  if (typeof v !== 'string') return v
  if (/^-?\d+$/.test(v)) return parseInt(v, 10)
  if (/^true$/i.test(v)) return true
  if (/^false$/i.test(v)) return false
  return v
}

// ---- Schema validation (hand-rolled, mirrors .specs/_schema.json) ----

export function validateFrontmatter(fm) {
  const errors = []
  if (!fm) return ['frontmatter missing or unparseable']
  if (!fm.name || !KEBAB_RE.test(fm.name)) errors.push('name: must be kebab-case')
  if (!COMPONENT_CATEGORIES.includes(fm.category)) errors.push(`category: must be one of ${COMPONENT_CATEGORIES.join('|')}`)
  if (!STRUCTURES.includes(fm.structure)) errors.push(`structure: must be one of ${STRUCTURES.join('|')}`)
  if (!STATUSES.includes(fm.status)) errors.push(`status: must be one of ${STATUSES.join('|')}`)
  if (typeof fm.spec_version !== 'number' || fm.spec_version < 1) errors.push('spec_version: must be integer >= 1')
  if (!isIsoDate(fm.created)) errors.push('created: must be YYYY-MM-DD')
  if (!isIsoDate(fm.last_updated)) errors.push('last_updated: must be YYYY-MM-DD')
  if (['approved', 'implemented', 'locked'].includes(fm.status)) {
    if (!/^[a-f0-9]{64}$/.test(fm.checksum ?? '')) {
      errors.push(`checksum: must be sha256 (64 hex) when status is ${fm.status}`)
    }
  }
  if (fm.figma && typeof fm.figma === 'object') {
    if (fm.figma.url && !/^https:\/\/(www\.)?figma\.com\//.test(fm.figma.url)) {
      errors.push('figma.url: must be a figma.com URL')
    }
    if (fm.figma.node_id && !/^[0-9]+[:-][0-9]+$/.test(fm.figma.node_id)) {
      errors.push('figma.node_id: must match <num>:<num>')
    }
  }
  return errors
}

function isIsoDate(v) {
  return typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)
}

// ---- Body parsing ----

/** Pull a level-2 section's content by exact heading text. Returns the section's lines (without the heading). */
export function getSection(body, headingText) {
  const lines = body.split('\n')
  const headRe = new RegExp(`^##\\s+${escapeRegex(headingText)}\\s*$`)
  let start = -1
  for (let i = 0; i < lines.length; i++) {
    if (headRe.test(lines[i])) {
      start = i + 1
      break
    }
  }
  if (start === -1) return null
  let end = lines.length
  for (let i = start; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i])) {
      end = i
      break
    }
  }
  return lines.slice(start, end).join('\n').trim()
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Parse a Markdown table into an array of { col: value }. Skips empty rows and the alignment separator. */
export function parseTable(sectionText) {
  if (!sectionText) return []
  const lines = sectionText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('|'))
  if (lines.length < 2) return []
  const headers = splitRow(lines[0]).map((h) => h.toLowerCase())
  const rows = []
  for (let i = 2; i < lines.length; i++) {
    const cells = splitRow(lines[i])
    if (cells.every((c) => !c)) continue
    const row = {}
    headers.forEach((h, idx) => {
      row[h] = (cells[idx] ?? '').trim()
    })
    rows.push(row)
  }
  return rows
}

function splitRow(line) {
  // Strip leading/trailing pipes, then split on unescaped pipes.
  const trimmed = line.replace(/^\||\|$/g, '')
  return trimmed.split(/\s*\|\s*/).map((c) => c.trim())
}

/**
 * Like parseTable, but tolerant of a union type cell containing unescaped `|`
 * (e.g. `'a' | 'b' | 'c'`). Extra cells are absorbed into `overflowHeader`'s column so
 * the columns AFTER it (Default, Required, JSDoc) keep their positions. Needed to read
 * the Default column reliably. Mirrors build-catalog.mjs's parseSpecTable.
 */
export function parseTable2(sectionText, overflowHeader) {
  if (!sectionText) return []
  const lines = sectionText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('|'))
  if (lines.length < 2) return []
  const headers = splitRow(lines[0]).map((h) => h.toLowerCase())
  const n = headers.length
  const oIdx = headers.indexOf(overflowHeader)
  const rows = []
  for (let i = 2; i < lines.length; i++) {
    let cells = splitRow(lines[i])
    if (cells.every((c) => !c)) continue
    if (cells.length > n && oIdx >= 0) {
      const tailCount = n - 1 - oIdx
      const before = cells.slice(0, oIdx)
      const tail = tailCount > 0 ? cells.slice(cells.length - tailCount) : []
      const mid = cells.slice(oIdx, cells.length - tailCount).join(' | ')
      cells = [...before, mid, ...tail]
    }
    const row = {}
    headers.forEach((h, idx) => {
      row[h] = (cells[idx] ?? '').trim()
    })
    rows.push(row)
  }
  return rows
}

/**
 * True when a Props-table Default cell is the STRING LITERAL 'undefined' or 'null'
 * (the quoted text, not the JS value `undefined`). The cell text may be wrapped in
 * backticks, e.g. "`'undefined'`". Used by spec-validate to reject the empty-string
 * default anti-pattern. Legitimate unquoted `undefined` (e.g. `open`, `modelValue`,
 * `src`) does NOT match and stays valid.
 */
export function defaultCellIsStringUndefined(cell) {
  if (!cell) return false
  const inner = String(cell).trim().replace(/^`|`$/g, '').trim()
  return /^'(undefined|null)'$/.test(inner)
}

// ---- Checksum ----

export function sha256(text) {
  return createHash('sha256').update(text).digest('hex')
}

/** sha256 of the body normalized to LF endings. */
export function bodyChecksum(body) {
  return sha256(body.replace(/\r\n/g, '\n'))
}

// ---- Constraints block ----

const CANONICAL_CONSTRAINTS = [
  'Do not add props beyond the Props table',
  'Do not add events beyond the Events table',
  'Do not invent imports',
  'HEX/RGB/HSL',
  'positioning/animation lib',
  'improvise animations',
  'class presets in JavaScript',
  'inherit artifacts as-is',
  'Figma references to Storybook stories',
  'argTypesRegex',
  'DESIGN.md',
  'COMPONENT_REQUIREMENTS',
  '`structure`',
  'Do not create files outside the paths declared by your task',
  'BLOCKED'
]

export function constraintsBlockHasCanonicalBullets(body) {
  const section = getSection(body, 'Constraints — DO NOT')
  if (!section) return { ok: false, missing: ['section absent'] }
  const missing = []
  for (const phrase of CANONICAL_CONSTRAINTS) {
    if (!section.includes(phrase)) missing.push(phrase)
  }
  return { ok: missing.length === 0, missing }
}

// ---- Spec lookup from a .vue path ----

/**
 * Given an absolute path to a component .vue file under
 * packages/webkit/src/components/<category>/<name>/<file>.vue,
 * return { category, name, specPath }. Returns null if the path doesn't match.
 */
export function resolveSpecForComponentPath(filePath, repoRoot) {
  const rel = filePath.startsWith(repoRoot) ? filePath.slice(repoRoot.length + 1) : filePath
  const m = rel.match(/^packages\/webkit\/src\/components\/([^/]+)\/([^/]+)\/[^/]+\.vue$/)
  if (!m) return null
  const [, category, name] = m
  if (!COMPONENT_CATEGORIES.includes(category)) return null
  const specPath = resolve(repoRoot, '.specs', `${name}.md`)
  return { category, name, specPath }
}

// ---- Legacy whitelist ----

export function isLegacyComponent(category, name, repoRoot) {
  const path = resolve(repoRoot, '.claude/hooks/_lib/legacy-components.json')
  if (!existsSync(path)) return false
  try {
    const list = JSON.parse(readFileSync(path, 'utf-8'))
    return list.some((c) => c.category === category && c.name === name)
  } catch {
    return false
  }
}

// ---- .vue parsing (defineProps / defineEmits / defineSlots / defineOptions) ----

/**
 * Light parser: extracts the script setup block, then runs targeted regexes.
 * Good enough for the spec-compliance check; not a real Vue parser.
 */
export function parseVueSfc(vueText) {
  const script = extractScriptSetup(vueText)
  if (!script) return { defineOptionsName: null, props: [], emits: [], slots: [], hasInjectionKey: false, raw: '' }
  return {
    defineOptionsName: extractDefineOptionsName(script),
    props: extractProps(script),
    emits: extractEmits(script),
    slots: extractSlots(script),
    defaults: extractDefaults(script),
    hasInjectionKey: /InjectionKey\b/.test(script) && /\bprovide\(/.test(script),
    raw: script
  }
}

function extractScriptSetup(text) {
  const m = text.match(/<script\s+setup[^>]*>([\s\S]*?)<\/script>/)
  return m ? m[1] : null
}

function extractDefineOptionsName(script) {
  const m = script.match(/defineOptions\(\s*\{[^}]*name:\s*['"]([^'"]+)['"]/)
  return m ? m[1] : null
}

/** Extract the inner text of a `{ ... }` block immediately after `pattern` matches. */
function extractBracedBlockAfter(script, pattern) {
  const m = script.match(pattern)
  if (!m) return null
  const braceStart = m.index + m[0].length - 1
  if (script[braceStart] !== '{') return null
  let depth = 1
  for (let i = braceStart + 1; i < script.length; i++) {
    if (script[i] === '{') depth++
    else if (script[i] === '}') {
      depth--
      if (depth === 0) return script.slice(braceStart + 1, i)
    }
  }
  return null
}

function extractProps(script) {
  // Match `interface Props {` AND named prop interfaces (`interface CardPricingProps {`)
  // so components that name their props interface aren't silently skipped by the checks.
  let block = extractBracedBlockAfter(script, /interface\s+\w*Props\s*\{/)
  if (!block) block = extractBracedBlockAfter(script, /defineProps<\s*\{/)
  if (!block) return []
  return parsePropsInterface(block)
}

function parsePropsInterface(block) {
  // Each row: optional /** ... */ JSDoc, then `name?: type`
  const out = []
  const lines = block.split('\n')
  let pendingDoc = ''
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    if (trimmed.startsWith('/**') || trimmed.startsWith('*')) {
      pendingDoc += trimmed.replace(/^\/\*\*|\*\/|\*\s?/g, '').trim() + ' '
      continue
    }
    const m = trimmed.match(/^([a-zA-Z_][\w]*)\s*(\??)\s*:\s*(.+?)\s*$/)
    if (m) {
      const [, name, opt, type] = m
      out.push({ name, optional: opt === '?', type: type.replace(/;$/, '').trim(), jsdoc: pendingDoc.trim() })
      pendingDoc = ''
    }
  }
  return out
}

function extractEmits(script) {
  const block = extractBracedBlockAfter(script, /defineEmits<\s*\{/)
  if (!block) return []
  const out = []
  for (const line of block.split('\n')) {
    const t = line.trim().replace(/;$/, '')
    if (!t) continue
    // shapes: `name: [args]` or `'update:open': [boolean]`
    const em = t.match(/^['"]?([\w:-]+)['"]?\s*:\s*\[(.*)\]/)
    if (em) out.push({ name: em[1], payload: em[2].trim() })
  }
  return out
}

function extractSlots(script) {
  const block = extractBracedBlockAfter(script, /defineSlots<\s*\{/)
  if (!block) return []
  const out = []
  for (const line of block.split('\n')) {
    const t = line.trim().replace(/;$/, '')
    if (!t) continue
    // Match both slot syntaxes: `name(): T` and `name?: () => T`.
    const sm = t.match(/^([a-zA-Z_][\w-]*)\s*\??\s*[:(]/)
    if (sm) out.push({ name: sm[1] })
  }
  return out
}

/**
 * Extract the `withDefaults(defineProps<…>(), { … })` defaults object as
 * { propName: rawValueString }. Walks paren depth to find the SECOND argument's
 * `{ … }`, then splits it at top level (string- and bracket-aware). Returns {} when
 * there is no withDefaults call. Used for the Default-column drift check.
 */
export function extractDefaults(script) {
  const idx = script.indexOf('withDefaults(')
  if (idx === -1) return {}
  const open = script.indexOf('(', idx)
  if (open === -1) return {}
  // Find the top-level comma (depth 1) separating defineProps() from the defaults object.
  let depth = 0
  let commaPos = -1
  for (let i = open; i < script.length; i++) {
    const ch = script[i]
    if (ch === '(') depth++
    else if (ch === ')') {
      depth--
      if (depth === 0) break
    } else if (ch === ',' && depth === 1) {
      commaPos = i
      break
    }
  }
  if (commaPos === -1) return {}
  const braceStart = script.indexOf('{', commaPos)
  if (braceStart === -1) return {}
  let d = 1
  let end = -1
  for (let i = braceStart + 1; i < script.length; i++) {
    if (script[i] === '{') d++
    else if (script[i] === '}') {
      d--
      if (d === 0) {
        end = i
        break
      }
    }
  }
  if (end === -1) return {}
  return parseDefaultsObject(script.slice(braceStart + 1, end))
}

function parseDefaultsObject(inner) {
  const out = {}
  for (const part of splitTopLevel(inner)) {
    const m = part.match(/^\s*([a-zA-Z_$][\w$]*)\s*:\s*([\s\S]+)$/)
    if (m) out[m[1]] = m[2].trim()
  }
  return out
}

/** Split a comma-separated fragment at top level, ignoring commas inside strings/brackets. */
function splitTopLevel(s) {
  const parts = []
  let depth = 0
  let cur = ''
  let inStr = null
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    if (inStr) {
      cur += ch
      if (ch === inStr && s[i - 1] !== '\\') inStr = null
      continue
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      inStr = ch
      cur += ch
      continue
    }
    if (ch === '(' || ch === '[' || ch === '{') depth++
    else if (ch === ')' || ch === ']' || ch === '}') depth--
    if (ch === ',' && depth === 0) {
      if (cur.trim()) parts.push(cur)
      cur = ''
      continue
    }
    cur += ch
  }
  if (cur.trim()) parts.push(cur)
  return parts
}

/**
 * Resolve a `size?: SomeAlias` type reference to the underlying string union declared in
 * the same script (`type SomeAlias = 'small' | 'medium' | 'large'`). Returns the union
 * text, or null when the name isn't a simple identifier or has no local type alias.
 */
export function resolveTypeUnion(script, typeName) {
  if (!typeName || !/^[A-Za-z_$][\w$]*$/.test(typeName)) return null
  const re = new RegExp(`type\\s+${typeName}\\s*=\\s*([^\\n]+(?:\\n\\s*\\|[^\\n]+)*)`)
  const m = script.match(re)
  return m ? m[1].replace(/;\s*$/, '').trim() : null
}

// ---- Animation cross-check ----

export function extractAnimationClasses(vueText) {
  const out = new Set()
  const re = /\b(animate-[a-z0-9-]+|transition-[a-z]+|duration-\d+|ease-(in|out|in-out))\b/g
  let m
  while ((m = re.exec(vueText)) !== null) {
    out.add(m[1])
  }
  return [...out]
}

export function hasMotionReduceEscape(vueText) {
  return /\bmotion-reduce:(transition-none|transform-none|animate-none)\b/.test(vueText)
}
