import type {
  ConsoleLayoutAccount,
  ConsoleLayoutNavGroup
} from '@aziontech/webkit/console-layout-root'

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
