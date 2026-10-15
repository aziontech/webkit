import { METRIC_DASHBOARD_GROUPS } from './observability'

const SETTINGS_NODE = {
  id: 'settings',
  label: 'Settings',
  icon: 'pi pi-cog',
  kind: 'drill',
  groups: [
    {
      label: 'Settings',
      items: [
        { id: 'settings-general', label: 'General', path: '/account' },
        {
          id: 'settings-build-deployment',
          label: 'Build & Deployment',
          path: '/account/build-deployment'
        },
        {
          id: 'settings-environments',
          label: 'Environments',
          path: '/account/environments'
        },
        { id: 'settings-users', label: 'Users management', path: '/account/users' },
        { id: 'settings-teams', label: 'Teams and permissions', path: '/account/teams' }
      ]
    },
    {
      label: 'Access',
      items: [
        { id: 'settings-tokens', label: 'Personal Tokens', path: '/personal-tokens' },
        {
          id: 'settings-credentials',
          label: 'Credentials',
          path: '/account/credentials'
        },
        { id: 'settings-security-mfa', label: 'Multi-factor auth' },
        { id: 'settings-security-sessions', label: 'Active sessions' },
        { id: 'settings-activity', label: 'Activity History', path: '/account/activity' }
      ]
    },
    {
      label: 'Billing',
      items: [
        { id: 'settings-billing', label: 'Billing and plan', path: '/account/billing' },
        { id: 'settings-invoices', label: 'Invoices' }
      ]
    }
  ]
}

const MORE_GROUP = {
  label: 'More',
  items: [
    {
      id: 'marketplace',
      label: 'Marketplace',
      icon: 'ai ai-marketplace',
      path: '/marketplace'
    },
    SETTINGS_NODE
  ]
}

export const NAV_FLAT = [
  {
    items: [
      { id: 'overview', label: 'Overview', icon: 'pi pi-home', path: '/home' },
      { id: 'workloads', label: 'Workloads', icon: 'ai ai-workloads', path: '/workloads' },
      {
        id: 'deployments',
        label: 'Deployments',
        icon: 'ai ai-deploy-pillar',
        path: '/deployments'
      }
    ]
  },
  {
    label: 'Build',
    items: [
      {
        id: 'applications',
        label: 'Applications',
        icon: 'ai ai-edge-application',
        path: '/applications'
      },
      {
        id: 'functions',
        label: 'Functions',
        icon: 'ai ai-edge-functions',
        path: '/functions'
      },
      { id: 'variables', label: 'Variables', icon: 'ai ai-variables', path: '/variables' },
      {
        id: 'connectors',
        label: 'Connectors',
        icon: 'ai ai-edge-connectors',
        path: '/connectors'
      },
      {
        id: 'custom-pages',
        label: 'Custom Pages',
        icon: 'ai ai-custom-pages',
        path: '/custom-pages'
      }
    ]
  },
  {
    label: 'Secure',
    items: [
      {
        id: 'firewall',
        label: 'Firewall',
        icon: 'ai ai-edge-firewall',
        path: '/firewall'
      },
      { id: 'edge-dns', label: 'Edge DNS', icon: 'ai ai-edge-dns', path: '/edge-dns' },
      { id: 'waf-rules', label: 'WAF Rules', icon: 'ai ai-waf-rules', path: '/waf-rules' },
      {
        id: 'certificate-manager',
        label: 'Certificate Manager',
        icon: 'ai ai-digital-certificates',
        path: '/certificates'
      },
      {
        id: 'network-lists',
        label: 'Network Lists',
        icon: 'ai ai-network-lists',
        path: '/network-lists'
      }
    ]
  },
  {
    label: 'Store',
    items: [
      {
        id: 'object-storage',
        label: 'Object Storage',
        icon: 'ai ai-edge-storage',
        path: '/object-storage'
      },
      {
        id: 'sql-database',
        label: 'SQL Database',
        icon: 'ai ai-edge-sql',
        path: '/sql-database',
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
        icon: 'ai ai-data-stream',
        path: '/data-stream'
      },
      { id: 'edge-pulse', label: 'Edge Pulse', icon: 'ai ai-edge-pulse', path: '/edge-pulse' },
      {
        id: 'real-time-metrics',
        label: 'Real-Time Metrics',
        icon: 'ai ai-real-time-metrics',
        path: '/real-time-metrics'
      },
      {
        id: 'real-time-events',
        label: 'Real-Time Events',
        icon: 'ai ai-real-time-events',
        path: '/real-time-events'
      },
      {
        id: 'real-time-purge',
        label: 'Real-Time Purge',
        icon: 'ai ai-real-time-purge',
        path: '/real-time-purge'
      }
    ]
  },
  MORE_GROUP
]

export const NAV_LEVELS = [
  {
    items: [
      { id: 'overview', label: 'Overview', icon: 'pi pi-home', path: '/home' },
      {
        id: 'workloads-module',
        label: 'Workloads',
        icon: 'ai ai-workloads',
        kind: 'drill',
        href: '/workloads/overview',
        groups: [
          {
            label: 'Workloads',
            items: [
              { id: 'workloads-overview', label: 'Overview', path: '/workloads/overview' },
              { id: 'workloads', label: 'All Workloads', path: '/workloads' }
            ]
          }
        ]
      },
      {
        id: 'deployments',
        label: 'Deployments',
        icon: 'ai ai-deploy-pillar',
        path: '/deployments'
      }
    ]
  },
  {
    label: 'Build',
    items: [
      {
        id: 'applications-module',
        label: 'Applications',
        icon: 'ai ai-edge-application',
        kind: 'drill',
        href: '/applications/overview',
        groups: [
          {
            label: 'Applications',
            items: [
              { id: 'applications-overview', label: 'Overview', path: '/applications/overview' },
              { id: 'applications', label: 'All Applications', path: '/applications' }
            ]
          }
        ]
      },
      {
        id: 'functions-module',
        label: 'Functions',
        icon: 'ai ai-edge-functions',
        kind: 'drill',
        href: '/functions/overview',
        groups: [
          {
            label: 'Functions',
            items: [
              { id: 'functions-overview', label: 'Overview', path: '/functions/overview' },
              { id: 'functions', label: 'All Functions', path: '/functions' }
            ]
          }
        ]
      },
      { id: 'variables', label: 'Variables', icon: 'ai ai-variables', path: '/variables' },
      {
        id: 'connectors',
        label: 'Connectors',
        icon: 'ai ai-edge-connectors',
        path: '/connectors'
      },
      {
        id: 'custom-pages',
        label: 'Custom Pages',
        icon: 'ai ai-custom-pages',
        path: '/custom-pages'
      }
    ]
  },
  {
    label: 'Secure',
    items: [
      {
        id: 'firewall-module',
        label: 'Firewall',
        icon: 'ai ai-edge-firewall',
        kind: 'drill',
        href: '/firewall/overview',
        groups: [
          {
            label: 'Firewall',
            items: [
              { id: 'firewall-overview', label: 'Overview', path: '/firewall/overview' },
              { id: 'firewall', label: 'All Firewalls', path: '/firewall' },
              {
                id: 'network-lists',
                label: 'Network Lists',
                path: '/network-lists'
              }
            ]
          }
        ]
      },
      { id: 'edge-dns', label: 'Edge DNS', icon: 'ai ai-edge-dns', path: '/edge-dns' },
      { id: 'waf-rules', label: 'WAF Rules', icon: 'ai ai-waf-rules', path: '/waf-rules' },
      {
        id: 'certificate-manager',
        label: 'Certificate Manager',
        icon: 'ai ai-digital-certificates',
        path: '/certificates'
      }
    ]
  },
  {
    label: 'Store',
    items: [
      {
        id: 'object-storage-module',
        label: 'Object Storage',
        icon: 'ai ai-edge-storage',
        kind: 'drill',
        href: '/object-storage/overview',
        groups: [
          {
            label: 'Object Storage',
            items: [
              {
                id: 'object-storage-overview',
                label: 'Overview',
                path: '/object-storage/overview'
              },
              { id: 'object-storage', label: 'Buckets', path: '/object-storage' }
            ]
          }
        ]
      },
      {
        id: 'sql-database',
        label: 'SQL Database',
        icon: 'ai ai-edge-sql',
        path: '/sql-database',
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
        icon: 'ai ai-data-stream',
        path: '/data-stream'
      },
      { id: 'edge-pulse', label: 'Edge Pulse', icon: 'ai ai-edge-pulse', path: '/edge-pulse' },
      {
        id: 'real-time-metrics-module',
        label: 'Real-Time Metrics',
        icon: 'ai ai-real-time-metrics',
        kind: 'drill',
        href: '/real-time-metrics',
        groups: [
          {
            items: [{ id: 'real-time-metrics', label: 'Overview', path: '/real-time-metrics' }]
          },
          ...METRIC_DASHBOARD_GROUPS.map((group) => ({
            label: group.label,
            items: group.dashboards.map((dashboard) => ({
              id: `rtm-${dashboard.id}`,
              label: dashboard.label,
              path: '/real-time-metrics',
              query: { dashboard: dashboard.id }
            }))
          }))
        ]
      },
      {
        id: 'real-time-events',
        label: 'Real-Time Events',
        icon: 'ai ai-real-time-events',
        path: '/real-time-events'
      },
      {
        id: 'real-time-purge',
        label: 'Real-Time Purge',
        icon: 'ai ai-real-time-purge',
        path: '/real-time-purge'
      }
    ]
  },
  MORE_GROUP
]

export const navTreeFor = (model) => (model === 'flat' ? NAV_FLAT : NAV_LEVELS)
