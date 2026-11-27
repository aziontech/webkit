import type { ConsoleLayoutAccount, ConsoleLayoutNavGroup } from '@aziontech/ui/console-layout-root'
import type { TagSeverity, TagVariant } from '@aziontech/ui/tag'

import type { ShellConsoleRecent } from './shell-console.vue'

export const sampleNavigation: ConsoleLayoutNavGroup[] = [
  {
    items: [
      { id: 'overview', label: 'Overview', icon: 'az az-home', href: '/' },
      { id: 'workloads', label: 'Workloads', icon: 'az az-workloads', href: '/workloads' },
      {
        id: 'deployments',
        label: 'Deployments',
        icon: 'az az-deploy-pillar',
        href: '/deployments'
      }
    ]
  },
  {
    label: 'Build',
    items: [
      {
        id: 'applications',
        label: 'Applications',
        icon: 'az az-applications',
        href: '/applications'
      },
      { id: 'functions', label: 'Functions', icon: 'az az-functions', href: '/functions' },
      { id: 'variables', label: 'Variables', icon: 'az az-variables', href: '/variables' },
      {
        id: 'connectors',
        label: 'Connectors',
        icon: 'az az-connectors',
        href: '/connectors'
      },
      {
        id: 'custom-pages',
        label: 'Custom Pages',
        icon: 'az az-custom-pages',
        href: '/custom-pages'
      }
    ]
  },
  {
    label: 'Secure',
    items: [
      { id: 'firewall', label: 'Firewall', icon: 'az az-firewall', href: '/firewall' },
      { id: 'edge-dns', label: 'Edge DNS', icon: 'az az-edge-dns', href: '/edge-dns' },
      { id: 'waf-rules', label: 'WAF Rules', icon: 'az az-waf', href: '/waf-rules' },
      {
        id: 'certificate-manager',
        label: 'Certificate Manager',
        icon: 'az az-certificate-manager',
        href: '/certificate-manager'
      },
      {
        id: 'network-lists',
        label: 'Network Lists',
        icon: 'az az-network-lists',
        href: '/network-lists'
      }
    ]
  },
  {
    label: 'Store',
    items: [
      {
        id: 'object-storage',
        label: 'Object Storage',
        icon: 'az az-object-storage',
        href: '/object-storage'
      },
      {
        id: 'sql-database',
        label: 'SQL Database',
        icon: 'az az-sql-database',
        href: '/sql-database',
        tagValue: 'Preview'
      }
    ]
  },
  {
    label: 'Observe',
    items: [
      {
        id: 'data-stream',
        label: 'Data Stream',
        icon: 'az az-data-stream',
        href: '/data-stream'
      },
      { id: 'edge-pulse', label: 'Edge Pulse', icon: 'az az-edge-pulse', href: '/edge-pulse' },
      {
        id: 'real-time-metrics',
        label: 'Real-Time Metrics',
        icon: 'az az-real-time-metrics',
        href: '/real-time-metrics'
      },
      {
        id: 'real-time-events',
        label: 'Real-Time Events',
        icon: 'az az-real-time-events',
        href: '/real-time-events'
      },
      {
        id: 'real-time-purge',
        label: 'Real-Time Purge',
        icon: 'az az-real-time-purge',
        href: '/real-time-purge'
      }
    ]
  },
  {
    label: 'More',
    items: [
      {
        id: 'marketplace',
        label: 'Marketplace',
        icon: 'az az-marketplace',
        href: '/marketplace'
      },
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
              {
                id: 'settings-build',
                label: 'Build and deployment',
                href: '/settings/build-deployment'
              },
              {
                id: 'settings-environments',
                label: 'Environments',
                href: '/settings/environments'
              },
              { id: 'settings-users', label: 'Users management', href: '/settings/users' },
              { id: 'settings-teams', label: 'Teams and permissions', href: '/settings/teams' }
            ]
          },
          {
            label: 'Access',
            items: [
              { id: 'settings-tokens', label: 'Personal tokens', href: '/settings/tokens' },
              { id: 'settings-credentials', label: 'Credentials', href: '/settings/credentials' },
              { id: 'settings-mfa', label: 'Multi-factor auth', href: '/settings/mfa' },
              { id: 'settings-sessions', label: 'Active sessions', href: '/settings/sessions' },
              { id: 'settings-activity', label: 'Activity history', href: '/settings/activity' }
            ]
          },
          {
            label: 'Billing',
            items: [
              { id: 'settings-billing', label: 'Billing and plan', href: '/settings/billing' },
              { id: 'settings-invoices', label: 'Invoices', href: '/settings/invoices' }
            ]
          }
        ]
      }
    ]
  }
]

export const sampleAccount: ConsoleLayoutAccount = {
  name: 'Amy Chen',
  email: 'amy.chen@example.com'
}

export const sampleRecents: ShellConsoleRecent[] = [
  { id: 'azion-site', label: 'azion-site', icon: 'az az-applications', type: 'Application' },
  { id: 'edge-auth', label: 'edge-auth', icon: 'az az-functions', type: 'Function' },
  { id: 'shop-assets', label: 'shop-assets', icon: 'az az-object-storage', type: 'Bucket' }
]

/** The level of an account in the account tree. */
export type ShellConsoleAccountType = 'organization' | 'group' | 'workspace'

/** How the account switch draws one account level. */
export interface ShellConsoleAccountTypeMeta {
  /** The level's name. */
  label: string
  /** Icon class of the level. */
  icon: string
  /** Tag severity of the level. */
  severity?: TagSeverity
  /** Tag variant of the level. */
  variant?: TagVariant
}

/** One account the account switch lists. */
export interface ShellConsoleSwitchAccount {
  /** Account ID. */
  id: string
  /** Client ID. */
  clientId: string
  /** Account name. */
  name: string
  /** Level in the tree. */
  type: ShellConsoleAccountType
  /** The parent account, or null for a root. */
  parentId: string | null
}

export const sampleAccountTypes: Record<ShellConsoleAccountType, ShellConsoleAccountTypeMeta> = {
  organization: { label: 'Organization', icon: 'az az-building', variant: 'primary' },
  group: { label: 'Group', icon: 'az az-users', severity: 'info' },
  workspace: { label: 'Workspace', icon: 'az az-layout-grid', severity: 'neutral' }
}

export const sampleSwitchAccounts: ShellConsoleSwitchAccount[] = [
  {
    id: '1001',
    clientId: '7f3a1',
    name: 'Acme Inc.',
    type: 'organization',
    parentId: null
  },
  { id: '1140', clientId: '7f3b9', name: 'Retail', type: 'group', parentId: '1001' },
  { id: '2201', clientId: '8a0c2', name: 'Storefront EU', type: 'workspace', parentId: '1140' },
  { id: '2202', clientId: '8a0c7', name: 'Storefront US', type: 'workspace', parentId: '1140' },
  { id: '1150', clientId: '7f3c4', name: 'Media', type: 'group', parentId: '1001' },
  { id: '2310', clientId: '8b114', name: 'Video platform', type: 'workspace', parentId: '1150' },
  { id: '3001', clientId: '9c201', name: 'Acme Labs', type: 'organization', parentId: null },
  { id: '3105', clientId: '9c2e8', name: 'Research', type: 'workspace', parentId: '3001' }
]

/** What a notification reports. */
export type ShellConsoleNotificationKind = 'deploy-failed' | 'deploy-succeeded' | 'info'

/** One entry of the notification list. */
export interface ShellConsoleNotification {
  /** Stable key. */
  id: string
  /** What it reports, which picks its icon. */
  kind: ShellConsoleNotificationKind
  /** The headline. */
  title: string
  /** One sentence of detail. */
  description: string
  /** When it happened, as shown. */
  time: string
  /** The user has seen it. */
  read: boolean
}

export const sampleNotifications: ShellConsoleNotification[] = [
  {
    id: 'run-4182',
    kind: 'deploy-failed',
    title: 'azion-site failed to deploy',
    description: 'The build stopped at step 3 of 5: a module could not be resolved.',
    time: '2 min ago',
    read: false
  },
  {
    id: 'run-4181',
    kind: 'deploy-succeeded',
    title: 'edge-auth is live',
    description: 'Deployed to production in 48 seconds.',
    time: '25 min ago',
    read: false
  },
  {
    id: 'invite-77',
    kind: 'info',
    title: 'Sam joined the team',
    description: 'Sam accepted your invitation and can now edit applications.',
    time: 'Yesterday',
    read: true
  }
]
