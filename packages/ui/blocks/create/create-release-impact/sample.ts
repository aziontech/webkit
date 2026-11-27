import type { ReleaseImpactResource, ReleaseImpactSettings } from './create-release-impact.vue'

export const sampleResources: ReleaseImpactResource[] = [
  {
    type: 'service',
    name: 'web-app',
    required: true,
    enabled: true,
    versionId: 'AG1VVDJP',
    versions: [
      { id: 'AG1VVDJP', current: true, builtAt: '2026-11-10T10:00:00Z' },
      { id: 'AF3K2L9Q', builtAt: '2026-11-09T12:00:00Z' },
      { id: 'AD7M1X4R', builtAt: '2026-11-06T12:00:00Z' }
    ],
    groups: [
      {
        type: 'module',
        rows: [
          {
            name: 'auth-gateway',
            versionId: 'AB2C9D1E',
            versions: [
              { id: 'AB2C9D1E', current: true, builtAt: '2026-11-07T12:00:00Z' },
              { id: 'AA8F3G2H', builtAt: '2026-10-27T12:00:00Z' }
            ],
            sharedWith: ['checkout', 'admin-panel']
          },
          {
            name: 'geo-redirect',
            versionId: 'latest',
            versions: [{ id: 'AC4J6K8L', current: true, builtAt: '2026-11-05T12:00:00Z' }]
          }
        ]
      },
      {
        type: 'integration',
        rows: [
          {
            name: 'payments-api',
            versionId: 'AE5N7P9Q',
            versions: [{ id: 'AE5N7P9Q', current: true, builtAt: '2026-11-03T12:00:00Z' }]
          }
        ]
      }
    ]
  },
  {
    type: 'policy',
    name: 'edge-policy',
    canToggle: true,
    enabled: true,
    versionId: 'latest',
    versions: [
      { id: 'AH3R5T7V', current: true, builtAt: '2026-11-10T06:00:00Z' },
      { id: 'AG9W1X3Y', builtAt: '2026-11-07T12:00:00Z' }
    ],
    groups: []
  },
  {
    type: 'storage',
    name: 'web-app-assets',
    readonly: true,
    enabled: true,
    versionId: 'AJ2B4D6F',
    versions: [{ id: 'AJ2B4D6F', current: true, builtAt: '2026-10-27T12:00:00Z' }],
    groups: []
  },
  {
    type: 'errorPage',
    name: 'web-app-errors',
    canToggle: true,
    enabled: false,
    note: 'Left out of this release. The error page serving now keeps serving.',
    versionId: 'latest',
    versions: [{ id: 'AK8M2P4R', current: true, builtAt: '2026-10-11T12:00:00Z' }],
    groups: []
  }
]

export const sampleImpact: ReleaseImpactSettings[] = [
  {
    id: 'production-settings',
    name: 'production-settings',
    domainsCount: 6,
    environments: [
      {
        id: 'production',
        name: 'Production',
        projects: [
          { id: 'web-app', name: 'web-app', domainsCount: 2 },
          { id: 'storefront', name: 'storefront', domainsCount: 3 }
        ]
      },
      {
        id: 'preview',
        name: 'Preview',
        projects: [{ id: 'web-app-preview', name: 'web-app-preview', domainsCount: 1 }]
      }
    ]
  },
  {
    id: 'staging-settings',
    name: 'staging-settings',
    domainsCount: 0,
    environments: []
  }
]

export interface ReleaseImpactDeploymentSetting {
  id: string
  name: string
  policy: string
  environments: string[]
  workloads: number | null
  shared?: boolean
  managed?: boolean
}

export interface ReleaseImpactSettingsGroup {
  key: string
  label: string
  selectable: boolean
  notice?: string
  action?: string
  href?: string
  items: ReleaseImpactDeploymentSetting[]
}

export const sampleSettingsGroups: ReleaseImpactSettingsGroup[] = [
  {
    key: 'yours',
    label: 'Your Deployment Settings',
    selectable: true,
    items: [
      {
        id: 'storefront-shared',
        name: 'storefront-shared',
        policy: 'Flexible binding · Deploys on release',
        environments: ['Production', 'Staging', 'Preview', 'QA', 'Load test'],
        workloads: 4,
        shared: true
      },
      {
        id: 'web-app-production',
        name: 'web-app-production',
        policy: 'Strict binding · Deploys on release',
        environments: ['Production'],
        workloads: 1
      },
      {
        id: 'api-staging',
        name: 'api-staging',
        policy: 'Flexible binding · Manual approval',
        environments: ['Staging'],
        workloads: 0
      },
      {
        id: 'docs-preview',
        name: 'docs-preview',
        policy: 'Flexible binding · Deploys on release',
        environments: ['Preview'],
        workloads: null
      }
    ]
  },
  {
    key: 'managed',
    label: 'Managed',
    selectable: true,
    items: [
      {
        id: 'default-settings',
        name: 'default-settings',
        policy: 'Flexible binding · Deploys on release',
        environments: ['Production', 'Preview'],
        workloads: 12,
        managed: true
      }
    ]
  },
  {
    key: 'inactive',
    label: 'Inactive',
    selectable: false,
    notice: 'Activate this Deployment Setting before a release can deploy with it.',
    action: 'Activate in Deployment Settings',
    href: 'https://example.com/deployment-settings/legacy-checkout',
    items: [
      {
        id: 'legacy-checkout',
        name: 'legacy-checkout',
        policy: 'Strict binding · Manual approval',
        environments: ['Production'],
        workloads: 2
      }
    ]
  }
]
