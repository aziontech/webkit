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

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(SCRIPT_DIR, '../../..')
const PKG_PATH = resolve(REPO_ROOT, 'packages/webkit/package.json')
const SPECS_DIR = resolve(REPO_ROOT, '.specs')
const OUT_PATH = resolve(REPO_ROOT, 'packages/webkit/catalog.json')

// The public import name is always `@aziontech/webkit`, on every channel: external
// consumers install the release package by that name, and inside the monorepo the dev
// package (`@aziontech/webkit.dev`) is aliased to it, so every import written anywhere
// is `@aziontech/webkit/<subpath>`. The catalog therefore stamps this name into every
// import path. (Resolving the catalog FILE on disk still accepts either package name —
// see the dual-name resolver in the eslint-plugin / mcp loaders.)
const PKG_NAME = '@aziontech/webkit'

// Token rules ported verbatim from .claude/hooks/validate-tokens.mjs so the
// linter / stylelint / MCP validate against the same set the DS itself enforces.
// Stored as source strings + flags (JSON-serializable) — consumers rebuild RegExp.
const TOKEN_RULES = [
  { id: 'hex-color', pattern: '#[0-9a-fA-F]{3,8}\\b', flags: 'g', message: 'Hex color hardcoded. Use semantic tokens (var(--primary), var(--bg-surface), var(--text-default), ...).' },
  { id: 'rgb-hsl', pattern: '\\b(rgba?|hsla?)\\s*\\(', flags: 'g', message: 'RGB/HSL hardcoded. Use semantic tokens via var(--*).' },
  { id: 'tailwind-palette', pattern: '\\b(?:bg|text|border|ring|outline|fill|stroke|divide|placeholder|caret|accent)-(?:gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\\d{2,3}\\b', flags: 'g', message: 'Tailwind palette color. Use semantic webkit tokens (var(--primary), var(--text-default), var(--bg-surface), ...).' },
  { id: 'typography-raw-size', pattern: '\\btext-(?:xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)\\b(?!-)', flags: 'g', message: 'Raw Tailwind text size. Use a generated typography class (text-heading-md, text-body-sm, text-button-lg, ...).' },
  { id: 'primevue-color', pattern: '(?<![\\w-])(?:text-color|surface-(?:0|50|100|200|300|400|500|600|700|800|900|ground|section|card|overlay|border|hover))\\b', flags: 'g', message: 'PrimeVue/PrimeFlex color utility. Use semantic webkit tokens (var(--text-default), var(--bg-surface), ...).' }
]

/** Strip surrounding backticks/whitespace from a markdown table cell. */
function clean(cell) {
  return String(cell ?? '').trim().replace(/^`|`$/g, '').trim()
}

/**
 * Split a markdown table row into trimmed cells (leading/trailing pipes stripped).
 * A trailing backslash is dropped so an escaped union pipe (`'a' \| 'b'`) rejoins
 * cleanly as `'a' | 'b'` after overflow merge, matching unescaped union cells.
 */
function splitRow(line) {
  return line.replace(/^\||\|$/g, '').split(/\s*\|\s*/).map((c) => c.trim().replace(/\s*\\$/, ''))
}

/**
 * Parse a markdown table into header-keyed rows, tolerating union types like
 * `'a' | 'b' | 'c'` inside a cell (unescaped `|`). Extra cells are absorbed by
 * `overflowHeader`'s column (joined with ' | '); the trailing columns keep their
 * positions. Returns [] when the section has no table.
 */
function parseSpecTable(section, overflowHeader) {
  if (!section) return []
  const lines = section.split('\n').map((l) => l.trim()).filter((l) => l.startsWith('|'))
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
    headers.forEach((h, idx) => { row[h] = (cells[idx] ?? '').trim() })
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
  if (target.startsWith('./src/utils/')) return 'util'
  if (target.startsWith('./src/composables/')) return 'composable'
  if (target.startsWith('./src/svg/')) return 'svg'
  if (target.startsWith('./src/styles/')) return 'style'
  if (target.startsWith('./src/vite/')) return 'other'
  // Only a `.vue` root or an `index.ts` compound barrel is a renderable component;
  // any other target under src/components (a bare helper .ts) is not.
  if (/\.vue$/.test(target) || /\/index\.ts$/.test(target)) return 'component'
  return 'other'
}

const _specCache = new Map()
function loadSpec(subpath) {
  if (_specCache.has(subpath)) return _specCache.get(subpath)
  const value = _readSpec(subpath)
  _specCache.set(subpath, value)
  return value
}

function _readSpec(subpath) {
  const specFile = resolve(SPECS_DIR, `${subpath}.md`)
  if (!existsSync(specFile)) return null
  const { frontmatter, body } = parseSpecFile(specFile)
  if (!frontmatter) return null

  const props = parseSpecTable(getSection(body, 'Props') || '', 'type')
    .map((r) => ({ name: clean(r.prop), type: clean(r.type), default: clean(r.default), required: clean(r.required), doc: clean(r.jsdoc) }))
    .filter((p) => p.name && p.name !== '_none_')
  const events = parseSpecTable(getSection(body, 'Events') || '', 'payload')
    .map((r) => ({ name: clean(r.event), payload: clean(r.payload), notes: clean(r.notes) }))
    .filter((e) => e.name && e.name !== '_none_')
  const slots = parseSpecTable(getSection(body, 'Slots') || '', 'notes')
    .map((r) => ({ name: clean(r.slot ?? Object.values(r)[0]), scope: clean(r.scope ?? ''), notes: clean(r.notes ?? '') }))
    .filter((s) => s.name && s.name !== '_none_')

  return {
    category: frontmatter.category ?? null,
    structure: frontmatter.structure ?? null,
    status: frontmatter.status ?? null,
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
    if (/\/index\.ts$/.test(exportsMap[`./${s}`] || '')) return true
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

    // Non-module exports (package.json, catalog.json): valid imports, not components.
    if (subpath.endsWith('.json')) {
      entry.kind = 'other'
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
      entry.kind = seg === 'svg' ? 'svg' : seg === 'utils' ? 'util' : seg === 'styles' ? 'style' : 'component'
      entry.treeShakeableImport = importPath
    } else {
      entry.kind = kindFromTarget(target)
      if (isCompound) {
        entry.compoundRoot = true
        const rootKey = `${subpath}-root`
        const isBarrel = /\/index\.ts$/.test(target)
        if (subpathSet.has(rootKey)) {
          // Dedicated tree-shakeable root export (the canonical compound-api shape).
          entry.treeShakeableImport = `${PKG_NAME}/${rootKey}`
        } else if (isBarrel) {
          // index.ts barrel with no `-root` export: the compound path pulls in every
          // sub-component, so there is no tree-shakeable way in. Report it honestly
          // instead of pointing at a non-existent `-root`.
          entry.treeShakeableImport = null
          entry.treeShakeableNote =
            `No tree-shakeable root. Add "./${rootKey}" -> the root .vue, or import sub-components individually.`
        } else {
          // .vue-rooted compound: the main export already resolves to the lean root .vue.
          entry.treeShakeableImport = importPath
        }
        entry.subcomponents = subpaths
          .filter((s) => s !== rootKey && s !== subpath && s.startsWith(`${subpath}-`) && parentCompound(s) === subpath)
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
    imports
  }
}

const catalog = build()
writeFileSync(OUT_PATH, JSON.stringify(catalog, null, 2) + '\n', 'utf-8')
const componentCount = Object.values(catalog.imports).filter((e) => e.kind === 'component').length
process.stdout.write(
  `catalog.json written: ${Object.keys(catalog.imports).length} exports (${componentCount} components) @ ${catalog.webkitVersion}\n`
)
