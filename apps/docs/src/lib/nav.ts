import { index } from './data'
import { FOUNDATIONS } from './foundations'
import { groupLabel, titleCase } from './words'

export { groupLabel, titleCase, tokenGroupTitle } from './words'

export type NavItem = { label: string; to: string; preview?: boolean }
export type NavGroup = { id?: string; label: string; items: NavItem[] }

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
    'Structure and shells: app frames, the marketing page frame (container, module, spacer), dividers, scroll areas and panes.',
  content: 'Status and identity: tags, badges, avatars, cards and the pieces that describe things.',
  chart: 'Charts and figures: series, totals and trends drawn from the chart palette.',
  code: 'Source and log surfaces: code blocks and log views for monospaced content.',
  ai: 'Conversation pieces: messages, prompts, reasoning, sources and tool calls.',
  provider: 'Providers that set locale, direction and context for the rest.',
  docs: 'Documentation site pieces: page chrome, callouts, steps, cards and the table of contents.',
  marketing:
    'Marketing site pieces you compose by hand: heroes, quotes, stats, media and the page renderer.',
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

export function componentGroups(): NavGroup[] {
  const groups = new Map<string, NavGroup['items']>()
  for (const item of index.components) {
    const list = groups.get(item.category) ?? []
    list.push({
      label: item.title,
      to: `/components/${item.name}`,
      ...(item.stability === 'preview' ? { preview: true } : {})
    })
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
    list.push({
      label: block.title,
      to: `/blocks/${block.id}`,
      ...(block.stability === 'preview' ? { preview: true } : {})
    })
    groups.set(block.group, list)
  }
  return [...groups.entries()].map(([group, items]) => ({
    label: groupLabel(group),
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
        { label: labels.icons, to: '/assets/icons' }
      ]
    }
  ]
}
