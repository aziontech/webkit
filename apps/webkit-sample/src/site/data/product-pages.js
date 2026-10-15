import { CLIENTS } from '@aziontech/webkit/assets/client-registry'

import { AREZZO, AXUR, CONTABILIZEI, CREFISA } from './clients.js'

export const PRODUCT_DOCS = '/site/docs'

export const PRODUCT_HERO_ACTIONS = [
  { label: 'Start free', href: '/signup', kind: 'secondary' },
  { label: 'Docs', href: PRODUCT_DOCS, kind: 'outlined', trailing: true }
]

export const PRODUCT_DIRECTORY = {
  section: 'PlatformDirectory',
  eyebrow: 'Complete, not complex',
  title: 'A full-stack platform that scales instantly'
}

export const PLATFORM_DIRECTORY = {
  section: 'PlatformDirectory',
  title: 'Serverless AI-native primitives for autonomous workloads',
  ariaLabel: 'Platform primitives'
}

export const PRODUCT_CLOSING = {
  section: 'ClosingCallToAction',
  kind: 'split',
  eyebrow: 'Build',
  title: 'Build once.',
  titleMuted: 'Run everywhere.',
  description: 'Get a faster path to launch, lower latency, and less infrastructure overhead.',
  actions: [{ label: 'Start Free', href: '/signup', kind: 'secondary' }],
  aside: { label: 'Talk to our team', href: '#' }
}

export const PRODUCT_CUSTOMERS_ACTION = {
  label: 'Customers',
  href: '/site/home',
  kind: 'outlined',
  trailing: true
}

export const registeredClient = (name) => CLIENTS.find((client) => client.name === name) ?? { name }

const wallItem = (client) => ({ alt: client.name, src: client.logo ?? '', client })

export const CACHE_FAMILY_WALL = [
  registeredClient('NZN'),
  AXUR,
  registeredClient('Radware'),
  AREZZO,
  CONTABILIZEI,
  registeredClient('Magalu'),
  registeredClient('Fourbank'),
  CREFISA,
  registeredClient('Netshoes'),
  registeredClient('Dafiti'),
  registeredClient('Global Fashion Group')
].map(wallItem)

export const withWallClient = (client) => [...CACHE_FAMILY_WALL, wallItem(client)]

export const foldList = (description, items) =>
  `${description} ${items.map((item) => item.label).join(', ')}.`

export const PRODUCT_GROUPS = [
  {
    label: 'Compute',
    items: [
      {
        icon: 'ai ai-workloads',
        title: 'Workloads',
        description: 'Put an application on a hostname, everywhere',
        href: '/site/products/workloads'
      },
      {
        icon: 'ai ai-edge-application',
        title: 'Applications',
        description: 'Decide what happens to every request',
        href: '/site/products/applications'
      },
      {
        icon: 'ai ai-edge-functions',
        title: 'Functions',
        description: 'Run serverless code at the edge',
        href: '/site/products/functions'
      },
      {
        icon: 'ai ai-load-balancer',
        title: 'Load Balancer',
        description: 'Distribute traffic for availability'
      }
    ]
  },
  {
    label: 'Deliver',
    items: [
      {
        icon: 'ai ai-tiered-cache',
        title: 'Cache',
        description: 'Speed up content delivery',
        href: '/site/products/cache'
      },
      {
        icon: 'ai ai-app-accelerator',
        title: 'Application Accelerator',
        description: 'Optimize dynamic applications',
        href: '/site/products/application-accelerator'
      },
      {
        icon: 'ai ai-image-processor',
        title: 'Image Processor',
        description: 'Optimize and transform images in real time'
      },
      {
        icon: 'ai ai-edge-dns',
        title: 'DNS',
        description: 'Distributed authoritative DNS'
      }
    ]
  },
  {
    label: 'Store',
    items: [
      {
        icon: 'ai ai-edge-storage',
        title: 'Object Storage',
        description: 'Store and serve objects at the edge',
        href: '/site/products/object-storage'
      },
      {
        icon: 'ai ai-edge-sql',
        title: 'SQL Database',
        description: 'A distributed SQL database'
      },
      {
        icon: 'ai ai-edge-kv',
        title: 'KV Store',
        description: 'Low-latency key-value store'
      },
      {
        icon: 'ai ai-edge-ai',
        title: 'AI Inference',
        description: 'Run models close to the user',
        href: '/site/products/ai-inference'
      }
    ]
  },
  {
    label: 'Secure',
    items: [
      {
        icon: 'ai ai-edge-firewall',
        title: 'Firewall',
        description: 'Filter every request before it reaches your code'
      },
      {
        icon: 'ai ai-waf-rules',
        title: 'WAF',
        description: 'Web application firewall',
        href: '/site/products/web-application-firewall'
      },
      {
        icon: 'ai ai-network-lists',
        title: 'Network Shield',
        description: 'Network and DDoS protection'
      },
      {
        icon: 'ai ai-real-time-metrics',
        title: 'Real-Time Metrics',
        description: 'Watch traffic, errors and latency as they happen'
      }
    ]
  }
]
