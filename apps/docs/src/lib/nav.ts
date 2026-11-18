import { index } from './data'
import { FOUNDATIONS } from './foundations'

export type NavGroup = { id?: string; label: string; items: { label: string; to: string }[] }

const CATEGORY_ORDER = [
  'action',
  'input',
  'data',
  'feedback',
  'navigation',
  'overlay',
  'layout',
  'content',
  'chart',
  'code',
  'ai',
  'provider',
  'docs',
  'marketing',
  'section'
]

export const CATEGORY_LEADS: Record<string, string> = {
  action:
    'Buttons and triggers: the controls that start a task, confirm a choice or fire a command.',
  input: 'Fields and controls: how people enter, pick and toggle values in a form.',
  data: 'Tables and display: structured records and the surfaces that present them.',
  feedback: 'Messages and progress: how the interface reports what happened and what is happening.',
  navigation: 'Wayfinding and menus: breadcrumbs, tabs and menus that move people around.',
  overlay:
    'Layered, floating surfaces: dialogs, drawers, popovers, tooltips and menus above the page.',
  layout:
    'Structure and shells: the frames, dividers, scroll areas and panes that hold a page together.',
  content: 'Status and identity: tags, badges, avatars, cards and the pieces that describe things.',
  chart: 'Charts and figures: series, totals and trends drawn from the chart palette.',
  code: 'Source and log surfaces: code blocks and log views for monospaced content.',
  ai: 'Conversation pieces: messages, prompts, reasoning, sources and tool calls.',
  provider: 'Providers that set locale, direction and context for the rest.',
  docs: 'Documentation site pieces: page chrome, callouts, steps, cards and the table of contents.',
  marketing:
    'Marketing site pieces you compose by hand: heroes, bands, quotes, media and the page frame.',
  section: 'Ready marketing page sections, each named by the id a page writes in its sections.',
  scenes: 'Illustrated scenes for the marketing site.'
}

const CATEGORY_LABELS: Record<string, string> = {
  action: 'Actions',
  ai: 'AI',
  chart: 'Charts',
  docs: 'Docs',
  input: 'Inputs',
  provider: 'Providers',
  section: 'Page sections'
}

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? titleCase(category)
}

export function titleCase(value: string): string {
  return value
    .split(/[-/ ]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

const GROUP_WORDS: Record<string, { word: string; at: 'start' | 'end' }> = {
  docs: { word: 'Doc', at: 'start' },
  section: { word: 'Section', at: 'end' }
}

const ACRONYMS: Record<string, string> = {
  ai: 'AI',
  cli: 'CLI',
  dns: 'DNS',
  faq: 'FAQ',
  mfa: 'MFA',
  waf: 'WAF'
}

function words(value: string): string[] {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((word) => ACRONYMS[word.toLowerCase()] ?? word)
}

export function labelInGroup(title: string, group: string): string {
  const parts = words(title)
  const rule = GROUP_WORDS[group]
  const drop = rule ? [rule.word] : words(titleCase(group))
  const at = rule?.at ?? 'start'
  const head = at === 'start' ? parts.slice(0, drop.length) : parts.slice(-drop.length)
  const same =
    head.length === drop.length && head.every((w, i) => w.toLowerCase() === drop[i].toLowerCase())
  if (!same || parts.length === drop.length) return parts.join(' ')
  const rest = at === 'start' ? parts.slice(drop.length) : parts.slice(0, -drop.length)
  return rest.join(' ')
}

export function componentGroups(): NavGroup[] {
  const groups = new Map<string, NavGroup['items']>()
  for (const item of index.components) {
    const list = groups.get(item.category) ?? []
    const label = GROUP_WORDS[item.category] ? labelInGroup(item.title, item.category) : item.title
    list.push({ label, to: `/components/${item.name}` })
    groups.set(item.category, list)
  }
  const rank = (category: string) => {
    const at = CATEGORY_ORDER.indexOf(category)
    return at === -1 ? CATEGORY_ORDER.length : at
  }
  return [...groups.entries()]
    .sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b))
    .map(([category, items]) => ({
      id: category,
      label: categoryLabel(category),
      items: items.sort((a, b) => a.label.localeCompare(b.label))
    }))
}

export function blockGroups(): NavGroup[] {
  const groups = new Map<string, NavGroup['items']>()
  for (const block of index.blocks) {
    const list = groups.get(block.group) ?? []
    list.push({ label: labelInGroup(block.title, block.group), to: `/blocks/${block.id}` })
    groups.set(block.group, list)
  }
  return [...groups.entries()].map(([group, items]) => ({
    label: words(titleCase(group)).join(' '),
    items: items.sort((a, b) => a.label.localeCompare(b.label))
  }))
}

export function foundationGroups(labels: {
  start: string
  home: string
  gettingStarted: string
  foundations: string
  assets: string
  brand: string
  illustrations: string
  icons: string
}): NavGroup[] {
  return [
    {
      label: labels.start,
      items: [
        { label: labels.home, to: '/' },
        { label: labels.gettingStarted, to: '/foundations/getting-started' }
      ]
    },
    {
      label: labels.foundations,
      items: FOUNDATIONS.filter((page) => page.slug !== 'getting-started').map((page) => ({
        label: page.title,
        to: `/foundations/${page.slug}`
      }))
    },
    {
      label: labels.assets,
      items: [
        { label: labels.brand, to: '/assets#brand' },
        { label: labels.illustrations, to: '/assets#illustrations' },
        { label: labels.icons, to: '/foundations/icon' }
      ]
    }
  ]
}
