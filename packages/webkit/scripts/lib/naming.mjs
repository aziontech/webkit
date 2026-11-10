import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'

export const MARKET_ALIASES = {
  'alert-dialog': 'dialog',
  breadcrumbs: 'breadcrumb',
  callout: 'alert',
  'command-palette': 'command',
  'data-table': 'table',
  datatable: 'table',
  keyboard: 'kbd',
  loader: 'spinner',
  modal: 'dialog',
  notification: 'toast',
  'segmented-control': 'toggle-group',
  sheet: 'drawer',
  snackbar: 'toast',
  steps: 'stepper',
  'text-field': 'input',
  tiles: 'radio-cards'
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

export function synonymMap(retired) {
  const map = { ...retired }
  for (const [name, to] of Object.entries(MARKET_ALIASES)) map[name] = to
  return map
}

export function buildAliases(subpaths, retired) {
  const exported = new Set(subpaths)
  const out = {}
  for (const [name, to] of Object.entries(synonymMap(retired)).sort(([a], [b]) =>
    a.localeCompare(b)
  )) {
    if (!exported.has(name) && exported.has(to)) out[name] = to
  }
  return out
}

function segmentProblem(segment) {
  if (DOC_FILE.test(segment)) return null
  const stem = segment.replace(/\.[a-z0-9]+$/, '')
  if (!KEBAB.test(stem)) return 'is not kebab-case'
  const foreign = stem.split('-').find((w) => NON_ENGLISH_WORDS.includes(w))
  if (foreign) return `uses the non-English word "${foreign}"`
  return null
}

export function checkSubpaths(subpaths) {
  const errors = []
  for (const sub of subpaths) {
    for (const segment of sub.split('/')) {
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
