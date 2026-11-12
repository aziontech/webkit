import type { ConsoleLayoutNavGroup } from '@aziontech/webkit/console-layout-root'

export const navigation: ConsoleLayoutNavGroup[] = [
  {
    items: [
      { id: 'home', label: 'Home', icon: 'pi pi-home', href: '/onboarding' },
      { id: 'projects', label: 'Projects', icon: 'pi pi-folder' },
      { id: 'deployments', label: 'Deployments', icon: 'pi pi-cloud-upload' }
    ]
  },
  {
    label: 'Build',
    items: [
      { id: 'resources', label: 'Resources', icon: 'pi pi-box', href: '/resources' },
      { id: 'services', label: 'Services', icon: 'pi pi-server' },
      { id: 'variables', label: 'Variables', icon: 'pi pi-sliders-h' },
      { id: 'integrations', label: 'Integrations', icon: 'pi pi-link' },
      { id: 'templates', label: 'Templates', icon: 'pi pi-clone' }
    ]
  },
  {
    label: 'Security',
    items: [
      { id: 'domains', label: 'Domains', icon: 'pi pi-globe' },
      { id: 'policies', label: 'Policies', icon: 'pi pi-shield' },
      { id: 'rule-sets', label: 'Rule sets', icon: 'pi pi-list' },
      { id: 'keys', label: 'Keys', icon: 'pi pi-key' }
    ]
  },
  {
    label: 'Data',
    items: [
      { id: 'databases', label: 'Databases', icon: 'pi pi-database', tagValue: 'Preview' },
      { id: 'storage', label: 'Storage', icon: 'pi pi-inbox' }
    ]
  },
  {
    label: 'Observability',
    items: [
      { id: 'logs', label: 'Logs', icon: 'pi pi-file' },
      {
        id: 'metrics-module',
        label: 'Metrics',
        icon: 'pi pi-chart-bar',
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
      { id: 'events', label: 'Events', icon: 'pi pi-bolt' }
    ]
  },
  {
    label: 'More',
    items: [
      { id: 'catalog', label: 'Catalog', icon: 'pi pi-th-large' },
      {
        id: 'settings',
        label: 'Settings',
        icon: 'pi pi-cog',
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

export const account = { name: 'Ana Souza', email: 'ana.souza@example.com' }
