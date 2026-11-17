import type { ConsoleLayoutNavGroup } from '@aziontech/webkit/console-layout-root'

export const navigation: ConsoleLayoutNavGroup[] = [
  {
    items: [
      { id: 'home', label: 'Home', icon: 'az az-home', href: '/onboarding' },
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
      { id: 'databases', label: 'Databases', icon: 'az az-database', tagValue: 'Preview' },
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
              { id: 'settings-teams', label: 'Teams and permissions' }
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

export const account = { name: 'Amy Chen', email: 'amy.chen@example.com' }
