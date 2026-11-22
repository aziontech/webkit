import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..')

const MANIFEST_PATH = join(ROOT, 'src/icons.json')
const SVG_ROOT = join(ROOT, 'src/svg-raw')
export const MONO_DIR = join(SVG_ROOT, 'az')
export const COLOR_DIR = join(SVG_ROOT, 'az-color')

export const PREFIX = 'az'
export const COLOR_BASE = 'az-color'

export function loadManifest() {
  return JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'))
}

export const glyphName = (entry) => `${PREFIX}-${entry.name}`

export const classOf = (entry) =>
  `${entry.set === 'color' ? COLOR_BASE : PREFIX} ${glyphName(entry)}`

export function describe(entry, manifest) {
  const group = manifest.groups[entry.group]
  const out = {
    group: entry.group,
    groupTitle: group.title,
    category: entry.category,
    categoryTitle: group.categories[entry.category].title,
    shows: entry.shows,
    means: entry.means,
    status: entry.status,
    legacy: entry.legacy
  }
  if (entry.product) out.product = entry.product
  if (entry.issue) out.issue = entry.issue
  return out
}
