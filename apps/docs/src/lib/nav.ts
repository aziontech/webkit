import { index } from './data'
import { FOUNDATIONS } from './foundations'

export type NavGroup = { label: string; items: { label: string; to: string }[] }

const CATEGORY_ORDER = [
  'actions',
  'inputs',
  'data',
  'feedback',
  'navigation',
  'overlay',
  'layout',
  'content',
  'chart',
  'code',
  'ai',
  'utils',
  'documentation',
  'marketing',
  'sections'
]

export const CATEGORY_LEADS: Record<string, string> = {
  actions:
    'Buttons and triggers: the controls that start a task, confirm a choice or fire a command.',
  inputs: 'Fields and controls: how people enter, pick and toggle values in a form.',
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
  utils: 'Providers and helpers that set locale, direction and context for the rest.',
  documentation: 'Doc page chrome: headers, callouts, steps, cards and on-this-page navigation.',
  marketing: 'Marketing building blocks: heroes, grids, columns and the page frame.',
  sections: 'Whole marketing page sections, each named by the id a page writes in its sections.',
  scenes: 'Illustrated scenes for the marketing site.'
}

export function titleCase(value: string): string {
  return value
    .split(/[-/ ]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function componentGroups(): NavGroup[] {
  const groups = new Map<string, NavGroup['items']>()
  for (const item of index.components) {
    const list = groups.get(item.category) ?? []
    list.push({ label: item.title, to: `/components/${item.name}` })
    groups.set(item.category, list)
  }
  const rank = (category: string) => {
    const at = CATEGORY_ORDER.indexOf(category)
    return at === -1 ? CATEGORY_ORDER.length : at
  }
  return [...groups.entries()]
    .sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b))
    .map(([category, items]) => ({
      label: titleCase(category),
      items: items.sort((a, b) => a.label.localeCompare(b.label))
    }))
}

export function blockGroups(): NavGroup[] {
  const groups = new Map<string, NavGroup['items']>()
  for (const block of index.blocks) {
    const list = groups.get(block.group) ?? []
    list.push({ label: block.title, to: `/blocks/${block.id}` })
    groups.set(block.group, list)
  }
  return [...groups.entries()].map(([group, items]) => ({
    label: titleCase(group.replace(/^platform\//, '')),
    items
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
  lineFigures: string
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
        { label: labels.lineFigures, to: '/assets#line-figures' },
        { label: labels.icons, to: '/foundations/icons' }
      ]
    }
  ]
}
