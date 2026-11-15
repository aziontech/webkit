import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'

export const MARKET_ALIASES = {
  'alert-dialog': 'confirm-dialog',
  banner: 'alert',
  'blog-index': 'article-index',
  'bordered-box': 'frame-box',
  breadcrumbs: 'breadcrumb',
  callout: 'alert',
  'command-palette': 'command',
  comparison: 'compare-plans',
  'config-provider': 'webkit-provider',
  cta: 'closing-call-to-action',
  datatable: 'data-table',
  'feature-grid': 'capability-grid',
  'input-otp': 'otp-input',
  kebab: 'dropdown-menu',
  keyboard: 'kbd',
  loader: 'spinner',
  'locale-provider': 'webkit-provider',
  'logo-cloud': 'logo-wall',
  marquee: 'ticker',
  modal: 'dialog',
  newsletter: 'closing-call-to-action-newsletter',
  notice: 'alert',
  notification: 'toast',
  'segmented-control': 'toggle-group',
  sheet: 'drawer',
  snackbar: 'toast',
  stats: 'stats-band',
  steps: 'stepper',
  testimonial: 'client-quotes',
  testimonials: 'client-quotes',
  'text-field': 'input',
  tiles: 'radio-group',
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

export function buildRenamed(subpaths, retired) {
  const exported = new Set(subpaths)
  return Object.fromEntries(
    Object.entries(retired)
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
