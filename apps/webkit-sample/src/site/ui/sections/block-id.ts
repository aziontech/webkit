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

export interface PageBlock {
  _id: string
  props: Record<string, unknown>
}

export const toBlock = (entry: PageSection): PageBlock => {
  const { section, gap: _gap, kind, ...rest } = entry
  const base = BLOCK_NAMES[section] ?? kebab(section)
  const variant = variantOf(entry)
  const props = section in DEFAULT_KINDS || kind === undefined ? rest : { kind, ...rest }
  return { _id: variant ? `${base}-${variant}` : base, props }
}

export const toPageJson = (sections: PageSection[]) => ({
  hero: sections.filter((entry) => HERO_BLOCKS.has(entry.section)).map(toBlock),
  sections: sections.filter((entry) => !HERO_BLOCKS.has(entry.section)).map(toBlock)
})
