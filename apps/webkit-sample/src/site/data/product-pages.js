import { CLIENTS } from '@aziontech/webkit/assets/client-registry'

import { AREZZO, AXUR, CONTABILIZEI, CREFISA } from './clients.js'

export const PRODUCT_DOCS = '/site/docs'

export const PRODUCT_HERO_ACTIONS = [
  { label: 'Start for free', href: '/signup', kind: 'secondary' },
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

const CLI_INSTALL = 'npm install -g azion'

const START_FREE_ACTION = { label: 'Start for free', href: '/signup', kind: 'secondary' }

const AGENT_AUDIENCES = [
  {
    value: 'humans',
    label: 'For humans',
    command: CLI_INSTALL,
    actions: [START_FREE_ACTION]
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
  aside: { label: 'Talk to a specialist', href: '/site/contact' }
})

export const primaryClosing = ({ title, description, benefits }) => ({
  section: 'ClosingCallToAction',
  kind: 'primary',
  title,
  description,
  actions: [
    START_FREE_ACTION,
    { label: 'Docs', href: PRODUCT_DOCS, kind: 'outlined', trailing: true }
  ],
  benefitsLabel: 'Why teams choose Azion',
  benefits
})

export const PRODUCT_CLOSING = primaryClosing({
  title: 'Build, run, and protect applications everywhere.',
  description: 'Get faster launches, lower latency, and less infrastructure overhead from day one.',
  benefits: [
    { icon: 'ai ai-edge-nodes', label: 'Deployed to 100+ data centers automatically' },
    { icon: 'ai ai-edge-functions', label: 'No regions to pick, no servers to manage' },
    { icon: 'ai ai-origin-shield', label: 'Stop attacks before they reach your origin' },
    { icon: 'ai ai-edge-firewall', label: 'DDoS mitigation with no surprise charges' },
    { icon: 'pi pi-dollar', label: 'Usage-based pricing with no hidden fees' },
    { icon: 'pi pi-gift', label: 'Start with $300 in free credits' },
    { icon: 'ai ai-azion-cli', label: 'Deploy from the CLI, the Console or an agent' },
    { icon: 'ai ai-real-time-metrics', label: 'Real-time events and metrics for every request' },
    { icon: 'ai ai-real-time-purge', label: 'Purge the cache everywhere in real time' },
    { icon: 'pi pi-code', label: 'Works with Vue, React, Next.js, Astro and more' },
    { icon: 'ai ai-edge-ai', label: 'Run AI inference next to your users' },
    { icon: 'ai ai-edge-sql', label: 'A SQL database close to users, no setup' },
    { icon: 'ai ai-edge-storage', label: 'Object storage with no egress fees' },
    { icon: 'ai ai-waf-rules', label: 'WAF and bot protection on by default' },
    { icon: 'ai ai-tiered-cache', label: 'Tiered cache that shields your origin' },
    { icon: 'ai ai-data-stream', label: 'Stream every log to the tools you already use' }
  ]
})

// The closing every Company page (the footer's Company column) ends on.
export const COMPANY_CLOSING = PRODUCT_CLOSING

export const PRODUCT_SECURITY_CLOSING = primaryClosing({
  title: 'Protect applications and APIs everywhere.',
  description:
    'Stop attacks at the edge before they reach your origin, with no security appliances to run.',
  benefits: [
    { icon: 'ai ai-origin-shield', label: 'Stop attacks before they reach your origin' },
    { icon: 'ai ai-edge-firewall', label: 'DDoS mitigation with no surprise charges' },
    { icon: 'ai ai-waf-rules', label: 'OWASP protection you turn on, then tune' },
    { icon: 'ai ai-bot-manager', label: 'Bot scoring with flexible mitigation actions' },
    { icon: 'ai ai-adaptive-security', label: 'Low false positives on legitimate traffic' },
    { icon: 'ai ai-security-team', label: "Zero-day rules you don't have to update" },
    { icon: 'ai ai-network-lists', label: 'Rules synced to every data center automatically' },
    { icon: 'ai ai-edge-functions', label: 'Extend any rule with your own Functions' },
    { icon: 'ai ai-real-time-events', label: 'Investigate every security event as it happens' },
    { icon: 'ai ai-data-stream', label: 'Stream security events to your SIEM' },
    { icon: 'ai ai-edge-nodes', label: 'Protection on every request, in 100+ data centers' },
    { icon: 'pi pi-gift', label: 'Start with $300 in free credits' }
  ]
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
