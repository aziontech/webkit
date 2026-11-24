import type {
  ConsoleLayoutNavGroup,
  ConsoleLayoutNavItem
} from '@aziontech/webkit/console-layout-root'
import { reactive } from 'vue'

import { sampleHistory, sampleHistoryNow } from '../blocks/ai-chat.sample'

const SOON = 'Soon'

const leadsSomewhere = (item: ConsoleLayoutNavItem): boolean =>
  Boolean(item.href) ||
  (item.groups ?? []).some((group) => group.items.some(leadsSomewhere)) ||
  (item.children ?? []).some(leadsSomewhere)

const markPageless = (item: ConsoleLayoutNavItem): ConsoleLayoutNavItem => {
  if (!leadsSomewhere(item))
    return { ...item, disabled: true, tagValue: SOON, type: undefined, groups: undefined }
  return {
    ...item,
    groups: item.groups?.map((group) => ({ ...group, items: group.items.map(markPageless) })),
    children: item.children?.map(markPageless)
  }
}

const DAY = 86_400_000

function copilotGroups(): ConsoleLayoutNavGroup[] {
  const now = new Date(sampleHistoryNow).getTime()
  const today = new Date(sampleHistoryNow).setHours(0, 0, 0, 0)
  const buckets: { label: string; test: (at: number) => boolean }[] = [
    { label: 'Today', test: (at) => at >= today },
    { label: 'Yesterday', test: (at) => at >= today - DAY },
    { label: 'Previous 7 days', test: (at) => at >= now - 7 * DAY },
    { label: 'Previous 30 days', test: (at) => at >= now - 30 * DAY },
    { label: 'Older', test: () => true }
  ]
  const groups: ConsoleLayoutNavGroup[] = [
    { items: [{ id: 'copilot-new', label: 'New chat', icon: 'az az-square-pen', href: '/assistant' }] }
  ]
  const left = [...sampleHistory]
  for (const bucket of buckets) {
    const items = left.filter((chat) => bucket.test(new Date(chat.updatedAt).getTime()))
    if (!items.length) continue
    for (const chat of items) left.splice(left.indexOf(chat), 1)
    groups.push({
      label: bucket.label,
      items: items.map((chat) => ({ id: `chat-${chat.id}`, label: chat.title, href: `/assistant/c/${chat.id}` }))
    })
  }
  return groups
}

const tree: ConsoleLayoutNavGroup[] = [
  {
    items: [
      { id: 'home', label: 'Home', icon: 'az az-home', href: '/onboarding' },
      {
        id: 'copilot',
        label: 'AI Copilot',
        icon: 'az az-ask-azion',
        type: 'drill',
        groups: copilotGroups()
      },
      { id: 'projects', label: 'Projects', icon: 'az az-folder' },
      { id: 'deployments', label: 'Deployments', icon: 'az az-cloud-upload' }
    ]
  },
  {
    label: 'Build',
    items: [
      { id: 'resources', label: 'Resources', icon: 'az az-box', href: '/resources' },
      { id: 'services', label: 'Services', icon: 'az az-server' },
      { id: 'variables', label: 'Variables', icon: 'az az-sliders-horizontal' },
      { id: 'integrations', label: 'Integrations', icon: 'az az-link' },
      { id: 'templates', label: 'Templates', icon: 'az az-copy' }
    ]
  },
  {
    label: 'Security',
    items: [
      { id: 'domains', label: 'Domains', icon: 'az az-globe' },
      { id: 'policies', label: 'Policies', icon: 'az az-shield' },
      { id: 'rule-sets', label: 'Rule sets', icon: 'az az-list' },
      { id: 'keys', label: 'Keys', icon: 'az az-key' }
    ]
  },
  {
    label: 'Data',
    items: [
      { id: 'databases', label: 'Databases', icon: 'az az-database' },
      { id: 'storage', label: 'Storage', icon: 'az az-inbox' }
    ]
  },
  {
    label: 'Observability',
    items: [
      { id: 'logs', label: 'Logs', icon: 'az az-file' },
      {
        id: 'metrics-module',
        label: 'Metrics',
        icon: 'az az-chart-bar',
        type: 'drill',
        groups: [
          { items: [{ id: 'metrics', label: 'Overview' }] },
          {
            label: 'Build',
            items: [
              { id: 'metrics-resources', label: 'Resources' },
              { id: 'metrics-services', label: 'Services' },
              { id: 'metrics-cache', label: 'Cache' }
            ]
          },
          {
            label: 'Security',
            items: [
              { id: 'metrics-domains', label: 'Domains' },
              { id: 'metrics-policies', label: 'Policies' },
              { id: 'metrics-rule-sets', label: 'Rule sets' }
            ]
          },
          {
            label: 'Data',
            items: [
              { id: 'metrics-databases', label: 'Databases' },
              { id: 'metrics-storage', label: 'Storage' }
            ]
          }
        ]
      },
      { id: 'events', label: 'Events', icon: 'az az-bolt' }
    ]
  },
  {
    label: 'More',
    items: [
      { id: 'catalog', label: 'Catalog', icon: 'az az-layout-grid' },
      {
        id: 'settings',
        label: 'Settings',
        icon: 'az az-settings',
        type: 'drill',
        groups: [
          {
            label: 'Settings',
            items: [
              { id: 'settings-general', label: 'General', href: '/settings' },
              { id: 'settings-build-deployment', label: 'Build and deployment' },
              { id: 'settings-environments', label: 'Environments' },
              { id: 'settings-users', label: 'Users management' },
              { id: 'settings-teams', label: 'Teams and permissions' },
              { id: 'settings-ai-keys', label: 'AI provider keys', href: '/settings/ai-keys' }
            ]
          },
          {
            label: 'Access',
            items: [
              { id: 'settings-tokens', label: 'Personal tokens' },
              { id: 'settings-credentials', label: 'Credentials' },
              { id: 'settings-security-mfa', label: 'Multi-factor auth' },
              { id: 'settings-security-sessions', label: 'Active sessions' },
              { id: 'settings-activity', label: 'Activity history' }
            ]
          },
          {
            label: 'Billing',
            items: [
              { id: 'settings-billing', label: 'Billing and plan' },
              { id: 'settings-invoices', label: 'Invoices' }
            ]
          }
        ]
      }
    ]
  }
]

export const navigation: ConsoleLayoutNavGroup[] = tree.map((group) => ({
  ...group,
  items: group.items.map(markPageless)
}))

export const account = reactive({ name: 'Amy Chen', email: 'amy.chen@example.com' })
