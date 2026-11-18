import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'

export const MARKET_ALIASES = {
  'alert-dialog': 'confirm-dialog',
  banner: 'alert',
  'blog-index': 'article-index-section',
  'bordered-box': 'registration-frame',
  breadcrumbs: 'breadcrumb',
  callout: 'alert',
  'command-palette': 'command',
  cta: 'call-to-action',
  datatable: 'data-table',
  'doc-tab': 'tabs',
  'doc-tabs': 'tabs',
  'feature-grid': 'capability-grid-section',
  'file-viewer': 'file-preview',
  'image-viewer': 'file-preview',
  'input-otp': 'otp-input',
  kebab: 'dropdown-menu',
  keyboard: 'kbd',
  loader: 'spinner',
  'locale-provider': 'config-provider',
  'logo-cloud': 'logo-wall',
  modal: 'dialog',
  newsletter: 'newsletter-section',
  'node-diagram': 'flow-diagram',
  notice: 'alert',
  notification: 'toast',
  'segmented-control': 'toggle-group',
  sheet: 'drawer',
  snackbar: 'toast',
  steps: 'stepper',
  testimonial: 'client-quotes-section',
  testimonials: 'client-quotes-section',
  'text-field': 'input',
  transfer: 'transfer-list'
}

export const NON_ENGLISH_WORDS = [
  'botao',
  'cabecalho',
  'cadastro',
  'cartao',
  'configuracoes',
  'formulario',
  'janela',
  'lista',
  'pagina',
  'rodape',
  'senha',
  'tabela',
  'tela',
  'usuario'
]

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/
const DOC_FILE = /^[A-Z][A-Z0-9_]*\.md$/

export function retiredNames(migration) {
  return Object.fromEntries(
    Object.entries(migration?.components || {}).map(([from, spec]) => [from, spec.to])
  )
}

export function buildAliases(subpaths) {
  const exported = new Set(subpaths)
  const out = {}
  for (const [name, to] of Object.entries(MARKET_ALIASES).sort(([a], [b]) => a.localeCompare(b))) {
    if (!exported.has(name) && exported.has(to)) out[name] = to
  }
  return out
}

export function removedNames(subpaths, migration) {
  const exported = new Set(subpaths)
  return Object.fromEntries(
    Object.entries(migration?.removed || {})
      .filter(([from]) => !exported.has(from))
      .sort(([a], [b]) => a.localeCompare(b))
  )
}

export const RENAMED_OVERRIDES = {
  menu: null,
  'radio-button': 'radio-group'
}

export function buildRenamed(subpaths, retired) {
  const exported = new Set(subpaths)
  return Object.fromEntries(
    Object.entries(retired)
      .map(([from, to]) => [from, from in RENAMED_OVERRIDES ? RENAMED_OVERRIDES[from] : to])
      .filter(([, to]) => to !== null)
      .filter(([from, to]) => !exported.has(from) && exported.has(to))
      .sort(([a], [b]) => a.localeCompare(b))
  )
}

function segmentProblem(segment) {
  if (DOC_FILE.test(segment)) return null
  const stem = segment.replace(/\.[a-z0-9]+$/, '')
  if (!KEBAB.test(stem)) return 'is not kebab-case'
  const foreign = stem.split('-').find((w) => NON_ENGLISH_WORDS.includes(w))
  if (foreign) return `uses the non-English word "${foreign}"`
  return null
}

const LOCALE_TAG = /^[a-z]{2,3}(-[A-Z]{2})?$/

export function checkSubpaths(subpaths) {
  const errors = []
  for (const sub of subpaths) {
    const segments = sub.split('/')
    for (const [i, segment] of segments.entries()) {
      if (i === 1 && segments[0] === 'locales' && LOCALE_TAG.test(segment)) continue
      const problem = segmentProblem(segment)
      if (problem) errors.push(`export "./${sub}": segment "${segment}" ${problem}`)
    }
  }
  return errors
}

export function checkBlocks(blocks) {
  const errors = []
  for (const { folder, id } of blocks) {
    if (id !== folder)
      errors.push(`blocks/${folder}/block.json: id "${id}" does not match its folder`)
    for (const segment of folder.split('/')) {
      const problem = segmentProblem(segment)
      if (problem) errors.push(`block "${folder}": segment "${segment}" ${problem}`)
    }
  }
  return errors
}

export function checkSynonyms(subpaths, retired) {
  const exported = new Set(subpaths)
  const errors = []
  for (const [from, to] of Object.entries(retired)) {
    if (exported.has(from))
      errors.push(`export "./${from}" was retired in v6 (now "${to}") and must not come back`)
  }
  for (const [name, to] of Object.entries(MARKET_ALIASES)) {
    if (exported.has(name) && exported.has(to))
      errors.push(`export "./${name}" is a synonym of the export "./${to}"`)
    else if (exported.has(name))
      errors.push(`export "./${name}" is a market alias of "${to}"; name the export "${to}"`)
    else if (!exported.has(to))
      errors.push(`alias "${name}" points at "${to}", which is not an export`)
  }
  for (const [from, to] of Object.entries(retired)) {
    if (!exported.has(to))
      errors.push(`retired "${from}" points at "${to}", which is not an export`)
  }
  return errors
}

export function readBlockIds(blocksRoot) {
  const out = []
  const walk = (dir) => {
    if (!existsSync(dir)) return
    for (const e of readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
      a.name.localeCompare(b.name)
    )) {
      if (!e.isDirectory()) continue
      const sub = join(dir, e.name)
      const file = join(sub, 'block.json')
      if (existsSync(file)) {
        const folder = relative(blocksRoot, sub).split('\\').join('/')
        out.push({ folder, id: JSON.parse(readFileSync(file, 'utf8')).id })
      } else walk(sub)
    }
  }
  walk(blocksRoot)
  return out
}

const pascalCase = (kebab) =>
  kebab
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('')

export function suiteName({ dir, stem, vueSource, hasModule }) {
  if (vueSource !== null)
    return (
      vueSource.match(/defineOptions\(\s*\{[^}]*?name:\s*['"]([^'"]+)['"]/s)?.[1] ??
      pascalCase(stem)
    )
  if (hasModule) {
    const name = pascalCase(stem)
    return name.charAt(0).toLowerCase() + name.slice(1)
  }
  return pascalCase(dir.split('/').at(-1))
}

export function topLevelSuites(source) {
  return [...source.matchAll(/^describe\b(\S*)\((['"`])((?:\\.|(?!\2).)*)\2/gm)].map((m) =>
    m[3].replace(/\\(.)/g, '$1')
  )
}

export function checkSuites(suites) {
  const errors = []
  for (const { file, expected, titles } of suites) {
    if (titles.length === 1 && titles[0] === expected) continue
    const found = titles.map((t) => `"${t}"`).join(', ') || 'none'
    errors.push(
      `${file}: one top-level describe named "${expected}" expected, found ${found}; nest the scenarios inside it`
    )
  }
  return errors
}

export function readSuites(packageRoot) {
  const out = []
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
      a.name.localeCompare(b.name)
    )) {
      const path = join(dir, e.name)
      if (e.isDirectory()) walk(path)
      else if (e.name.endsWith('.test.ts')) {
        const stem = e.name.slice(0, -'.test.ts'.length)
        const vue = join(dir, `${stem}.vue`)
        const rel = relative(packageRoot, dir).split('\\').join('/')
        out.push({
          file: `${rel}/${e.name}`,
          expected: suiteName({
            dir: rel,
            stem,
            vueSource: existsSync(vue) ? readFileSync(vue, 'utf8') : null,
            hasModule: existsSync(join(dir, `${stem}.ts`))
          }),
          titles: topLevelSuites(readFileSync(path, 'utf8'))
        })
      }
    }
  }
  walk(join(packageRoot, 'src/components'))
  return out
}
