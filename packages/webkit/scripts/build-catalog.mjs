#!/usr/bin/env node

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { parseSpecFile, getSection } from '../../../.claude/hooks/_lib/spec.mjs'
import { vocabularySnapshot } from '../../../.claude/hooks/_lib/prop-vocabulary.mjs'
import { missingComponentDocs } from './lib/component-docs.mjs'
import { readBlocks, readExamples } from './lib/blocks.mjs'
import {
  buildLlms,
  catalogView,
  summary as llmsSummary,
  undocumentedExports,
  writeLlms
} from './build-llms.mjs'
import { exportTarget } from './lib/exports.mjs'
import { buildAliases, retiredNames } from './lib/naming.mjs'
import { SURFACES, surfaceFromTarget } from './lib/surfaces.mjs'
import { iconKeywords } from '../../icons/scripts/icon-keywords.mjs'
import {
  animate as themeAnimate,
  useWhen as themeAnimateUseWhen
} from '../../theme/src/tokens/primitives/animations/animate.js'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(SCRIPT_DIR, '../../..')
const PKG_ROOT = resolve(SCRIPT_DIR, '..')
const PKG_PATH = resolve(REPO_ROOT, 'packages/webkit/package.json')
const SPECS_DIR = resolve(REPO_ROOT, '.specs')
const OUT_PATH = resolve(REPO_ROOT, 'packages/webkit/catalog.json')
const PARTS_DIR = resolve(REPO_ROOT, 'packages/webkit/catalog')
const PATTERN_HEAVY_KEYS = ['sfc', 'variants', 'guidelines']
const COMPONENT_PROSE_KEYS = ['purpose', 'useWhen', 'avoidWhen', 'related', 'bestPractices']
const V6_MIGRATION = resolve(PKG_ROOT, 'src/cli/migrations/v6.json')
const V6_BLOCKS = resolve(PKG_ROOT, 'src/cli/migrations/v6-blocks.json')

const THEME_GLOBALS_CANDIDATES = [
  resolve(REPO_ROOT, 'packages/theme/dist/v3/globals.css'),
  resolve(REPO_ROOT, 'packages/theme/dist/v4/globals.css')
]
const THEME_TEXTS = resolve(REPO_ROOT, 'packages/theme/src/tokens/semantic/texts.data.js')
const ICONS_SVG = resolve(REPO_ROOT, 'packages/icons/src/svg-raw')
const SRC = resolve(PKG_ROOT, 'src')
const ASSET_PART_DIR = 'catalog/assets'

const PKG_NAME = '@aziontech/webkit'

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
    id: 'legacy-color-util',
    pattern:
      '(?<![\\w-])(?:text-color|surface-(?:0|50|100|200|300|400|500|600|700|800|900|ground|section|card|overlay|border|hover))\\b',
    flags: 'g',
    message:
      'Legacy/external color utility. Use semantic webkit tokens (var(--text-default), var(--bg-surface), ...).'
  }
]

function clean(cell) {
  return String(cell ?? '')
    .trim()
    .replace(/^`|`$/g, '')
    .trim()
}

function splitRow(line) {
  return line
    .replace(/^\||\|$/g, '')
    .split(/\s*\|\s*/)
    .map((c) => c.trim().replace(/\s*\\$/, ''))
}

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

function categoryFromTarget(target) {
  const m = target.match(/^\.\/src\/components\/([^/]+)\/([^/]+)\//)
  if (!m) return null
  return m[1]
}

function kindFromTarget(target) {
  if (target.startsWith('./src/eslint-plugin/')) return 'other'
  if (target.startsWith('./src/mcp/')) return 'other'
  if (target.startsWith('./src/cli/')) return 'other'
  if (target.startsWith('./src/utils/')) return 'util'
  if (target.startsWith('./src/composables/')) return 'composable'
  if (target.startsWith('./src/svg/')) return 'svg'
  if (target.startsWith('./src/assets/')) return 'asset'
  if (target.startsWith('./src/styles/')) return 'style'
  if (target.startsWith('./src/locales/')) return 'locale'
  if (target.startsWith('./src/vite/')) return 'other'
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

function stripHtmlComments(text) {
  let out = String(text)
  let prev
  do {
    prev = out
    out = out.replace(/<!--[\s\S]*?-->/g, '')
  } while (out !== prev)
  return out
}

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

function bullets(section) {
  if (!section) return []
  return stripHtmlComments(section)
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => /^[-*]\s+/.test(l))
    .map((l) => clean(l.replace(/^[-*]\s+/, '')))
    .filter((l) => l && l !== '_none_')
}

export function modelProps(target) {
  if (typeof target !== 'string') return []
  let file = resolve(PKG_ROOT, target)
  if (/[\\/]index\.(ts|js)$/.test(file)) {
    file = file.replace(/index\.(ts|js)$/, `${file.split(/[\\/]/).at(-2)}.vue`)
  }
  if (!file.endsWith('.vue') || !existsSync(file)) return []
  const src = readFileSync(file, 'utf-8')
  const models = []
  const re = /defineModel<((?:[^<>]|<[^<>]*>)*)>\(\s*(?:'([^']+)')?/g
  for (const match of src.matchAll(re)) {
    const name = match[2] ?? 'modelValue'
    const rest = src.slice(match.index + match[0].length, match.index + match[0].length + 200)
    const options = rest.match(/^\s*,?\s*\{[^]*?default:\s*([^,}\n]+?)\s*[,}\n]/)
    let fallback = options?.[1]?.trim() ?? 'undefined'
    const opens = (fallback.match(/[([{]/g) ?? []).length
    const closes = (fallback.match(/[)\]}]/g) ?? []).length
    if (opens !== closes) fallback = '—'
    models.push({
      name,
      type: match[1].replace(/\s+/g, ' ').trim(),
      default: fallback,
      required: 'false',
      doc: name === 'modelValue' ? 'Two-way value (`v-model`).' : `Two-way value (\`v-model:${name}\`).`
    })
  }
  return models
}

function _readSpec(subpath) {
  const specFile = resolve(SPECS_DIR, `${subpath.split('/').pop()}.md`)
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
    deprecated: frontmatter.deprecated === true,
    replacedBy: frontmatter.replaced_by ?? null,
    setup:
      typeof frontmatter.setup === 'string' && frontmatter.setup.trim()
        ? frontmatter.setup.trim()
        : null,
    styleSeam: frontmatter.style_seam === true,
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

export async function build() {
  const pkg = JSON.parse(readFileSync(PKG_PATH, 'utf-8'))
  const exportsMap = Object.fromEntries(
    Object.entries(pkg.exports || {}).map(([key, entry]) => [key, exportTarget(entry)])
  )
  const subpaths = Object.keys(exportsMap)
    .filter((k) => k.startsWith('./'))
    .map((k) => k.slice(2))
  const subpathSet = new Set(subpaths)

  const compoundRoots = subpaths.filter((s) => {
    if (s.includes('/')) return false
    if (subpathSet.has(`${s}-root`)) return true
    if (/^\.\/src\/components\/.+\/index\.(ts|js)$/.test(exportsMap[`./${s}`] || '')) return true
    return loadSpec(s)?.structure === 'composition'
  })
  const compoundByLength = [...compoundRoots].sort((a, b) => b.length - a.length)

  function compoundDir(c) {
    const target = exportsMap[`./${c}-root`] || exportsMap[`./${c}`] || ''
    return target.match(/^\.\/src\/components\/[^/]+\//)?.[0] ?? ''
  }

  function parentCompound(subpath) {
    if (subpath.endsWith('-root') || compoundRoots.includes(subpath)) return null
    const target = exportsMap[`./${subpath}`] || ''
    for (const c of compoundByLength) {
      if (subpath !== c && subpath.startsWith(`${c}-`) && target.startsWith(compoundDir(c)))
        return c
    }
    return null
  }

  const imports = {}
  for (const subpath of subpaths) {
    const target = exportsMap[`./${subpath}`]
    const importPath = `${PKG_NAME}/${subpath}`
    const entry = { import: importPath, target }

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
        seg === 'svg'
          ? 'svg'
          : seg === 'assets'
            ? 'asset'
            : seg === 'utils'
              ? 'util'
              : seg === 'styles'
                ? 'style'
                : seg === 'locales'
                  ? 'locale'
                  : 'component'
      entry.treeShakeableImport = importPath
    } else {
      entry.kind = kindFromTarget(target)
      if (isCompound) {
        entry.compoundRoot = true
        const rootKey = `${subpath}-root`
        const isBarrel = /\/index\.(ts|js)$/.test(target)
        if (subpathSet.has(rootKey)) {
          entry.treeShakeableImport = `${PKG_NAME}/${rootKey}`
        } else if (isBarrel) {
          entry.treeShakeableImport = null
          entry.treeShakeableNote = `No tree-shakeable root. Add "./${rootKey}" -> the root .vue, or import sub-components individually.`
        } else {
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

    const spec = loadSpec(subpath) || (entry.kind === 'root' ? loadSpec(entry.rootOf) : null)
    if (spec) {
      entry.category = spec.category ?? categoryFromTarget(target)
      entry.structure = spec.structure
      const models = modelProps(target).filter((m) => !spec.props.some((p) => p.name === m.name))
      if (spec.props.length || models.length) entry.props = [...spec.props, ...models]
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
      if (spec.setup) entry.setup = spec.setup
    } else if (entry.kind === 'component') {
      entry.category = categoryFromTarget(target)
    }

    const surface = surfaceFromTarget(target)
    if (surface) entry.surface = surface
    imports[subpath] = entry
  }

  const patterns = readBlocks(PKG_ROOT)
  const patternAliases = readPatternAliases(patterns)
  const examples = readExamples(PKG_ROOT, subpathSet)
  for (const [subpath, list] of Object.entries(examples)) {
    if (imports[subpath]) imports[subpath].examples = list
  }

  return {
    package: PKG_NAME,
    webkitVersion: pkg.version,
    deniedPrefixes: [`${PKG_NAME}/src/`],
    tokenRules: TOKEN_RULES,
    tokens: buildTokens(),
    vocabulary: vocabularySnapshot(),
    surfaces: SURFACES,
    aliases: buildAliases(subpaths, retiredNames(JSON.parse(readFileSync(V6_MIGRATION, 'utf-8')))),
    imports,
    assets: buildAssets(imports),
    patterns,
    patternAliases
  }
}

const ASSET_KINDS = {
  illustrations: {
    title: 'Illustrations',
    summary:
      'The official product illustration scenes, drawn into the page as inline SVG and repainted from the theme. Pass the name to `Illustration` (`name`) or to a section that shows one (`illustration`).',
    markers: [
      'assets/illustrations/registry.ts',
      'components/content/illustration/illustration.vue'
    ],
    registry: 'src/assets/illustrations/registry.ts',
    unknown: 'An unknown name renders a "PLACE DESIGN ASSET" placeholder and warns in the console.'
  },
  diagrams: {
    title: 'Diagrams',
    summary:
      'The registered product architecture diagrams. Pass the name to `Diagram` (`name`) or to a section that shows one; the label is the diagram\u2019s accessible description.',
    markers: ['assets/diagrams/registry.ts', 'components/marketing/diagram/diagram.vue'],
    registry: 'src/assets/diagrams/registry.ts',
    unknown: 'An unknown name draws nothing.'
  },
  lineFigures: {
    title: 'Line figures',
    summary:
      'The isometric line-art figures that answer the pointer, one per product. Pass the name to `LineFigure` (`name`); the label is the figure\u2019s own English description.',
    markers: [
      'components/content/line-figure/figures/registry.ts',
      'components/content/line-figure/line-figure.vue'
    ],
    registry: 'src/components/content/line-figure/figures/registry.ts',
    unknown: 'An unknown or empty name draws nothing.'
  },
  brandMarks: {
    title: 'Brand marks',
    summary:
      'Client, analyst and framework marks drawn as theme-aware SVG. Pass the name where a component asks for a mark (`Ticker` `marks`, `QuoteTabs` and `QuoteCarousel` `mark`, `ClientQuotes` `mark`); the label is the accessible name.',
    markers: ['svg/brands/registry.ts'],
    registry: 'src/svg/brands/registry.ts',
    unknown:
      'An unknown name is not drawn as a mark: `Ticker` prints it as a typographic wordmark, the quote components show no mark.'
  },
  icons: {
    title: 'Icons',
    summary:
      'Every icon class of `@aziontech/icons` with search keywords. A monochrome icon is `ai ai-<name>` (Azion) or `pi pi-<name>` (PrimeIcons), coloured by the text colour; a colour brand icon is `ai-cor ai-<name>`. Import `@aziontech/icons` once at the app entry; an `icon` prop takes the class string.',
    unknown: 'An unknown class renders nothing.'
  }
}

function objectKeys(file, variable) {
  const src = readFileSync(resolve(PKG_ROOT, file), 'utf-8')
  const start = src.search(new RegExp(`export const ${variable}\\b[^=]*= \\{`))
  if (start === -1) throw new Error(`${file}: no "export const ${variable}" object`)
  const body = src.slice(src.indexOf('{', start) + 1, src.indexOf('\n}', start))
  const entries = []
  for (const m of body.matchAll(/^\s*'?([a-z0-9-]+)'?:\s*(?:'([^']*)')?/gm)) {
    entries.push({ name: m[1], value: m[2] ?? null })
  }
  return entries
}

function quoted(src, key, from = 0) {
  const m = src
    .slice(from)
    .match(new RegExp(`\\b${key}:\\s*(["'\`])((?:\\\\.|(?!\\1)[\\s\\S])*)\\1`))
  return m ? m[2].replace(/\\'/g, "'").replace(/\s+/g, ' ').trim() : null
}

function viewBoxOf(file) {
  const m = readFileSync(file, 'utf-8').match(/viewBox="([^"]+)"/)
  const [, , w, h] = (m?.[1] ?? '').split(/[\s,]+/).map(Number)
  return w > 0 && h > 0 ? `${Math.round(w)}x${Math.round(h)}` : null
}

function importGraph() {
  const graph = new Map()
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name)
      if (e.isDirectory()) walk(p)
      else if (/\.(vue|ts|js)$/.test(e.name) && !/\.test\.|\.d\.ts$/.test(e.name)) {
        const src = readFileSync(p, 'utf-8')
        const deps = []
        for (const m of src.matchAll(/(?:from\s+|import\(\s*)['"](\.{1,2}\/[^'"]+)['"]/g)) {
          const base = resolve(dirname(p), m[1])
          const hit = ['', '.ts', '.js', '.vue', '/index.ts', '/index.js'].find((ext) =>
            existsSync(base + ext)
          )
          if (hit != null) deps.push(base + hit)
        }
        graph.set(p, deps)
      }
    }
  }
  walk(SRC)
  return graph
}

function reaches(graph, from, markers) {
  const seen = new Set()
  const stack = [from]
  while (stack.length) {
    const file = stack.pop()
    if (seen.has(file)) continue
    seen.add(file)
    if (markers.has(file)) return true
    for (const dep of graph.get(file) || []) stack.push(dep)
  }
  return false
}

function iconItems() {
  const sets = [
    ['ai', 'azionicons', (n) => `ai ${n}`],
    ['pi', 'primeicons', (n) => (n.startsWith('pi-') ? `pi ${n}` : `ai ${n}`)],
    ['ai-cor', 'color', (n) => `ai-cor ${n}`]
  ]
  const items = []
  for (const [folder, set, cls] of sets) {
    const dir = join(ICONS_SVG, folder)
    if (!existsSync(dir)) continue
    for (const file of readdirSync(dir)
      .filter((f) => f.endsWith('.svg'))
      .sort()) {
      const name = file.slice(0, -4)
      items.push({ name, class: cls(name), set, keywords: iconKeywords(name) })
    }
  }
  return items
}

export function buildAssets(imports) {
  const items = {
    illustrations: objectKeys(ASSET_KINDS.illustrations.registry, 'illustrationAssets')
      .map(({ name }) => ({
        name,
        canvas: viewBoxOf(resolve(SRC, 'assets/illustrations', `${name}.svg`))
      }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    diagrams: objectKeys(ASSET_KINDS.diagrams.registry, 'diagrams')
      .map(({ name }) => ({
        name,
        label: quoted(
          readFileSync(resolve(SRC, 'assets/diagrams', `${name}.ts`), 'utf-8'),
          'ariaLabel'
        )
      }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    lineFigures: objectKeys(ASSET_KINDS.lineFigures.registry, 'lineFigures')
      .map(({ name }) => {
        const src = readFileSync(
          resolve(SRC, 'components/content/line-figure/figures', `${name}.ts`),
          'utf-8'
        )
        return {
          name,
          label: quoted(src, 'label', Math.max(0, src.indexOf('FigureDefinition = {')))
        }
      })
      .sort((a, b) => a.name.localeCompare(b.name)),
    brandMarks: (() => {
      const labels = new Map(
        objectKeys(ASSET_KINDS.brandMarks.registry, 'brandMarkLabels').map((e) => [e.name, e.value])
      )
      return objectKeys(ASSET_KINDS.brandMarks.registry, 'brandMarks')
        .map(({ name }) => ({ name, label: labels.get(name) ?? name }))
        .sort((a, b) => a.name.localeCompare(b.name))
    })(),
    icons: iconItems()
  }
  const graph = importGraph()
  const componentFiles = Object.entries(imports)
    .filter(([, e]) => e.kind === 'component' && e.target?.startsWith('./src/components/'))
    .map(([sub, e]) => [sub, resolve(PKG_ROOT, e.target)])
  const assets = {}
  for (const [kind, meta] of Object.entries(ASSET_KINDS)) {
    const { markers, registry, ...rest } = meta
    let usedBy
    if (markers) {
      const set = new Set(markers.map((m) => resolve(SRC, m)))
      usedBy = componentFiles.filter(([, file]) => reaches(graph, file, set)).map(([sub]) => sub)
    } else {
      usedBy = Object.entries(imports)
        .filter(([, e]) => e.kind === 'component' && (e.props || []).some(isIconProp))
        .map(([sub]) => sub)
    }
    assets[kind] = {
      ...rest,
      ...(registry ? { registry } : {}),
      usedBy: usedBy.sort(),
      count: items[kind].length,
      items: items[kind]
    }
  }
  return assets
}

export function isIconProp(prop) {
  return /^(icon|[a-z]+Icon)$/.test(prop.name) && /string/.test(prop.type)
}

function readPatternAliases(patterns) {
  const aliases = existsSync(V6_BLOCKS) ? JSON.parse(readFileSync(V6_BLOCKS, 'utf-8')) : {}
  const broken = []
  for (const [from, to] of Object.entries(aliases)) {
    const [id, variant] = to.split('#')
    const p = patterns[id]
    if (patterns[from.split('#')[0]]) broken.push(`${from}: old id still names a block`)
    else if (!p) broken.push(`${from} -> ${to}: no block "${id}"`)
    else if (variant && variant !== p.primary && !p.variants.some((v) => v.name === variant))
      broken.push(`${from} -> ${to}: block "${id}" has no variant "${variant}"`)
  }
  if (broken.length) throw new Error(`src/cli/migrations/v6-blocks.json:\n  ${broken.join('\n  ')}`)
  return Object.fromEntries(Object.entries(aliases).sort(([a], [b]) => a.localeCompare(b)))
}

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

  const grouped = {}
  for (const v of cssVars) {
    const name = v.slice(2)
    const seg = name.includes('-') ? name.slice(0, name.indexOf('-')) : name
    ;(grouped[seg] ||= []).push(v)
  }
  const groups = {}
  for (const k of Object.keys(grouped).sort()) groups[k] = grouped[k]

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

  const animationGuide = {}
  for (const name of animations) {
    animationGuide[name] = {
      value: themeAnimate[name] ?? null,
      useWhen: themeAnimateUseWhen[name] ?? null
    }
  }

  return { cssVars, typography, groups, animations, animationGuide }
}

export function splitCatalog(full) {
  const files = {}
  const patterns = {}
  for (const [id, p] of Object.entries(full.patterns)) {
    const file = `catalog/patterns/${id}.json`
    const part = {}
    const meta = {}
    for (const [k, v] of Object.entries(p)) {
      if (PATTERN_HEAVY_KEYS.includes(k)) part[k] = v
      else meta[k] = v
    }
    meta.variants = (p.variants || []).map((v) => ({ name: v.name, summary: v.summary }))
    meta.file = file
    patterns[id] = meta
    files[file] = part
  }
  const assets = {}
  for (const [kind, { items, ...meta }] of Object.entries(full.assets || {})) {
    const file = `${ASSET_PART_DIR}/${kind}.json`
    files[file] = { items }
    assets[kind] = { ...meta, file }
  }
  const imports = {}
  for (const [subpath, e] of Object.entries(full.imports)) {
    const meta = {}
    const prose = {}
    for (const [k, v] of Object.entries(e)) {
      if (k === 'examples') continue
      if (COMPONENT_PROSE_KEYS.includes(k)) prose[k] = v
      else meta[k] = v
    }
    if (e.examples) {
      const file = `catalog/examples/${subpath}.json`
      meta.examplesFile = file
      files[file] = { examples: e.examples }
    }
    if (Object.keys(prose).length) {
      const file = `catalog/components/${subpath}.json`
      meta.docsFile = file
      files[file] = prose
    }
    imports[subpath] = meta
  }
  return { catalog: { ...full, imports, assets, patterns }, files }
}

const serialize = (value) => JSON.stringify(value, null, 1) + '\n'

function listParts(dir, out = []) {
  if (!existsSync(dir)) return out
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) listParts(p, out)
    else out.push(relative(PKG_ROOT, p).split('\\').join('/'))
  }
  return out
}

function checkParts(catalog, files) {
  const drift = []
  const expected = { 'catalog.json': serialize(catalog) }
  for (const [file, part] of Object.entries(files)) expected[file] = serialize(part)
  for (const [file, text] of Object.entries(expected)) {
    const abs = resolve(PKG_ROOT, file)
    if (!existsSync(abs)) drift.push(`missing ${file}`)
    else if (readFileSync(abs, 'utf-8') !== text) drift.push(`stale ${file}`)
  }
  for (const file of listParts(PARTS_DIR)) if (!(file in expected)) drift.push(`extra ${file}`)
  return drift
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const full = await build()
  const missingDocs = missingComponentDocs(full.imports)
  if (missingDocs.length) {
    process.stderr.write(
      `✖ ${missingDocs.length} exported component(s) without agent docs in .specs/<name>.md:\n  ${missingDocs.join('\n  ')}\n` +
        'Every exported component needs ## Purpose, ## When to use and ## When NOT to use in its spec.\n'
    )
    process.exit(1)
  }
  const { catalog, files } = splitCatalog(full)
  const view = catalogView(catalog, (file) => JSON.parse(serialize(files[file])))
  const undocumented = undocumentedExports(view, buildLlms(view))
  if (undocumented.length) {
    process.stderr.write(
      `✖ ${undocumented.length} public export(s) missing from llms/components/:\n  ${undocumented.join('\n  ')}\n` +
        'Every component export needs its own page, and every sub-component and -root export must be listed on its compound page.\n'
    )
    process.exit(1)
  }
  if (process.argv.includes('--check')) {
    const drift = checkParts(catalog, files)
    if (drift.length) {
      process.stderr.write(
        `✖ catalog out of sync (${drift.length}):\n  ${drift.slice(0, 20).join('\n  ')}\nRun: pnpm --filter @aziontech/webkit catalog:build\n`
      )
      process.exit(1)
    }
    process.stdout.write(`✓ catalog.json and ${Object.keys(files).length} catalog/ files in sync\n`)
    process.exit(0)
  }
  rmSync(PARTS_DIR, { recursive: true, force: true })
  for (const [file, part] of Object.entries(files)) {
    const abs = resolve(PKG_ROOT, file)
    mkdirSync(dirname(abs), { recursive: true })
    writeFileSync(abs, serialize(part), 'utf-8')
  }
  writeFileSync(OUT_PATH, serialize(catalog), 'utf-8')
  const llms = writeLlms()
  const componentCount = Object.values(catalog.imports).filter((e) => e.kind === 'component').length
  process.stdout.write(
    `catalog.json written: ${Object.keys(catalog.imports).length} exports (${componentCount} components), ${Object.keys(catalog.patterns).length} patterns @ ${catalog.webkitVersion}; ${Object.keys(files).length} files in catalog/\n${llmsSummary(llms)}\n`
  )
}
