import { CLIENTS } from '@aziontech/webkit/assets/client-registry'

import { AREZZO, AXUR, CONTABILIZEI, CREFISA } from './clients.js'

export const PRODUCT_DOCS = '/site/docs'

export const PRODUCT_HERO_ACTIONS = [
  { label: 'Start for free', href: '/signup', kind: 'secondary' },
  { label: 'Docs', href: PRODUCT_DOCS, kind: 'outlined', trailing: true }
]

export const PRODUCT_DOCS_ACTIONS = [
  { label: 'Docs', href: PRODUCT_DOCS, kind: 'outlined', trailing: true }
]

export const PRODUCT_DIRECTORY = {
  section: 'PlatformDirectory',
  eyebrow: 'Complete, not complex',
  title: 'A full-stack platform that scales instantly'
}

export const PLATFORM_DIRECTORY = {
  section: 'PlatformDirectory',
  title: 'Everything you need to build and run applications',
  ariaLabel: 'Azion products'
}

const START_FREE_ACTION = { label: 'Start for free', href: '/signup', kind: 'secondary' }

const AGENT_AUDIENCES = [
  {
    value: 'humans',
    label: 'For humans',
    actions: [
      START_FREE_ACTION,
      { label: 'Talk to sales', href: '/site/contact/sales', kind: 'outlined', trailing: true }
    ]
  },
  {
    value: 'agents',
    label: 'For agents',
    prompt: 'Connect Azion MCP: https://mcp.azion.com',
    actions: [
      {
        label: 'Read the agent docs',
        href: '/site/docs/agent-setup',
        kind: 'outlined',
        trailing: true
      }
    ]
  }
]

export const agentsClosing = (title) => ({
  section: 'ClosingCallToAction',
  kind: 'agents',
  title,
  typedLead: 'Drive one platform from the',
  typedWords: ['Console', 'CLI', 'MCP server'],
  description: 'A person and an agent ship the same way.',
  audiencesLabel: 'Audience',
  audiences: AGENT_AUDIENCES
})

export const salesClosing = ({ eyebrow, title, titleMuted, description }) => ({
  section: 'ClosingCallToAction',
  kind: 'split',
  eyebrow,
  title,
  titleMuted,
  description,
  actions: [START_FREE_ACTION],
  aside: { label: 'Talk to sales', href: '/site/contact/sales' }
})

export const primaryClosing = ({ title, description }) => ({
  section: 'ClosingCallToAction',
  kind: 'primary',
  title,
  description,
  actions: [
    START_FREE_ACTION,
    { label: 'Docs', href: PRODUCT_DOCS, kind: 'outlined', trailing: true }
  ]
})

export const PRODUCT_CLOSING = primaryClosing({
  title: 'Build, run, and protect applications everywhere.',
  description: 'Get faster launches, lower latency, and less infrastructure overhead from day one.'
})

// The closing every Company page (the footer's Company column) ends on.
export const COMPANY_CLOSING = PRODUCT_CLOSING

export const PRODUCT_SECURITY_CLOSING = primaryClosing({
  title: 'Protect applications and APIs everywhere.',
  description:
    'Stop attacks at the edge before they reach your origin, with no security appliances to run.'
})

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
    label: 'Build',
    items: [
      {
        icon: 'ai ai-workloads',
        title: 'Workloads',
        description: 'Serve an application on your hostname, globally',
        href: '/site/products/workloads'
      },
      {
        icon: 'ai ai-edge-functions',
        title: 'Functions',
        description: 'Run code globally with no cold starts',
        href: '/site/products/functions'
      },
      {
        icon: 'ai ai-tiered-cache',
        title: 'Cache',
        description: 'Speed up content delivery',
        href: '/site/products/cache'
      },
      {
        icon: 'ai ai-app-accelerator',
        title: 'Application Accelerator',
        description: 'Speed up dynamic apps and APIs',
        href: '/site/products/application-accelerator'
      },
      {
        icon: 'ai ai-image-processor',
        title: 'Image Processor',
        description: 'Resize and convert images on demand',
        href: '/site/products/image-processor'
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
    label: 'Store',
    items: [
      {
        icon: 'ai ai-edge-storage',
        title: 'Object Storage',
        description: 'Store and serve objects close to users',
        href: '/site/products/object-storage'
      },
      {
        icon: 'ai ai-edge-sql',
        title: 'SQL Database',
        description: 'Run SQL on a distributed database',
        href: '/site/products/sql-database'
      },
      {
        icon: 'ai ai-edge-kv',
        title: 'KV Store',
        description: 'Store key-value data with low latency',
        href: '/site/products/kv-store'
      }
    ]
  },
  {
    label: 'Secure',
    items: [
      {
        icon: 'ai ai-waf-rules',
        title: 'WAF',
        description: 'Block common attacks close to traffic',
        href: '/site/products/web-application-firewall'
      },
      {
        icon: 'ai ai-network-lists',
        title: 'Network Shield',
        description: 'Stop network and DDoS attacks early',
        href: '/site/products/network-shield'
      },
      {
        icon: 'ai ai-load-balancer',
        title: 'Load Balancer',
        description: 'Spread traffic across origins for availability',
        href: '/site/products/load-balancer'
      },
      {
        icon: 'ai ai-edge-dns',
        title: 'Edge DNS',
        description: 'Authoritative DNS, distributed globally',
        href: '/site/products/edge-dns'
      },
      {
        icon: 'ai ai-ai-gateway',
        title: 'AI Gateway',
        description: 'Route, secure and log every model call',
        href: '/site/products/ai-gateway'
      }
    ]
  },
  {
    label: 'Observe',
    items: [
      {
        icon: 'ai ai-data-stream',
        title: 'Data Stream',
        description: 'Send logs and events to your SIEM or data lake',
        href: '/site/products/data-stream'
      },
      {
        icon: 'ai ai-real-time-events',
        title: 'Real-Time Events',
        description: 'Investigate every request in seconds',
        href: '/site/products/real-time-events'
      }
    ]
  }
]
