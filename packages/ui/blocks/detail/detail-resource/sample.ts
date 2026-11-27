import type { FlowDiagramEdgeData, FlowDiagramNodeData } from '@aziontech/ui/flow-diagram-root'
import type { StatusIndicatorSeverity } from '@aziontech/ui/status-indicator'
import type { TagSeverity, TagVariant } from '@aziontech/ui/tag'

import type { ResourceDetailResource, ResourceDetailTab } from './detail-resource.vue'
import type { ApplicationDeploymentRow } from './parts/application-deployments-tab.vue'
import type { ApplicationVersionRow } from './parts/application-versions-tab.vue'
import type { ProductionStep } from './parts/production-progress-tag.vue'
import type { TopologyTarget } from './use-topology-staging'

const referenceTime = Date.UTC(2026, 10, 10, 12)

export const sampleNow = new Date(referenceTime).toISOString()

export const sampleResource: ResourceDetailResource = {
  name: 'analytics-app',
  domain: 'analytics-app-z1x2c3.example.com',
  deploymentId: '1213275262',
  environment: 'Production',
  status: 'Ready',
  statusSeverity: 'success',
  createdAt: new Date(referenceTime - 14 * 86_400_000),
  createdBy: 'John Smith',
  framework: 'Next.js',
  frameworkIcon: 'az-color az-nextjs'
}

export const webAppResource: ResourceDetailResource = {
  name: 'web-app',
  domain: 'web-app-y6u7i8.example.com',
  deploymentId: '1213284258',
  environment: 'Production',
  status: 'Ready',
  statusSeverity: 'success',
  createdAt: new Date(referenceTime - 28 * 86_400_000),
  createdBy: 'Riley Carter',
  framework: 'Nuxt',
  frameworkIcon: 'az-color az-nuxt'
}

export const neverDeployedResource: ResourceDetailResource = {
  name: 'docs-site',
  domain: 'docs-site-q4w5e6.example.com',
  deploymentId: '',
  environment: 'Production',
  status: 'Not deployed',
  statusSeverity: 'neutral',
  createdAt: new Date(referenceTime - 2 * 3_600_000),
  createdBy: 'Jane Doe',
  framework: 'Astro',
  frameworkIcon: 'az-color az-astro'
}

export const buildToken = 'azn_build_example_k3p9qa7f2m8x4w1c6v5b'

export const resourceTabs: { value: ResourceDetailTab; label: string }[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'versions', label: 'Versions' },
  { value: 'build', label: 'Build' },
  { value: 'deployments', label: 'Deployments' }
]

export const policyModules = [
  'Rate limiting',
  'Request inspection',
  'IP filtering',
  'Bot detection'
]

export const serviceDomains = [
  'service-01.example.com',
  'service-01-alias-1.example.com',
  'service-01-alias-2.example.com',
  'service-01-alias-3.example.com',
  'service-01-alias-4.example.com',
  'service-01-alias-5.example.com',
  'service-01-alias-6.example.com',
  'service-01-alias-7.example.com'
]

export const serviceEnvironments = [
  { name: 'Production', policy: 'Single' },
  { name: 'Preview', policy: 'Versioned' }
]

/** A service card of the first deploy. */
export interface FirstDeployService {
  /** The service ID. */
  id: string
  /** The generated domain. */
  domain: string
  /** The deploy step in flight; empty when none runs. */
  deployStep: string
  /** The service serves traffic. */
  live: boolean
  /** Who created it. */
  createdBy: string
  /** When it was created, already formatted. */
  createdAt: string
}

export const firstDeployServices: FirstDeployService[] = [
  {
    id: '1020731',
    domain: 'store-front-k3p9qa.example.com',
    deployStep: 'Build',
    live: false,
    createdBy: 'Jane Doe',
    createdAt: 'Nov 12'
  },
  {
    id: '1020655',
    domain: 'docs-site-w2x7mb.example.com',
    deployStep: '',
    live: false,
    createdBy: 'Sam Lee',
    createdAt: 'Sep 22'
  }
]

export const productionSteps: ProductionStep[] = [
  {
    id: 'domain',
    icon: 'az az-globe',
    title: 'Add a custom domain',
    description:
      'Serve this service on a domain of your own, with a free HTTPS certificate, instead of the generated hostname.',
    actionLabel: 'Add Domain',
    done: false
  },
  {
    id: 'policy',
    icon: 'az az-shield',
    title: 'Enable a security policy',
    description:
      'Bind a policy so requests are inspected before they reach the resource. Rate limiting, request inspection, and IP filtering.',
    actionLabel: 'Bind Policy',
    done: false
  },
  {
    id: 'errorPage',
    icon: 'az az-file',
    title: 'Set custom error pages',
    description: 'Answer 4xx and 5xx with your own page instead of the default response.',
    actionLabel: 'Bind Error Page',
    done: false
  }
]

export const serviceTargets: Record<string, TopologyTarget> = {
  policy: {
    kind: 'Policy',
    icon: 'az az-shield',
    options: [
      { value: 'payments-api', label: 'payments-api' },
      { value: 'api-hardening', label: 'api-hardening' },
      { value: 'partner-gateway', label: 'partner-gateway' },
      { value: 'production-policy', label: 'production-policy' },
      { value: 'canary-policy', label: 'canary-policy' }
    ],
    unbound: 'Requests reach the resource without inspection.'
  },
  errorPage: {
    kind: 'Error Page',
    icon: 'az az-file',
    options: [
      { value: 'Branded 404', label: 'Branded 404' },
      { value: 'Maintenance window', label: 'Maintenance window' },
      { value: 'Server error', label: 'Server error' },
      { value: 'Blocked by policy', label: 'Blocked by policy' },
      { value: 'Rate limited', label: 'Rate limited' }
    ],
    unbound: 'Errors answer with the default page.'
  },
  origin: {
    kind: 'Origin',
    icon: 'az az-link',
    options: [
      { value: 'web-app-storage', label: 'web-app-storage' },
      { value: 'api-primary', label: 'api-primary' },
      { value: 'assets-storage', label: 'assets-storage' },
      { value: 'api-failover', label: 'api-failover' },
      { value: 'uploads', label: 'uploads' }
    ],
    removable: false,
    bound:
      'Provisioned with this service. It is the resource’s origin, so it can be re-pointed but not removed.',
    fields: [
      { label: 'ID', value: '1599818521' },
      { label: 'Type', value: 'Storage' },
      { label: 'Address', value: 'web-app-assets' }
    ]
  }
}

export const serviceTopology: Record<string, FlowDiagramNodeData> = {
  domains: {
    id: 'domains',
    eyebrow: 'Domains',
    icon: 'az az-globe',
    title: 'service-01.example.com',
    status: '1 domain',
    severity: 'neutral',
    fields: [
      {
        label: 'Generated domain',
        value: 'service-01.example.com',
        copyable: true,
        href: 'https://service-01.example.com'
      }
    ]
  },
  service: {
    id: 'service',
    eyebrow: 'Service',
    icon: 'az az-server',
    title: 'service-01',
    status: 'Live',
    severity: 'success',
    href: '/services/1020655',
    fields: [
      { label: 'ID', value: '1020655' },
      {
        label: 'Domain',
        value: 'service-01.example.com',
        copyable: true,
        href: 'https://service-01.example.com'
      },
      { label: 'Environment', value: 'Production' }
    ]
  },
  resource: {
    id: 'resource',
    eyebrow: 'Resource',
    icon: 'az az-box',
    title: 'web-app',
    status: 'Active',
    severity: 'success',
    href: '/resources/1170472732',
    fields: [
      { label: 'ID', value: '1170472732' },
      { label: 'Repository', value: 'acme/web-app' },
      { label: 'Branch', value: 'main' }
    ]
  },
  storage: {
    id: 'storage',
    eyebrow: 'Storage',
    icon: 'az az-inbox',
    title: 'web-app-assets',
    status: 'Public',
    severity: 'info',
    href: '/storage/web-app-assets',
    fields: [
      { label: 'Access', value: 'Public' },
      { label: 'Files', value: '24' },
      { label: 'Size', value: '1.2 MB' }
    ]
  }
}

export const serviceEdges: FlowDiagramEdgeData[] = [
  { from: 'domains', to: 'service' },
  { from: 'service', to: 'policy' },
  { from: 'policy', to: 'resource' },
  { from: 'policy', to: 'errorPage' },
  { from: 'resource', to: 'origin' },
  { from: 'origin', to: 'storage' }
]

export const application = {
  name: 'storefront-app',
  host: 'storefront-app-k3m9.example.com',
  deployment: '4182093317',
  version: 'BX7Q2LMA'
}

export const applicationFacts = [
  { label: 'Active version', value: application.version, code: true },
  { label: 'Framework', value: 'Vite' },
  { label: 'Source', value: 'acme/storefront (main)' },
  { label: 'Created', value: '', createdAt: '2026-10-27T12:00:00Z', author: 'Mara Lin' }
]

export const applicationVersions: ApplicationVersionRow[] = [
  {
    id: 'BX7Q2LMA',
    name: 'BX7Q2LMA',
    description: 'Cache product images for 7 days',
    state: 'Active',
    createdAt: '2026-11-10T09:00:00Z'
  },
  {
    id: 'BW1K8RTE',
    name: 'BW1K8RTE',
    description: 'Add rule "Redirect old checkout"',
    state: 'Ready',
    createdAt: '2026-11-09T12:00:00Z'
  },
  {
    id: 'BV4N6PXD',
    name: 'BV4N6PXD',
    description: 'Bypass cache for /api/*',
    state: 'Ready',
    createdAt: '2026-11-06T12:00:00Z'
  }
]

export const applicationDeployments: ApplicationDeploymentRow[] = [
  {
    id: '4182093317',
    version: 'BX7Q2LMA',
    environment: 'Production',
    status: 'Live',
    createdAt: '2026-11-10T09:00:00Z'
  },
  {
    id: '4181877250',
    version: 'BW1K8RTE',
    environment: 'Preview',
    status: 'Live',
    createdAt: '2026-11-09T12:00:00Z'
  },
  {
    id: '4180412906',
    version: 'BW1K8RTE',
    environment: 'Production',
    status: 'Failed',
    createdAt: '2026-11-09T12:00:00Z'
  }
]

export const applicationDeploymentSeverity: Record<string, StatusIndicatorSeverity> = {
  Live: 'success',
  Failed: 'danger',
  Building: 'info'
}

export const applicationTargets: Record<string, TopologyTarget> = {
  firewall: {
    kind: 'Firewall',
    icon: 'az az-shield',
    options: [
      { value: 'edge-guard', label: 'edge-guard' },
      { value: 'strict-waf', label: 'strict-waf' }
    ],
    unbound: 'Requests reach the application without inspection.'
  },
  function: {
    kind: 'Function instance',
    icon: 'az az-code',
    options: [
      { value: 'geo-redirect', label: 'geo-redirect' },
      { value: 'ab-split', label: 'ab-split' }
    ],
    unbound: 'No function runs before the cache.'
  }
}

export const applicationTopology: Record<string, FlowDiagramNodeData> = {
  domain: {
    id: 'domain',
    eyebrow: 'Domain',
    icon: 'az az-globe',
    title: 'shop.example.com',
    status: 'Live',
    severity: 'success'
  },
  workload: {
    id: 'workload',
    eyebrow: 'Workload',
    icon: 'az az-sitemap',
    title: 'storefront',
    status: 'Active',
    severity: 'success'
  },
  application: {
    id: 'application',
    eyebrow: 'Application',
    icon: 'az az-box',
    title: 'storefront-app',
    status: 'Active',
    severity: 'success'
  }
}

export const applicationEdges: FlowDiagramEdgeData[] = [
  { from: 'domain', to: 'workload' },
  { from: 'workload', to: 'firewall' },
  { from: 'firewall', to: 'application' },
  { from: 'application', to: 'function' }
]

export const buildApplication = {
  name: 'storefront-app',
  host: 'storefront-app-k3m9.example.com',
  deployment: '4182093317',
  version: 'BX7Q2LMA',
  repository: 'acme/storefront'
}

export const buildApplicationVersions: ApplicationVersionRow[] = [
  {
    id: 'BX7Q2LMA',
    name: 'BX7Q2LMA',
    description: 'Cache product images for 7 days',
    state: 'Active',
    createdAt: '2026-11-10T09:00:00Z'
  },
  {
    id: 'BW1K8RTE',
    name: 'BW1K8RTE',
    description: 'Redirect the old checkout path',
    state: 'Ready',
    createdAt: '2026-11-09T12:00:00Z'
  },
  {
    id: 'BV4N6PXD',
    name: 'BV4N6PXD',
    description: 'Bypass cache for /api/*',
    state: 'Ready',
    createdAt: '2026-11-06T12:00:00Z'
  }
]

export const buildApplicationDeployments: ApplicationDeploymentRow[] = [
  {
    id: '4182093317',
    version: 'BX7Q2LMA',
    environment: 'Production',
    status: 'Ready',
    createdAt: '2026-11-10T09:00:00Z'
  },
  {
    id: '4181877250',
    version: 'BW1K8RTE',
    environment: 'Preview',
    status: 'Ready',
    createdAt: '2026-11-09T12:00:00Z'
  },
  {
    id: '4180412906',
    version: 'BW1K8RTE',
    environment: 'Production',
    status: 'Error',
    createdAt: '2026-11-09T12:00:00Z'
  }
]

export const buildDeploymentSeverity: Record<string, StatusIndicatorSeverity> = {
  Ready: 'success',
  Error: 'danger',
  Building: 'info'
}

/** One row of the resource Versions tab. */
export interface ResourceVersionRow {
  /** Stable key. */
  id: string
  /** The code-set name. */
  name: string
  /** A key of the version states. */
  state: string
  /** What the version changed. */
  description: string
  /** Who built it. */
  author: string
  /** When it was built, as ISO 8601. */
  createdAt: string
}

export const resourceVersions: ResourceVersionRow[] = [
  {
    id: 'ANWDC7RA',
    name: 'ANWDC7RA',
    state: 'active',
    description: 'Reorder rules',
    author: 'Chris Taylor',
    createdAt: '2026-11-05T17:37:18.145Z'
  },
  {
    id: 'APA7237R',
    name: 'APA7237R',
    state: 'ready',
    description: 'Add rule "Security headers"',
    author: 'Riley Carter',
    createdAt: '2026-11-03T14:37:18.145Z'
  },
  {
    id: 'AQO0RYO8',
    name: 'AQO0RYO8',
    state: 'ready',
    description: 'Bypass cache for /api/*',
    author: 'Ethan Brooks',
    createdAt: '2026-11-02T14:37:18.145Z'
  },
  {
    id: 'AS1UHU4P',
    name: 'AS1UHU4P',
    state: 'ready',
    description: 'Add rule "Redirect /blog to docs"',
    author: 'Jordan Kim',
    createdAt: '2026-11-01T14:37:18.145Z'
  },
  {
    id: 'ATFO7PL6',
    name: 'ATFO7PL6',
    state: 'ready',
    description: 'Add function "image-resize"',
    author: 'Taylor Reed',
    createdAt: '2026-10-31T14:37:18.145Z'
  },
  {
    id: 'AUTHXL1N',
    name: 'AUTHXL1N',
    state: 'ready',
    description: 'Reorder rules',
    author: 'John Smith',
    createdAt: '2026-10-30T14:37:18.145Z'
  },
  {
    id: 'AW7BNGI4',
    name: 'AW7BNGI4',
    state: 'ready',
    description: 'Add rule "Security headers"',
    author: 'Sam Lee',
    createdAt: '2026-10-29T14:37:18.145Z'
  },
  {
    id: 'AXL5DBYL',
    name: 'AXL5DBYL',
    state: 'ready',
    description: 'Bypass cache for /api/*',
    author: 'Priya Patel',
    createdAt: '2026-10-28T14:37:18.145Z'
  },
  {
    id: 'AYYZ37F2',
    name: 'AYYZ37F2',
    state: 'ready',
    description: 'Add rule "Redirect /blog to docs"',
    author: 'Chris Taylor',
    createdAt: '2026-10-27T14:37:18.145Z'
  },
  {
    id: 'A1CST2VJ',
    name: 'A1CST2VJ',
    state: 'ready',
    description: 'Add function "image-resize"',
    author: 'Riley Carter',
    createdAt: '2026-10-26T14:37:18.145Z'
  },
  {
    id: 'A2QMIYC0',
    name: 'A2QMIYC0',
    state: 'ready',
    description: 'Reorder rules',
    author: 'Ethan Brooks',
    createdAt: '2026-10-24T14:37:18.145Z'
  },
  {
    id: 'A44G8TSH',
    name: 'A44G8TSH',
    state: 'ready',
    description: 'Add rule "Security headers"',
    author: 'Jordan Kim',
    createdAt: '2026-10-24T14:37:18.145Z'
  },
  {
    id: 'A5I9YP8Y',
    name: 'A5I9YP8Y',
    state: 'archived',
    description: 'Bypass cache for /api/*',
    author: 'Taylor Reed',
    createdAt: '2026-10-22T14:37:18.145Z'
  }
]

export const resourceVersionStates: Record<
  string,
  { label: string; severity?: TagSeverity; variant?: TagVariant }
> = {
  active: { label: 'Deployed', variant: 'primary' },
  ready: { label: 'Ready', severity: 'success' },
  archived: { label: 'Archived', severity: 'neutral' }
}
