import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const APP = resolve(dirname(fileURLToPath(import.meta.url)), '..')
export const REPO = resolve(APP, '../..')
export const WEBKIT = join(REPO, 'packages/webkit')
export const THEME = join(REPO, 'packages/theme')
export const CATALOG = join(WEBKIT, 'catalog.json')
export const SPECS = join(REPO, '.specs')
export const LLMS = join(WEBKIT, 'llms')
export const SITE_ASSETS = join(WEBKIT, 'src/assets/site-assets.json')

export function siteAssets(): Record<string, string> {
  if (!existsSync(SITE_ASSETS)) return {}
  const table = JSON.parse(readFileSync(SITE_ASSETS, 'utf8')) as Record<string, string>
  const exportsMap = JSON.parse(readFileSync(join(WEBKIT, 'package.json'), 'utf8'))
    .exports as Record<string, string>
  const out: Record<string, string> = {}
  for (const [url, specifier] of Object.entries(table)) {
    const file = exportsMap[specifier.replace('@aziontech/webkit/', './')]
    if (file && existsSync(join(WEBKIT, file))) out[url] = join(WEBKIT, file)
  }
  return out
}

export function walk(dir: string, match: (name: string) => boolean, out: string[] = []): string[] {
  if (!existsSync(dir)) return out
  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name)
  )) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) walk(path, match, out)
    else if (match(entry.name)) out.push(path)
  }
  return out
}

export type BlockVariant = { name: string; file: string; slug: string }
export type BlockManifest = {
  id: string
  name: string
  title?: string
  surface?: string
  summary?: string
  intents?: string[]
  primary: { name: string; file: string }
  variants?: { name: string; file: string }[]
  preview?: { layout?: string; background?: string }
}

export function slugify(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function readBlocks(): (BlockManifest & { dir: string; states: BlockVariant[] })[] {
  return walk(join(WEBKIT, 'blocks'), (name) => name === 'block.json').map((file) => {
    const manifest = JSON.parse(readFileSync(file, 'utf8')) as BlockManifest
    const dir = relative(join(WEBKIT, 'blocks'), dirname(file))
    const states = [manifest.primary, ...(manifest.variants ?? [])].map((state) => ({
      ...state,
      slug: slugify(state.name)
    }))
    return { ...manifest, id: manifest.id ?? dir, dir, states }
  })
}

export type CatalogEntry = {
  import: string
  kind: string
  category?: string
  surface?: string
  purpose?: string
  parent?: string
  subcomponents?: string[]
  examplesFile?: string
  docsFile?: string
  [key: string]: unknown
}

export type Catalog = {
  imports: Record<string, CatalogEntry>
  tokens: {
    typography: string[]
    animationGuide: Record<string, { value: string; useWhen: string }>
  }
  [key: string]: unknown
}

let catalogCache: { mtime: number; data: Catalog } | null = null

export function readCatalog(): Catalog {
  const mtime = statSync(CATALOG).mtimeMs
  if (catalogCache?.mtime !== mtime) {
    const data = JSON.parse(readFileSync(CATALOG, 'utf8')) as Catalog
    for (const entry of Object.values(data.imports)) {
      if (!entry.docsFile) continue
      Object.assign(entry, JSON.parse(readFileSync(join(WEBKIT, entry.docsFile), 'utf8')))
      delete entry.docsFile
    }
    catalogCache = { mtime, data }
  }
  return catalogCache.data
}

export function componentNames(catalog: Catalog): string[] {
  return Object.entries(catalog.imports)
    .filter(([, entry]) => entry.kind === 'component')
    .map(([name]) => name)
    .sort()
}
