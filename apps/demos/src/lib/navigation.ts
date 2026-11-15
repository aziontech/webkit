import type { ConsoleLayoutNavGroup } from '@aziontech/webkit/console-layout-root'

export const navigation: ConsoleLayoutNavGroup[] = [
  {
    items: [
      { id: 'home', label: 'Home', icon: 'ai ai-home', href: '/onboarding' },
      { id: 'projects', label: 'Projects', icon: 'ai ai-folder' },
      { id: 'deployments', label: 'Deployments', icon: 'ai ai-cloud-upload' }
    ]
  },
  {
    label: 'Build',
    items: [
      { id: 'resources', label: 'Resources', icon: 'ai ai-box', href: '/resources' },
      { id: 'services', label: 'Services', icon: 'ai ai-server' },
      { id: 'variables', label: 'Variables', icon: 'ai ai-sliders-horizontal' },
      { id: 'integrations', label: 'Integrations', icon: 'ai ai-link' },
      { id: 'templates', label: 'Templates', icon: 'ai ai-copy' }
    ]
  },
  {
    label: 'Security',
    items: [
      { id: 'domains', label: 'Domains', icon: 'ai ai-globe' },
      { id: 'policies', label: 'Policies', icon: 'ai ai-shield' },
      { id: 'rule-sets', label: 'Rule sets', icon: 'ai ai-list' },
      { id: 'keys', label: 'Keys', icon: 'ai ai-key' }
    ]
  },
  {
    label: 'Data',
    items: [
      { id: 'databases', label: 'Databases', icon: 'ai ai-database', tagValue: 'Preview' },
      { id: 'storage', label: 'Storage', icon: 'ai ai-inbox' }
    ]
  },
  {
    label: 'Observability',
    items: [
      { id: 'logs', label: 'Logs', icon: 'ai ai-file' },
      {
        id: 'metrics-module',
        label: 'Metrics',
        icon: 'ai ai-chart-bar',
        kind: 'drill',
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
      { id: 'events', label: 'Events', icon: 'ai ai-bolt' }
    ]
  },
  {
    label: 'More',
    items: [
      { id: 'catalog', label: 'Catalog', icon: 'ai ai-layout-grid' },
      {
        id: 'settings',
        label: 'Settings',
        icon: 'ai ai-settings',
        kind: 'drill',
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
