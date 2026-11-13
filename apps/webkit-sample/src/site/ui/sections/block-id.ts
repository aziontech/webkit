import type { PageSection } from './types'

const BLOCK_NAMES: Record<string, string> = {
  Heroes: 'hero',
  CompareCompetitors: 'comparison-table'
}

const DEFAULT_KINDS: Record<string, string> = {
  Heroes: 'centered-carousel',
  ClosingCallToAction: 'split',
  CodeSplit: 'default',
  FeatureTiles: 'artwork',
  MediaSplitStack: 'solutions'
}

const kebab = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

const hasCodeTab = (tabs: unknown) =>
  Array.isArray(tabs) && tabs.some((tab) => Boolean((tab as { code?: unknown })?.code))

const variantOf = (entry: PageSection) => {
  if (entry.section === 'FeatureTabs') return hasCodeTab(entry.tabs) ? 'code' : ''
  if (!(entry.section in DEFAULT_KINDS)) return ''
  const kind = typeof entry.kind === 'string' ? entry.kind : DEFAULT_KINDS[entry.section]
  return kind === 'default' ? '' : kind
}

const HERO_BLOCKS = new Set(['Heroes', 'HeroForm', 'HeroWithOpening'])

const TITLE_BAND_SIZES: Record<string, string> = {
  'title-band': 'large',
  'title-band-small': 'medium'
}

interface PropOption {
  type?: unknown
  default?: unknown
}

export type DeclaredProps = (section: string) => Record<string, PropOption | null> | undefined

const takesFunction = (type: unknown) =>
  type === Function || (Array.isArray(type) && type.includes(Function))

const defaultOf = (option: PropOption | null) => {
  if (!option || typeof option !== 'object' || !('default' in option)) return undefined
  const value = option.default
  if (typeof value !== 'function') return value
  return takesFunction(option.type) ? undefined : (value as () => unknown)()
}

const withDeclared = (entry: PageSection, declared: DeclaredProps): PageSection => {
  const options = declared(entry.section)
  if (!options) return entry
  const filled: Record<string, unknown> = {}
  for (const [key, option] of Object.entries(options)) {
    if (key in entry) filled[key] = entry[key]
    else {
      const value = defaultOf(option)
      if (value !== undefined && value !== null) filled[key] = value
    }
  }
  return { ...filled, ...entry }
}

export interface PageBlock {
  _id: string
  props: Record<string, unknown>
}

export const toBlock = (entry: PageSection): PageBlock => {
  const { section, gap: _gap, kind, ...rest } = entry
  const base = BLOCK_NAMES[section] ?? kebab(section)
  const variant = variantOf(entry)
  const titleBandSize = section === 'Heroes' ? TITLE_BAND_SIZES[variant] : undefined
  if (titleBandSize) return { _id: `${base}-title-band`, props: { size: titleBandSize, ...rest } }
  const props = section in DEFAULT_KINDS || kind === undefined ? rest : { kind, ...rest }
  return { _id: variant ? `${base}-${variant}` : base, props }
}

export const toPageJson = (sections: PageSection[], declared: DeclaredProps = () => undefined) => {
  const blocks = sections.map((entry) => ({ entry, block: toBlock(withDeclared(entry, declared)) }))
  return {
    hero: blocks.filter(({ entry }) => HERO_BLOCKS.has(entry.section)).map(({ block }) => block),
    sections: blocks.filter(({ entry }) => !HERO_BLOCKS.has(entry.section)).map(({ block }) => block)
  }
}
