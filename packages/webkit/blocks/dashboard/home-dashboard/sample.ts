import type { HomeDashboardMetrics, HomeDashboardResource } from './home-dashboard.vue'

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
