import type { HomeDashboardMetrics, HomeDashboardResource } from './dashboard-home.vue'

export const sampleUserName = 'Alex'

export const sampleMetrics: HomeDashboardMetrics = {
  'data-transferred': { value: 842, delta: 12.4 },
  'requests-per-second': { value: 1240, delta: 3.8 },
  'bandwidth-saving': { value: 588, delta: 6.2 },
  'data-offload': { value: 70, delta: -1.5 }
}

const marketingSite: HomeDashboardResource = {
  id: '4410203040',
  name: 'marketing-site',
  href: '/projects/4410203040',
  typeLabel: 'Project',
  presetIcon: 'az-color az-astro',
  presetLabel: 'Astro'
}

const docsSite: HomeDashboardResource = {
  id: '6630405070',
  name: 'docs-site',
  href: '/projects/6630405070',
  typeLabel: 'Project',
  presetIcon: 'az-color az-nextjs',
  presetLabel: 'Next.js'
}

const blackFriday: HomeDashboardResource = {
  id: '5520304060',
  name: 'black-friday-2026',
  href: '/projects/5520304060',
  typeLabel: 'Project',
  presetIcon: 'az-color az-nextjs',
  presetLabel: 'Next.js'
}

const resourceOne: HomeDashboardResource = {
  id: '1020655',
  name: 'resource-01',
  href: '/resources/1020655',
  typeLabel: 'Resource'
}

const appDomain: HomeDashboardResource = {
  id: 'domain-1020655',
  name: 'app.example.com',
  href: '/domains/domain-1020655',
  typeLabel: 'Domain'
}

export const sampleProjects: HomeDashboardResource[] = [
  marketingSite,
  docsSite,
  blackFriday,
  {
    id: '2041778390',
    name: 'hello-world',
    href: '/projects/2041778390',
    typeLabel: 'Project',
    presetIcon: 'az-color az-javascript',
    presetLabel: 'JavaScript'
  },
  {
    id: '1784552864',
    name: 'web-app',
    href: '/projects/1784552864',
    typeLabel: 'Project',
    presetIcon: 'az-color az-vue',
    presetLabel: 'Vue'
  }
]

export const sampleResources: HomeDashboardResource[] = [
  resourceOne,
  { id: '1031410003', name: 'resource-02', href: '/resources/1031410003', typeLabel: 'Resource' },
  { id: '1031410001', name: 'resource-03', href: '/resources/1031410001', typeLabel: 'Resource' }
]

export const sampleDomains: HomeDashboardResource[] = [
  appDomain,
  {
    id: 'domain-1031410003',
    name: '*.preview.example.com',
    href: '/domains/domain-1031410003',
    typeLabel: 'Domain'
  },
  {
    id: 'domain-1031410001',
    name: 'www.example.com',
    href: '/domains/domain-1031410001',
    typeLabel: 'Domain'
  },
  {
    id: 'domain-1031410002',
    name: 'api.example.com',
    href: '/domains/domain-1031410002',
    typeLabel: 'Domain'
  }
]

export const sampleRecents: HomeDashboardResource[] = [
  resourceOne,
  appDomain,
  marketingSite,
  docsSite,
  blackFriday
]

export const sampleRegisteredDomains: string[] = ['example.com', 'example.org', 'example.net']

export type SummaryOperation = 'Created' | 'Edited' | 'Deleted'

export interface SummaryZone {
  id: string
  name: string
  domain: string
  status: 'Active' | 'Inactive'
  author: string
  modifiedAt: string
}

export interface SummaryActivity {
  id: string
  date: string
  operation: SummaryOperation
  type: string
  resource: string
  email: string
}

export interface SummaryTemplate {
  id: string
  name: string
  icon: string
  description: string
  vendor: string
  version: string
}

export const sampleSummaryRange = 'Jul 14, 2026, 6:56 PM – Jul 14, 2026, 7:56 PM UTC'

export const sampleSummaryZones: SummaryZone[] = [
  {
    id: '4410203040',
    name: 'example-com',
    domain: 'example.com',
    status: 'Active',
    author: 'jane.doe@example.com',
    modifiedAt: '2026-07-18T09:12:00Z'
  },
  {
    id: '5520304060',
    name: 'acme-store',
    domain: 'store.example.com',
    status: 'Active',
    author: 'john.smith@example.com',
    modifiedAt: '2026-07-20T08:30:00Z'
  }
]

export const sampleSummaryActivity: SummaryActivity[] = [
  {
    id: 'act-1',
    date: 'Jul 13, 2026, 1:52 PM',
    operation: 'Created',
    type: 'User login',
    resource: 'User login for Jane Doe',
    email: 'jane.doe@example.com'
  },
  {
    id: 'act-2',
    date: 'Jun 30, 2026, 6:54 PM',
    operation: 'Deleted',
    type: 'DNS zone',
    resource: 'DNS zone example.org',
    email: 'jane.doe@example.com'
  },
  {
    id: 'act-3',
    date: 'Jun 30, 2026, 6:54 PM',
    operation: 'Created',
    type: 'DNS zone',
    resource: 'DNS zone example.org',
    email: 'jane.doe@example.com'
  },
  {
    id: 'act-4',
    date: 'Jun 30, 2026, 6:53 PM',
    operation: 'Created',
    type: 'User login',
    resource: 'User login for Jane Doe',
    email: 'jane.doe@example.com'
  },
  {
    id: 'act-5',
    date: 'Jun 24, 2026, 1:55 AM',
    operation: 'Edited',
    type: 'Response rule',
    resource: 'Response rule Set storage origin for acme-store',
    email: 'jane.doe@example.com'
  }
]

export const sampleSummaryUsage = [
  { id: 'dns-zones', label: 'DNS zones', value: '2' },
  { id: 'applications', label: 'Applications', value: '5' },
  { id: 'functions', label: 'Function invocations', value: '1.2M' }
]

export const sampleSummaryTemplates: SummaryTemplate[] = [
  {
    id: 'jwt',
    name: 'JWT',
    icon: 'az az-key',
    description:
      'Streamline authentication by processing and validating JSON Web Tokens (JWTs) before a request reaches your origin.',
    vendor: 'Acme',
    version: '1.1.0'
  },
  {
    id: 'image-optimizer',
    name: 'Image optimizer',
    icon: 'az az-image',
    description: 'Resize, crop and convert images on request, and cache every variant.',
    vendor: 'Acme',
    version: '2.4.0'
  },
  {
    id: 'bot-detection',
    name: 'Bot detection',
    icon: 'az az-shield',
    description: 'Score each request and block automated traffic before it costs you capacity.',
    vendor: 'Acme',
    version: '0.9.2'
  }
]
