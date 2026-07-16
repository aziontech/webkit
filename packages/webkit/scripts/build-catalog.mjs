#!/usr/bin/env node
// Generates packages/webkit/catalog.json — the machine-readable, version-locked
// manifest that the adoption tooling reads (eslint-plugin-webkit, webkit-mcp,
// the Claude Code bundle). One source of truth, derived from:
//   - packages/webkit/package.json#exports  (the canonical allowed-import list)
//   - .specs/*.md                            (per-component API: props/events/slots)
//
// Deterministic by design (no timestamps) so a CI drift-check can assert the
// committed catalog.json matches a fresh build. Re-run at release time via the
// .releaserc `prepareCmd` so it always tracks the published exports.
//
// No external deps — Node built-ins + the repo's own spec parser.

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { parseSpecFile, getSection } from '../../../.claude/hooks/_lib/spec.mjs'
import { vocabularySnapshot } from '../../../.claude/hooks/_lib/prop-vocabulary.mjs'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(SCRIPT_DIR, '../../..')
const PKG_PATH = resolve(REPO_ROOT, 'packages/webkit/package.json')
const SPECS_DIR = resolve(REPO_ROOT, '.specs')
const OUT_PATH = resolve(REPO_ROOT, 'packages/webkit/catalog.json')

// Theme sources for the positive token inventory (see buildTokens): the generated CSS
// custom properties and the semantic typography utility table. Both channels are unioned
// so the inventory carries BOTH the semantic tokens consumers write (`--primary`,
// `--bg-surface`, in v3) and the primitive scale (`--color-primary-500`, in v4).
const THEME_GLOBALS_CANDIDATES = [
  resolve(REPO_ROOT, 'packages/theme/dist/v3/globals.css'),
  resolve(REPO_ROOT, 'packages/theme/dist/v4/globals.css')
]
const THEME_TEXTS = resolve(REPO_ROOT, 'packages/theme/src/tokens/semantic/texts.data.js')

// The public import name is always `@aziontech/webkit`: every import written anywhere
// is `@aziontech/webkit/<subpath>`, so the catalog stamps this name into every
// import path.
const PKG_NAME = '@aziontech/webkit'

// Token rules ported verbatim from .claude/hooks/validate-tokens.mjs so the
// linter / stylelint / MCP validate against the same set the DS itself enforces.
// Stored as source strings + flags (JSON-serializable) — consumers rebuild RegExp.
const TOKEN_RULES = [
  {
    id: 'hex-color',
    pattern: '#[0-9a-fA-F]{3,8}\\b',
    flags: 'g',
    message:
      'Hex color hardcoded. Use semantic tokens (var(--primary), var(--bg-surface), var(--text-default), ...).'
  },
  {
    id: 'rgb-hsl',
    pattern: '\\b(rgba?|hsla?)\\s*\\(',
    flags: 'g',
    message: 'RGB/HSL hardcoded. Use semantic tokens via var(--*).'
  },
  {
    id: 'tailwind-palette',
    pattern:
      '\\b(?:bg|text|border|ring|outline|fill|stroke|divide|placeholder|caret|accent)-(?:gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\\d{2,3}\\b',
    flags: 'g',
    message:
      'Tailwind palette color. Use semantic webkit tokens (var(--primary), var(--text-default), var(--bg-surface), ...).'
  },
  {
    id: 'typography-raw-size',
    pattern: '\\btext-(?:xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)\\b(?!-)',
    flags: 'g',
    message:
      'Raw Tailwind text size. Use a generated typography class (text-heading-md, text-body-sm, text-button-lg, ...).'
  },
  {
    id: 'primevue-color',
    pattern:
      '(?<![\\w-])(?:text-color|surface-(?:0|50|100|200|300|400|500|600|700|800|900|ground|section|card|overlay|border|hover))\\b',
    flags: 'g',
    message:
      'PrimeVue/PrimeFlex color utility. Use semantic webkit tokens (var(--text-default), var(--bg-surface), ...).'
  }
]

/** Strip surrounding backticks/whitespace from a markdown table cell. */
function clean(cell) {
  return String(cell ?? '')
    .trim()
    .replace(/^`|`$/g, '')
    .trim()
}

/**
 * Split a markdown table row into trimmed cells (leading/trailing pipes stripped).
 * A trailing backslash is dropped so an escaped union pipe (`'a' \| 'b'`) rejoins
 * cleanly as `'a' | 'b'` after overflow merge, matching unescaped union cells.
 */
function splitRow(line) {
  return line
    .replace(/^\||\|$/g, '')
    .split(/\s*\|\s*/)
    .map((c) => c.trim().replace(/\s*\\$/, ''))
}

/**
 * Parse a markdown table into header-keyed rows, tolerating union types like
 * `'a' | 'b' | 'c'` inside a cell (unescaped `|`). Extra cells are absorbed by
 * `overflowHeader`'s column (joined with ' | '); the trailing columns keep their
 * positions. Returns [] when the section has no table.
 */
function parseSpecTable(section, overflowHeader) {
  if (!section) return []
  const lines = section
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

/** Category from an export target path: src/components/<category>/<name>/... → <category>. */
function categoryFromTarget(target) {
  const m = target.match(/^\.\/src\/components\/([^/]+)\/([^/]+)\//)
  if (!m) return null
  // Two shapes: components/<category>/<name>/ (3 dirs) or components/<name>/ (name only).
  // When the 2nd segment is the component's own file dir (name === 2nd seg name), the
  // 1st segment is the category. When there is no category dir the regex still yields
  // <name> as [1]; guard by requiring the target to have the deeper shape.
  return m[1]
}

/** kind by target path for non-component exports. */
function kindFromTarget(target) {
  if (target.startsWith('./src/eslint-plugin/')) return 'other'
  if (target.startsWith('./src/mcp/')) return 'other'
  if (target.startsWith('./src/cli/')) return 'other'
  if (target.startsWith('./src/utils/')) return 'util'
  if (target.startsWith('./src/composables/')) return 'composable'
  if (target.startsWith('./src/svg/')) return 'svg'
  if (target.startsWith('./src/styles/')) return 'style'
  if (target.startsWith('./src/vite/')) return 'other'
  // Only a `.vue` root or an `index.ts` compound barrel is a renderable component;
  // any other target under src/components (a bare helper .ts) is not.
  if (/\.vue$/.test(target) || /\/index\.(ts|js)$/.test(target)) return 'component'
  return 'other'
}

const _specCache = new Map()
function loadSpec(subpath) {
  if (_specCache.has(subpath)) return _specCache.get(subpath)
  const value = _readSpec(subpath)
  _specCache.set(subpath, value)
  return value
}

/**
 * Strip HTML comments, re-applying until the text is stable: a single pass can leave a
 * residual `<!--` when removals concatenate into a new comment opener.
 */
function stripHtmlComments(text) {
  let out = String(text)
  let prev
  do {
    prev = out
    out = out.replace(/<!--[\s\S]*?-->/g, '')
  } while (out !== prev)
  return out
}

/** First real prose paragraph of a section (drops HTML comments + the `_none_` sentinel). */
function firstProse(section) {
  if (!section) return ''
  const text = stripHtmlComments(section)
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#') && !l.startsWith('|') && l !== '_none_')
    .join(' ')
    .trim()
  return text
}

/** Markdown list items of a section as a trimmed string array (drops HTML comments). */
function bullets(section) {
  if (!section) return []
  return stripHtmlComments(section)
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => /^[-*]\s+/.test(l))
    .map((l) => clean(l.replace(/^[-*]\s+/, '')))
    .filter((l) => l && l !== '_none_')
}

function _readSpec(subpath) {
  const specFile = resolve(SPECS_DIR, `${subpath}.md`)
  if (!existsSync(specFile)) return null
  const { frontmatter, body } = parseSpecFile(specFile)
  if (!frontmatter) return null

  const props = parseSpecTable(getSection(body, 'Props') || '', 'type')
    .map((r) => ({
      name: clean(r.prop),
      type: clean(r.type),
      default: clean(r.default),
      required: clean(r.required),
      doc: clean(r.jsdoc)
    }))
    .filter((p) => p.name && p.name !== '_none_')
  const events = parseSpecTable(getSection(body, 'Events') || '', 'payload')
    .map((r) => ({ name: clean(r.event), payload: clean(r.payload), notes: clean(r.notes) }))
    .filter((e) => e.name && e.name !== '_none_')
  const slots = parseSpecTable(getSection(body, 'Slots') || '', 'notes')
    .map((r) => ({
      name: clean(r.slot ?? Object.values(r)[0]),
      scope: clean(r.scope ?? ''),
      notes: clean(r.notes ?? '')
    }))
    .filter((s) => s.name && s.name !== '_none_')

  return {
    category: frontmatter.category ?? null,
    structure: frontmatter.structure ?? null,
    status: frontmatter.status ?? null,
    // Deprecation (B4): optional frontmatter (`deprecated: true`, `replaced_by: <name>`).
    // Absent on every current spec, so no consumer rule fires until a component is
    // actually deprecated — then no-deprecated-component steers to the replacement.
    deprecated: frontmatter.deprecated === true,
    replacedBy: frontmatter.replaced_by ?? null,
    // Style seam (pillar 2): a component that INTENTIONALLY lets the consumer pass
    // class/style to its root (a layout/container wrapper). no-style-override reads this
    // to allow it. Opt-in via spec frontmatter `style_seam: true`; default false.
    styleSeam: frontmatter.style_seam === true,
    // Usage guidance (B3): Purpose prose + the structured "when/why" sections. Extracted
    // when present; empty until a spec is backfilled. Powers get_component / suggest /
    // get_best_practices and the Storybook description.
    purpose: firstProse(getSection(body, 'Purpose')),
    useWhen: bullets(getSection(body, 'When to use')),
    avoidWhen: bullets(getSection(body, 'When NOT to use')),
    related: bullets(getSection(body, 'Related')),
    bestPractices: bullets(getSection(body, 'Best practices')),
    props,
    events,
    slots
  }
}

function build() {
  const pkg = JSON.parse(readFileSync(PKG_PATH, 'utf-8'))
  const exportsMap = pkg.exports || {}
  const subpaths = Object.keys(exportsMap)
    .filter((k) => k.startsWith('./'))
    .map((k) => k.slice(2))
  const subpathSet = new Set(subpaths)

  // A top-level subpath hosts a compound (owns sub-components) iff its spec is a
  // composition, its target is an index.ts barrel, or it exports a `-root` sibling.
  // Spec structure is the reliable signal: it catches .vue-rooted compounds
  // (dialog, drawer, …) and index.ts compounds (dropdown, paginator) while NOT
  // mis-catching monolithic components that merely share a name prefix
  // (button vs button-highlight).
  const compoundRoots = subpaths.filter((s) => {
    if (s.includes('/')) return false
    if (subpathSet.has(`${s}-root`)) return true
    if (/^\.\/src\/components\/.+\/index\.(ts|js)$/.test(exportsMap[`./${s}`] || '')) return true
    return loadSpec(s)?.structure === 'composition'
  })
  // Longest-first so multi-select wins over select when attributing subcomponents.
  const compoundByLength = [...compoundRoots].sort((a, b) => b.length - a.length)

  function parentCompound(subpath) {
    if (subpath.endsWith('-root')) return null
    for (const c of compoundByLength) {
      if (subpath !== c && subpath.startsWith(`${c}-`)) return c
    }
    return null
  }

  const imports = {}
  for (const subpath of subpaths) {
    const target = exportsMap[`./${subpath}`]
    const importPath = `${PKG_NAME}/${subpath}`
    const entry = { import: importPath, target }

    // Non-module exports (package.json, catalog.json, docs/*.md): valid imports, not components.
    if (subpath.endsWith('.json') || subpath.endsWith('.md')) {
      entry.kind = subpath.endsWith('.md') ? 'doc' : 'other'
      entry.treeShakeableImport = importPath
      imports[subpath] = entry
      continue
    }

    const isCompound = compoundRoots.includes(subpath)
    const isRoot = subpath.endsWith('-root') && subpathSet.has(subpath.slice(0, -'-root'.length))
    const parent = parentCompound(subpath)

    if (isRoot) {
      entry.kind = 'root'
      entry.rootOf = subpath.slice(0, -'-root'.length)
      entry.treeShakeableImport = importPath
    } else if (parent) {
      entry.kind = 'subcomponent'
      entry.parent = parent
      entry.treeShakeableImport = importPath
    } else if (subpath.includes('/')) {
      const seg = subpath.split('/')[0]
      entry.kind =
        seg === 'svg' ? 'svg' : seg === 'utils' ? 'util' : seg === 'styles' ? 'style' : 'component'
      entry.treeShakeableImport = importPath
    } else {
      entry.kind = kindFromTarget(target)
      if (isCompound) {
        entry.compoundRoot = true
        const rootKey = `${subpath}-root`
        const isBarrel = /\/index\.(ts|js)$/.test(target)
        if (subpathSet.has(rootKey)) {
          // Dedicated tree-shakeable root export (the canonical compound-api shape).
          entry.treeShakeableImport = `${PKG_NAME}/${rootKey}`
        } else if (isBarrel) {
          // index.ts barrel with no `-root` export: the compound path pulls in every
          // sub-component, so there is no tree-shakeable way in. Report it honestly
          // instead of pointing at a non-existent `-root`.
          entry.treeShakeableImport = null
          entry.treeShakeableNote = `No tree-shakeable root. Add "./${rootKey}" -> the root .vue, or import sub-components individually.`
        } else {
          // .vue-rooted compound: the main export already resolves to the lean root .vue.
          entry.treeShakeableImport = importPath
        }
        entry.subcomponents = subpaths
          .filter(
            (s) =>
              s !== rootKey &&
              s !== subpath &&
              s.startsWith(`${subpath}-`) &&
              parentCompound(s) === subpath
          )
          .map((s) => `${PKG_NAME}/${s}`)
      } else {
        entry.treeShakeableImport = importPath
      }
    }

    // Enrich components/roots with spec API when a spec exists.
    const spec = loadSpec(subpath) || (entry.kind === 'root' ? loadSpec(entry.rootOf) : null)
    if (spec) {
      entry.category = spec.category ?? categoryFromTarget(target)
      entry.structure = spec.structure
      entry.status = spec.status
      if (spec.props.length) entry.props = spec.props
      if (spec.events.length) entry.events = spec.events
      if (spec.slots.length) entry.slots = spec.slots
      if (spec.purpose) entry.purpose = spec.purpose
      if (spec.useWhen.length) entry.useWhen = spec.useWhen
      if (spec.avoidWhen.length) entry.avoidWhen = spec.avoidWhen
      if (spec.related.length) entry.related = spec.related
      if (spec.bestPractices.length) entry.bestPractices = spec.bestPractices
      if (spec.deprecated) entry.deprecated = true
      if (spec.replacedBy) entry.replacedBy = spec.replacedBy
      if (spec.styleSeam) entry.styleSeam = true
    } else if (entry.kind === 'component') {
      entry.category = categoryFromTarget(target)
    }

    imports[subpath] = entry
  }

  return {
    package: PKG_NAME,
    webkitVersion: pkg.version,
    deniedPrefixes: [`${PKG_NAME}/src/`],
    tokenRules: TOKEN_RULES,
    tokens: buildTokens(),
    // Canonical prop vocabulary (pillar 1): the MCP surfaces this so AI-generated
    // consumer code uses `kind` (not `variant`), `severity` (not `status`), etc.
    vocabulary: vocabularySnapshot(),
    imports
  }
}

/**
 * Positive token inventory sourced from @aziontech/theme: the valid CSS custom
 * properties (from the generated globals.css) and the typography utility classes (from
 * the semantic texts table). Complements `tokenRules` (what NOT to write) with what a
 * consumer SHOULD use. Deterministic (sorted) so the drift-check stays stable; fail-safe
 * (empty) if the theme build output is unavailable.
 */
function buildTokens() {
  const cssVarSet = new Set()
  for (const globals of THEME_GLOBALS_CANDIDATES.filter((p) => existsSync(p))) {
    const css = readFileSync(globals, 'utf-8')
    for (const m of css.matchAll(/^\s*(--[a-z0-9-]+)\s*:/gim)) cssVarSet.add(m[1])
  }
  const cssVars = [...cssVarSet].sort()

  const typoSet = new Set()
  if (existsSync(THEME_TEXTS)) {
    const src = readFileSync(THEME_TEXTS, 'utf-8')
    for (const m of src.matchAll(/['"](text-[a-z0-9-]+)['"]/g)) typoSet.add(m[1])
  }
  const typography = [...typoSet].sort()

  // Group CSS vars by their first path segment (e.g. --bg-surface → "bg", --primary → "primary").
  const grouped = {}
  for (const v of cssVars) {
    const name = v.slice(2)
    const seg = name.includes('-') ? name.slice(0, name.indexOf('-')) : name
    ;(grouped[seg] ||= []).push(v)
  }
  const groups = {}
  for (const k of Object.keys(grouped).sort()) groups[k] = grouped[k]

  // Animation catalog: the valid `animate-*` NAMES (without the prefix), unioning the
  // semantic-plugin utilities (.animate-*) with the primitive --animate-* custom
  // properties. This is the source of truth the compliance hook cross-checks against.
  const animSet = new Set()
  const semAnim = resolve(REPO_ROOT, 'packages/theme/src/tokens/semantic/animations.js')
  if (existsSync(semAnim)) {
    const src = readFileSync(semAnim, 'utf-8')
    for (const m of src.matchAll(/\.animate-([a-z0-9-]+)/g)) animSet.add(m[1])
  }
  for (const v of cssVars) {
    const m = /^--animate-([a-z0-9-]+)$/.exec(v)
    if (m) animSet.add(m[1])
  }
  const animations = [...animSet].sort()

  return { cssVars, typography, groups, animations }
}

const catalog = build()
writeFileSync(OUT_PATH, JSON.stringify(catalog, null, 2) + '\n', 'utf-8')
const componentCount = Object.values(catalog.imports).filter((e) => e.kind === 'component').length
process.stdout.write(
  `catalog.json written: ${Object.keys(catalog.imports).length} exports (${componentCount} components) @ ${catalog.webkitVersion}\n`
)
