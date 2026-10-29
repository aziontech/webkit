import { markRaw } from 'vue'

import DiagramSet from '../ui/diagram/DiagramSet.vue'

export const PRODUCT_ARCHITECTURES = [
  {
    key: 'workloads',
    group: 'build',
    title: 'Workloads',
    summary: 'Routing sends each request to the nearest data center, where the workload answers it.'
  },
  {
    key: 'applications',
    group: 'build',
    title: 'Applications',
    summary:
      'Rules walk every request in order and decide where it goes: cache, a function or the origin.'
  },
  {
    key: 'functions',
    group: 'build',
    title: 'Functions',
    summary:
      'A rule runs your code on the routes that need it, with no cold start, before the origin is reached.'
  },
  {
    key: 'application-accelerator',
    group: 'deliver',
    title: 'Application Accelerator',
    summary:
      'Dynamic routes take a tuned path to the origin while static assets never leave the cache.'
  },
  {
    key: 'cache',
    group: 'deliver',
    title: 'Cache',
    summary:
      'A hit is answered in the nearest data center; a miss crosses Tiered Cache before the origin.'
  },
  {
    key: 'image-processor',
    group: 'deliver',
    title: 'Image Processor',
    summary: 'One source image, every variant derived on demand and cached like any other response.'
  },
  {
    key: 'load-balancer',
    group: 'deliver',
    title: 'Load Balancer',
    summary: 'Traffic is weighted across origins, and an unhealthy one drops out of the pool.'
  },
  {
    key: 'edge-dns',
    group: 'deliver',
    title: 'DNS',
    summary: 'An authoritative zone answered from the nearest DNS node, with DNSSEC on.'
  },
  {
    key: 'ai-inference',
    group: 'ai',
    title: 'AI Inference',
    summary:
      'A model runs close to the user, with vector search for context and your own LoRA adapter.'
  },
  {
    key: 'ai-gateway',
    group: 'ai',
    title: 'AI Gateway',
    summary:
      'Every model call crosses Firewall and one function that checks the key, routes and logs it.'
  },
  {
    key: 'object-storage',
    group: 'store',
    title: 'Object Storage',
    summary:
      'A bucket is the origin: objects are cached at the edge and uploaded with any S3 client.'
  },
  {
    key: 'sql-database',
    group: 'store',
    title: 'SQL Database',
    summary: 'Reads come from the nearest replica; writes are applied once on the primary.'
  },
  {
    key: 'kv-store',
    group: 'store',
    title: 'KV Store',
    summary: 'A key is read from the edge in the same data center and written everywhere.'
  },
  {
    key: 'web-application-firewall',
    group: 'secure',
    title: 'WAF',
    summary: 'Payloads are scored for injection and scripting attacks, and threats get a 403.'
  },
  {
    key: 'bot-manager',
    group: 'secure',
    title: 'Bot Management',
    summary:
      'Each request is scored and classified; humans go on, bad bots are denied, dropped or delayed.'
  },
  {
    key: 'firewall',
    group: 'secure',
    title: 'Firewall',
    summary: 'Network lists, the WAF and rate limits run in order before any application code.'
  },
  {
    key: 'network-shield',
    group: 'secure',
    title: 'Network Shield',
    summary: 'Network lists drop listed ASNs, countries and IPs at the border, before the Firewall.'
  },
  {
    key: 'ddos-protection',
    group: 'secure',
    title: 'DDoS Protection',
    summary: 'A flood is absorbed at the edge while legitimate traffic keeps reaching the workload.'
  },
  {
    key: 'data-stream',
    group: 'observe',
    title: 'Data Stream',
    summary: 'Logs from every product leave through a connector to your SIEM or data lake.'
  },
  {
    key: 'real-time-events',
    group: 'observe',
    title: 'Real-Time Events',
    summary:
      'Every request becomes a queryable event within seconds, in the Console or over GraphQL.'
  },
  {
    key: 'real-time-metrics',
    group: 'observe',
    title: 'Real-Time Metrics',
    summary:
      'Traffic, errors and latency on live dashboards, or pulled into your tools over GraphQL.'
  }
]

export const PRODUCT_ARCHITECTURE_GROUPS = [
  {
    key: 'build',
    label: 'Build',
    title: 'How a request reaches your code',
    description:
      'A workload puts an application on a hostname; its rules decide what each request does, and a function runs where logic is needed.'
  },
  {
    key: 'deliver',
    label: 'Deliver',
    title: 'How a response gets there faster',
    description:
      'Cache holds what repeats, Image Processor derives what varies, and the accelerator, the balancer and DNS shape the path to the origin.'
  },
  {
    key: 'ai',
    label: 'AI',
    title: 'How a model call is answered',
    description:
      'AI Inference runs models close to the user; AI Gateway puts every call, to any provider, through one control point.'
  },
  {
    key: 'store',
    label: 'Store',
    title: 'How data stays close to the request',
    description:
      'Objects, rows and keys live in the data centers that serve them, so a read never crosses an ocean.'
  },
  {
    key: 'secure',
    label: 'Secure',
    title: 'How a threat is stopped early',
    description:
      'Each layer filters before the next: the network border, the Firewall rules, the WAF and Bot Management, all before your application runs.'
  },
  {
    key: 'observe',
    label: 'Observe',
    title: 'How every request is seen',
    description:
      'Metrics, events and logs leave every data center as they happen, to the Console and to the tools you already run.'
  }
]

const PLATFORM_TABS = [
  {
    value: 'request-path',
    title: 'Request path',
    description:
      'Routing sends the request to the nearest data center, where the workload answers from cache or the origin.',
    architecture: 'workloads'
  },
  {
    value: 'security',
    title: 'Security first',
    description: 'Network lists, the WAF and rate limits run in order before any application code.',
    architecture: 'firewall'
  },
  {
    value: 'compute',
    title: 'Code at the edge',
    description: 'A rule runs a function on the routes that need logic, with no cold start.',
    architecture: 'functions'
  },
  {
    value: 'data',
    title: 'Data close by',
    description: 'Reads come from the nearest replica; writes are applied once on the primary.',
    architecture: 'sql-database'
  },
  {
    value: 'observe',
    title: 'Every request seen',
    description:
      'Each request becomes a queryable event within seconds, in the Console or over GraphQL.',
    architecture: 'real-time-events'
  }
]

const architectureByKey = (key) =>
  PRODUCT_ARCHITECTURES.find((architecture) => architecture.key === key)

export const PLATFORM_ARCHITECTURE_DIAGRAMS = PLATFORM_TABS.map(({ value, architecture }) => ({
  value,
  name: architectureByKey(architecture).key
}))

export const PLATFORM_ARCHITECTURE_BAND = {
  section: 'ArchitectureTabs',
  anchor: 'platform-architecture',
  eyebrow: 'Platform',
  title: 'One request through the Azion platform',
  description:
    'The base architecture every product plugs into: a workload answers near the user, Firewall filters first, a function runs where logic is needed, data sits in the same data center, and every request is seen.',
  position: 'bottom',
  tabs: PLATFORM_TABS.map(({ value, title, description }) => ({ value, title, description })),
  scene: { component: markRaw(DiagramSet), props: { diagrams: PLATFORM_ARCHITECTURE_DIAGRAMS } },
  action: { label: 'See every product', href: '/site/products', trailing: true }
}
