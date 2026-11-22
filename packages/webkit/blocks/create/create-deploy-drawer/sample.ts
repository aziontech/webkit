import type {
  DeployDrawerDependency,
  DeployDrawerDomainGroup,
  DeployDrawerEnvironment,
  DeployDrawerImpact,
  DeployDrawerProject,
  DeployDrawerProjectGroup,
  DeployDrawerResource,
  DeployDrawerValues,
  DeployDrawerVersion
} from './create-deploy-drawer.vue'

export const sampleResources: DeployDrawerResource[] = [
  {
    key: 'service',
    label: 'Service',
    name: 'web-app',
    icon: 'az az-server',
    note: '',
    total: 6,
    versions: [
      {
        id: 'AEO25I38',
        name: 'AEO25I38',
        author: 'Sam Lee',
        createdAgo: '1 day ago',
        active: true
      },
      {
        id: 'AG1VVDJP',
        name: 'AG1VVDJP',
        author: 'Priya Patel',
        createdAgo: '3 days ago'
      },
      {
        id: 'AHFPL906',
        name: 'AHFPL906',
        author: 'Chris Taylor',
        createdAgo: '3 days ago'
      },
      { id: 'AITJB4GN', name: 'AITJB4GN', author: 'Riley Carter', createdAgo: '4 days ago' },
      {
        id: 'AK7D0ZX4',
        name: 'AK7D0ZX4',
        author: 'Ethan Brooks',
        createdAgo: '6 days ago'
      }
    ],
    owner: true,
    dependencies: [
      {
        key: 'service@AG1VVDJP:module-auth-gateway',
        label: 'Module',
        name: 'auth-gateway',
        icon: 'az az-code',
        note: '',
        total: 8,
        versions: [
          {
            id: 'APICRFV0',
            name: 'APICRFV0',
            author: 'Sam Lee',
            createdAgo: '2 days ago'
          },
          {
            id: 'AQW6HBBH',
            name: 'AQW6HBBH',
            author: 'Priya Patel',
            createdAgo: '3 days ago'
          },
          {
            id: 'ASA076RY',
            name: 'ASA076RY',
            author: 'Chris Taylor',
            createdAgo: '5 days ago'
          },
          {
            id: 'ATNTX28F',
            name: 'ATNTX28F',
            author: 'Riley Carter',
            createdAgo: '5 days ago'
          },
          {
            id: 'AV1NMXOW',
            name: 'AV1NMXOW',
            author: 'Ethan Brooks',
            createdAgo: '6 days ago'
          }
        ]
      },
      {
        key: 'service@AG1VVDJP:module-geo-redirect',
        label: 'Module',
        name: 'geo-redirect',
        icon: 'az az-code',
        note: '',
        total: 11,
        versions: [
          {
            id: 'AK16MQ4R',
            name: 'AK16MQ4R',
            author: 'John Smith',
            createdAgo: '2 days ago'
          },
          {
            id: 'ALF0CLL8',
            name: 'ALF0CLL8',
            author: 'Sam Lee',
            createdAgo: '4 days ago'
          },
          {
            id: 'AMSU2H1P',
            name: 'AMSU2H1P',
            author: 'Priya Patel',
            createdAgo: '4 days ago'
          },
          {
            id: 'AO6NSCI6',
            name: 'AO6NSCI6',
            author: 'Chris Taylor',
            createdAgo: '6 days ago'
          },
          {
            id: 'APKHI7YN',
            name: 'APKHI7YN',
            author: 'Riley Carter',
            createdAgo: '6 days ago'
          }
        ]
      },
      {
        key: 'service@AG1VVDJP:integration-payments-api',
        label: 'Integration',
        name: 'payments-api',
        icon: 'az az-link',
        note: '',
        total: 11,
        versions: [
          {
            id: 'ASEKWJQF',
            name: 'ASEKWJQF',
            author: 'Riley Carter',
            createdAgo: '21 hours ago'
          },
          {
            id: 'ATSEMF6W',
            name: 'ATSEMF6W',
            author: 'Ethan Brooks',
            createdAgo: '2 days ago'
          },
          {
            id: 'AV68CAND',
            name: 'AV68CAND',
            author: 'Jordan Kim',
            createdAgo: '2 days ago'
          },
          {
            id: 'AWK2263U',
            name: 'AWK2263U',
            author: 'Taylor Reed',
            createdAgo: '3 days ago'
          },
          {
            id: 'AXXVS1KB',
            name: 'AXXVS1KB',
            author: 'John Smith',
            createdAgo: '5 days ago'
          }
        ]
      }
    ]
  }
]

export const sampleNewProject: DeployDrawerProject = {
  name: 'web-app',
  domain: 'web-app.example.com'
}

export const sampleProjectGroups: DeployDrawerProjectGroup[] = [
  {
    key: 'serving',
    label: 'Serving web-app',
    projects: [
      {
        id: '1020655',
        name: 'project-01',
        detail: '2 environments',
        domains: [
          {
            environment: 'Production',
            total: 8,
            summary: '8 domains',
            domains: [
              'project-1.example.com',
              'project-1-alias-1.example.com',
              'project-1-alias-2.example.com',
              'project-1-alias-3.example.com',
              'project-1-alias-4.example.com',
              'project-1-alias-5.example.com',
              'project-1-alias-6.example.com',
              'project-1-alias-7.example.com'
            ]
          }
        ]
      }
    ]
  },
  {
    key: 'flexible',
    label: 'Flexible',
    projects: [
      {
        id: '1031410004',
        name: 'campaign-landing',
        detail: 'Serves black-friday-2025',
        domains: [
          {
            environment: 'Production',
            total: 1,
            summary: '1 domains',
            domains: ['campaign.example.com']
          }
        ]
      },
      {
        id: '1031410005',
        name: 'docs-site',
        detail: 'Serves docs-web · Preview only',
        domains: [
          {
            environment: 'Preview',
            total: 1,
            summary: '1 domains',
            domains: ['*-preview.docs.example.com']
          }
        ]
      },
      {
        id: '1021001',
        name: 'project-03',
        detail: 'Serves analytics-pro',
        domains: [
          {
            environment: 'Production',
            total: 22,
            summary: '10 of 22 domains',
            domains: [
              'project-3.example.com',
              'project-3-alias-1.example.com',
              'project-3-alias-2.example.com',
              'project-3-alias-3.example.com',
              'project-3-alias-4.example.com',
              'project-3-alias-5.example.com',
              'project-3-alias-6.example.com',
              'project-3-alias-7.example.com',
              'project-3-alias-8.example.com',
              'project-3-alias-9.example.com'
            ]
          }
        ]
      },
      {
        id: '1021866',
        name: 'project-08',
        detail: 'Serves ecommerce-v2',
        domains: [
          {
            environment: 'Production',
            total: 57,
            summary: '10 of 57 domains',
            domains: [
              'project-8.example.com',
              'project-8-alias-1.example.com',
              'project-8-alias-2.example.com',
              'project-8-alias-3.example.com',
              'project-8-alias-4.example.com',
              'project-8-alias-5.example.com',
              'project-8-alias-6.example.com',
              'project-8-alias-7.example.com',
              'project-8-alias-8.example.com',
              'project-8-alias-9.example.com'
            ]
          }
        ]
      },
      {
        id: '1022731',
        name: 'project-13',
        detail: 'Serves mobile-app',
        domains: [
          {
            environment: 'Production',
            total: 92,
            summary: '10 of 92 domains',
            domains: [
              'project-13.example.com',
              'project-13-alias-1.example.com',
              'project-13-alias-2.example.com',
              'project-13-alias-3.example.com',
              'project-13-alias-4.example.com',
              'project-13-alias-5.example.com',
              'project-13-alias-6.example.com',
              'project-13-alias-7.example.com',
              'project-13-alias-8.example.com',
              'project-13-alias-9.example.com'
            ]
          }
        ]
      },
      {
        id: '1023596',
        name: 'project-18',
        detail: 'Serves react-dashboard',
        domains: [
          {
            environment: 'Production',
            total: 28,
            summary: '10 of 28 domains',
            domains: [
              'project-18.example.com',
              'project-18-alias-1.example.com',
              'project-18-alias-2.example.com',
              'project-18-alias-3.example.com',
              'project-18-alias-4.example.com',
              'project-18-alias-5.example.com',
              'project-18-alias-6.example.com',
              'project-18-alias-7.example.com',
              'project-18-alias-8.example.com',
              'project-18-alias-9.example.com'
            ]
          }
        ]
      }
    ]
  }
]

export const sampleEnvironments: DeployDrawerEnvironment[] = [
  {
    name: 'Production',
    description: 'Live traffic. One version serves the domain, and deploying replaces it.',
    tag: 'Last used'
  },
  {
    name: 'Preview',
    description:
      'Every other branch. Each version keeps its own URL, so a build can be read before it is live.',
    tag: ''
  }
]

export const sampleImpacted: DeployDrawerImpact[] = [
  {
    environment: 'Production',
    projects: [
      {
        id: '1020655',
        name: 'project-01',
        selected: true,
        domains: [
          {
            environment: 'Production',
            total: 8,
            summary: '8 domains',
            domains: [
              'project-1.example.com',
              'project-1-alias-1.example.com',
              'project-1-alias-2.example.com',
              'project-1-alias-3.example.com',
              'project-1-alias-4.example.com',
              'project-1-alias-5.example.com',
              'project-1-alias-6.example.com',
              'project-1-alias-7.example.com'
            ]
          }
        ]
      },
      {
        id: '1021347',
        name: 'project-05',
        domains: [
          {
            environment: 'Production',
            total: 36,
            summary: '10 of 36 domains',
            domains: [
              'project-5.example.com',
              'project-5-alias-1.example.com',
              'project-5-alias-2.example.com',
              'project-5-alias-3.example.com',
              'project-5-alias-4.example.com',
              'project-5-alias-5.example.com',
              'project-5-alias-6.example.com',
              'project-5-alias-7.example.com',
              'project-5-alias-8.example.com',
              'project-5-alias-9.example.com'
            ]
          }
        ]
      },
      {
        id: '1022039',
        name: 'project-09',
        domains: [
          {
            environment: 'Production',
            total: 64,
            summary: '10 of 64 domains',
            domains: [
              'project-9.example.com',
              'project-9-alias-1.example.com',
              'project-9-alias-2.example.com',
              'project-9-alias-3.example.com',
              'project-9-alias-4.example.com',
              'project-9-alias-5.example.com',
              'project-9-alias-6.example.com',
              'project-9-alias-7.example.com',
              'project-9-alias-8.example.com',
              'project-9-alias-9.example.com'
            ]
          }
        ]
      }
    ]
  }
]

export const sampleDefaultValues: Partial<DeployDrawerValues> = {
  versions: { service: 'AG1VVDJP' },
  projectId: '1020655'
}

export interface DeployDrawerEnvironmentEntry {
  name: string
  description: string
  lock?: string
}

export interface DeployDrawerReach {
  settings: string
  replaced: string
  groups: DeployDrawerImpact[]
}

const domainGroup = (slug: string, environment: string, total: number): DeployDrawerDomainGroup => {
  const shown = Math.min(total, 10)
  return {
    environment,
    total,
    summary:
      total > shown
        ? `${shown} of ${total} domains`
        : `${total} ${total === 1 ? 'domain' : 'domains'}`,
    domains: Array.from({ length: shown }, (_, index) =>
      index ? `${slug}-alias-${index}.example.com` : `${slug}.example.com`
    )
  }
}

export const sampleEnvironmentEntries: DeployDrawerEnvironmentEntry[] = [
  {
    name: 'Production',
    description: 'Live traffic. One version serves the domain, and deploying replaces it.'
  },
  {
    name: 'Staging',
    description: 'A copy of production for the last checks before a deploy.',
    lock: 'storefront-strict is Strict, so checkout-api stays bound to Staging.'
  },
  {
    name: 'Preview',
    description:
      'Every other branch. Each version keeps its own URL, so a build can be read before it is live.'
  }
]

export const sampleLastUsedEnvironment = 'Production'

export const sampleEnvironmentReach: Record<string, DeployDrawerReach> = {
  Production: {
    settings: 'shared-storefront',
    replaced: 'legacy-web',
    groups: [
      {
        environment: 'Production',
        projects: [
          {
            id: '1020655',
            name: 'project-01',
            selected: true,
            domains: [domainGroup('project-1', 'Production', 8)]
          },
          {
            id: '1021347',
            name: 'project-05',
            domains: [domainGroup('project-5', 'Production', 36)]
          },
          {
            id: '1022039',
            name: 'project-09',
            domains: [domainGroup('project-9', 'Production', 64)]
          }
        ]
      },
      {
        environment: 'Preview',
        projects: [
          {
            id: '1021347',
            name: 'project-05',
            domains: [domainGroup('preview-project-5', 'Preview', 1)]
          }
        ]
      }
    ]
  },
  Staging: { settings: 'storefront-strict', replaced: '', groups: [] },
  Preview: {
    settings: 'web-app-preview',
    replaced: '',
    groups: [
      {
        environment: 'Preview',
        projects: [
          {
            id: '1020655',
            name: 'project-01',
            selected: true,
            domains: [domainGroup('preview-project-1', 'Preview', 1)]
          }
        ]
      }
    ]
  }
}

const version = (
  id: string,
  author: string,
  createdAgo: string,
  active = false
): DeployDrawerVersion => ({
  id,
  name: id,
  author,
  createdAgo,
  active
})

const authGateway = (prefix: string): DeployDrawerDependency => ({
  key: `${prefix}:module-auth-gateway`,
  label: 'Module',
  name: 'auth-gateway',
  icon: 'az az-code',
  note: '',
  sharedWith: ['checkout-api', 'account-api'],
  total: 8,
  versions: [
    version('APICRFV0', 'Sam Lee', '2 days ago', true),
    version('AQW6HBBH', 'Priya Patel', '3 days ago'),
    version('ASA076RY', 'Chris Taylor', '5 days ago')
  ]
})

const paymentsApi = (prefix: string): DeployDrawerDependency => ({
  key: `${prefix}:integration-payments-api`,
  label: 'Integration',
  name: 'payments-api',
  icon: 'az az-link',
  note: 'Not versioned. Deploys with its current settings.',
  sharedWith: [],
  total: 0,
  versions: []
})

const geoRedirect = (prefix: string, ready: boolean): DeployDrawerDependency => ({
  key: `${prefix}:module-geo-redirect`,
  label: 'Module',
  name: 'geo-redirect',
  icon: 'az az-code',
  note: '',
  sharedWith: [],
  total: ready ? 11 : 0,
  versions: ready
    ? [
        version('AK16MQ4R', 'John Smith', '2 days ago', true),
        version('ALF0CLL8', 'Sam Lee', '4 days ago'),
        version('AMSU2H1P', 'Priya Patel', '4 days ago')
      ]
    : []
})

const sampleDependenciesByVersion = (id: string): DeployDrawerDependency[] => {
  const prefix = `service@${id}`
  return [authGateway(prefix), geoRedirect(prefix, id !== 'AG1VVDJP'), paymentsApi(prefix)]
}

const dependencyResources: Omit<DeployDrawerResource, 'dependencies'>[] = [
  {
    key: 'service',
    label: 'Service',
    name: 'web-app',
    icon: 'az az-server',
    note: '',
    total: 6,
    versions: [
      version('AEO25I38', 'Sam Lee', '1 day ago', true),
      version('AG1VVDJP', 'Priya Patel', '3 days ago'),
      version('AHFPL906', 'Chris Taylor', '3 days ago'),
      version('AITJB4GN', 'Riley Carter', '4 days ago'),
      version('AK7D0ZX4', 'Ethan Brooks', '6 days ago')
    ],
    owner: true
  },
  {
    key: 'config',
    label: 'Resource',
    name: 'web-app-config',
    icon: 'az az-box',
    note: '',
    total: 2,
    versions: [
      version('AB3K9QX2', 'Riley Carter', '2 days ago', true),
      version('AC71ZT0M', 'Jordan Kim', '8 days ago')
    ],
    owner: true
  }
]

export const sampleDependencyResources = (serviceVersion: string): DeployDrawerResource[] =>
  dependencyResources.map((row) => ({
    ...row,
    dependencies: row.key === 'service' ? sampleDependenciesByVersion(serviceVersion) : []
  }))
