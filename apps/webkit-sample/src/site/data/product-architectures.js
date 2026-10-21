import { markRaw } from 'vue'

import DiagramSet from '../ui/diagram/DiagramSet.vue'
import { GATEWAY_REQUEST_PATH, WORKLOAD_REQUEST_PATH } from './diagrams.js'

const user = (title = 'User', icon = 'pi pi-user') => ({
  key: 'user',
  kind: 'pill',
  title,
  icon,
  active: true
})

const application = (title, status) => ({
  key: 'application',
  kind: 'card',
  eyebrow: 'Application',
  title,
  icon: 'ai ai-rules-engine',
  active: true,
  ...(status ? { status } : {})
})

const workload = (title = 'shop.example.com') => ({
  key: 'workload',
  kind: 'card',
  eyebrow: 'Workload',
  title,
  icon: 'ai ai-workloads',
  active: true
})

const origin = (title = 'origin.example.com', extra = {}) => ({
  key: 'origin',
  kind: 'item',
  eyebrow: 'Origin',
  title,
  icon: 'pi pi-database',
  ...extra
})

const ok = (label) => ({ label, severity: 'success' })
const info = (label) => ({ label, severity: 'info' })
const warn = (label) => ({ label, severity: 'warning' })

const path = (...keys) =>
  keys.slice(1).map((key, index) => ({ from: keys[index], to: key, active: true }))

const fan = (from, ...targets) =>
  targets.map(([to, label, active]) => ({ from, to, label, ...(active ? { active: true } : {}) }))

const APPLICATIONS = {
  nodes: [
    user(),
    application('Rules in order, every request', ok('2 phases')),
    {
      key: 'cache',
      kind: 'item',
      eyebrow: 'Deliver',
      title: 'Static assets from cache',
      icon: 'ai ai-tiered-cache',
      active: true
    },
    {
      key: 'function',
      kind: 'item',
      eyebrow: 'Run',
      title: 'auth-handler on /account',
      icon: 'ai ai-edge-functions'
    },
    origin('Your API on /api')
  ],
  layout: {
    gap: 'wide',
    row: [
      { node: 'user' },
      { node: 'application' },
      { branches: [{ node: 'cache' }, { node: 'function' }, { node: 'origin' }] }
    ]
  },
  edges: [
    ...path('user', 'application'),
    ...fan('application', ['cache', 'assets', true], ['function', '/account'], ['origin', '/api'])
  ]
}

const FUNCTIONS = {
  nodes: [
    user('Request'),
    application('Rule: run a function on /account'),
    {
      key: 'function',
      kind: 'card',
      eyebrow: 'Functions',
      title: 'auth-handler',
      icon: 'ai ai-edge-functions',
      status: ok('No cold start'),
      active: true,
      lit: true
    },
    {
      key: 'response',
      kind: 'item',
      eyebrow: 'Answered here',
      title: 'Response from the edge',
      icon: 'pi pi-check',
      active: true
    },
    origin('Your API')
  ],
  layout: {
    gap: 'wide',
    row: [
      { node: 'user' },
      { node: 'application' },
      { node: 'function' },
      { branches: [{ node: 'response' }, { node: 'origin' }] }
    ]
  },
  edges: [
    ...path('user', 'application', 'function'),
    ...fan('function', ['response', 'handled', true], ['origin', 'forwarded'])
  ]
}

const APPLICATION_ACCELERATOR = {
  nodes: [
    user(),
    application('Rule: dynamic routes'),
    {
      key: 'accelerator',
      kind: 'card',
      eyebrow: 'Application Accelerator',
      title: 'Tuned route, fewer round trips',
      icon: 'ai ai-app-accelerator',
      active: true,
      lit: true
    },
    origin('api.example.com', { active: true }),
    {
      key: 'cache',
      kind: 'item',
      eyebrow: 'Cache',
      title: 'Static assets, no origin call',
      icon: 'ai ai-tiered-cache'
    }
  ],
  layout: {
    gap: 'wide',
    row: [
      { node: 'user' },
      { node: 'application' },
      { branches: [{ row: [{ node: 'accelerator' }, { node: 'origin' }] }, { node: 'cache' }] }
    ]
  },
  edges: [
    ...path('user', 'application'),
    ...fan('application', ['accelerator', 'dynamic', true], ['cache', 'static']),
    ...path('accelerator', 'origin')
  ]
}

const CACHE = {
  nodes: [
    user(),
    application('Cache policy: hold for 60 s'),
    {
      key: 'cache',
      kind: 'card',
      eyebrow: 'Cache',
      title: 'Edge cache in the nearest data center',
      icon: 'ai ai-tiered-cache',
      status: ok('Hit'),
      active: true,
      lit: true
    },
    {
      key: 'tiered',
      kind: 'item',
      eyebrow: 'Tiered Cache',
      title: 'Second layer before the origin',
      icon: 'ai ai-origin-shield'
    },
    origin()
  ],
  layout: {
    gap: 'wide',
    row: [
      { node: 'user' },
      { node: 'application' },
      { node: 'cache' },
      { branches: [{ node: 'tiered' }, { node: 'origin' }] }
    ]
  },
  edges: [
    ...path('user', 'application', 'cache'),
    ...fan('cache', ['tiered', 'miss']),
    ...fan('tiered', ['origin', 'miss'])
  ]
}

const IMAGE_PROCESSOR = {
  nodes: [
    user('Browser', 'pi pi-globe'),
    application('Rule: optimize images'),
    {
      key: 'processor',
      kind: 'card',
      eyebrow: 'Image Processor',
      title: 'fit-in/400x400, WebP',
      icon: 'ai ai-image-processor',
      status: ok('Variant cached'),
      active: true,
      lit: true
    },
    {
      key: 'cache',
      kind: 'item',
      eyebrow: 'Cache',
      title: 'Same variant, no work',
      icon: 'ai ai-tiered-cache',
      active: true
    },
    origin('One source image', { icon: 'pi pi-image' })
  ],
  layout: {
    gap: 'wide',
    row: [
      { node: 'user' },
      { node: 'application' },
      { node: 'processor' },
      { branches: [{ node: 'cache' }, { node: 'origin' }] }
    ]
  },
  edges: [
    ...path('user', 'application', 'processor'),
    ...fan('processor', ['cache', 'next hit', true], ['origin', 'first hit'])
  ]
}

const LOAD_BALANCER = {
  nodes: [
    user(),
    application('Rule: balance the origin pool'),
    {
      key: 'balancer',
      kind: 'card',
      eyebrow: 'Load Balancer',
      title: 'Weighted, with health checks',
      icon: 'ai ai-load-balancer',
      status: ok('3 origins'),
      active: true,
      lit: true
    },
    {
      key: 'east',
      kind: 'item',
      eyebrow: 'Origin',
      title: 'origin-a · us-east',
      icon: 'pi pi-server',
      active: true
    },
    {
      key: 'west',
      kind: 'item',
      eyebrow: 'Origin',
      title: 'origin-b · eu-west',
      icon: 'pi pi-server'
    },
    {
      key: 'south',
      kind: 'item',
      eyebrow: 'Origin',
      title: 'origin-c · sa-east',
      icon: 'pi pi-server',
      status: warn('Unhealthy')
    }
  ],
  layout: {
    gap: 'wide',
    row: [
      { node: 'user' },
      { node: 'application' },
      { node: 'balancer' },
      { branches: [{ node: 'east' }, { node: 'west' }, { node: 'south' }] }
    ]
  },
  edges: [
    ...path('user', 'application', 'balancer'),
    ...fan('balancer', ['east', '60%', true], ['west', '40%'], ['south', 'out'])
  ]
}

const DNS = {
  nodes: [
    user('Resolver', 'pi pi-globe'),
    {
      key: 'dns',
      kind: 'card',
      eyebrow: 'DNS',
      title: 'shop.example.com zone',
      icon: 'ai ai-edge-dns',
      status: ok('DNSSEC'),
      active: true,
      lit: true
    },
    {
      key: 'apex',
      kind: 'item',
      eyebrow: 'A record',
      title: 'Points at the workload',
      icon: 'ai ai-workloads',
      active: true
    },
    {
      key: 'mail',
      kind: 'item',
      eyebrow: 'MX record',
      title: 'Mail provider',
      icon: 'pi pi-envelope'
    },
    {
      key: 'txt',
      kind: 'item',
      eyebrow: 'TXT record',
      title: 'Domain verification',
      icon: 'pi pi-key'
    }
  ],
  layout: {
    gap: 'wide',
    row: [
      { node: 'user' },
      { node: 'dns' },
      { branches: [{ node: 'apex' }, { node: 'mail' }, { node: 'txt' }] }
    ]
  },
  edges: [
    ...path('user', 'dns'),
    ...fan('dns', ['apex', 'apex', true], ['mail', 'mail'], ['txt', '_verify'])
  ]
}

const AI_INFERENCE = {
  nodes: [
    user('App', 'pi pi-comments'),
    application('Rule: run the model'),
    {
      key: 'inference',
      kind: 'card',
      eyebrow: 'AI Inference',
      title: 'Mistral 3 Small on Azion',
      icon: 'ai ai-edge-ai',
      status: ok('Under 30 ms'),
      active: true,
      lit: true
    },
    {
      key: 'vector',
      kind: 'item',
      eyebrow: 'SQL Database',
      title: 'Vector search for context',
      icon: 'ai ai-edge-sql',
      active: true
    },
    {
      key: 'lora',
      kind: 'item',
      eyebrow: 'LoRA',
      title: 'Your fine-tuned adapter',
      icon: 'ai ai-lora'
    }
  ],
  layout: {
    gap: 'wide',
    row: [
      { node: 'user' },
      { node: 'application' },
      { node: 'inference' },
      { branches: [{ node: 'vector' }, { node: 'lora' }] }
    ]
  },
  edges: [
    ...path('user', 'application', 'inference'),
    ...fan('inference', ['vector', 'RAG', true], ['lora', 'tuned'])
  ]
}

const OBJECT_STORAGE = {
  nodes: [
    user(),
    application('Rule: origin is a bucket'),
    {
      key: 'storage',
      kind: 'card',
      eyebrow: 'Object Storage',
      title: 'assets bucket',
      icon: 'ai ai-edge-storage',
      status: ok('$0 egress'),
      active: true,
      lit: true
    },
    {
      key: 'cache',
      kind: 'item',
      eyebrow: 'Cache',
      title: 'Object cached at the edge',
      icon: 'ai ai-tiered-cache',
      active: true
    },
    {
      key: 's3',
      kind: 'item',
      eyebrow: 'S3 API',
      title: 'Any S3-compatible client',
      icon: 'pi pi-code'
    }
  ],
  layout: {
    gap: 'wide',
    row: [
      { node: 'user' },
      { node: 'application' },
      { node: 'storage' },
      { branches: [{ node: 'cache' }, { node: 's3' }] }
    ]
  },
  edges: [
    ...path('user', 'application', 'storage'),
    ...fan('storage', ['cache', 'next hit', true], ['s3', 'uploads'])
  ]
}

const SQL_DATABASE = {
  nodes: [
    user('Request'),
    {
      key: 'function',
      kind: 'card',
      eyebrow: 'Functions',
      title: 'orders-api',
      icon: 'ai ai-edge-functions',
      active: true
    },
    {
      key: 'sql',
      kind: 'card',
      eyebrow: 'SQL Database',
      title: 'orders, replicated',
      icon: 'ai ai-edge-sql',
      status: ok('SQLite dialect'),
      active: true,
      lit: true
    },
    {
      key: 'replica',
      kind: 'item',
      eyebrow: 'Read replica',
      title: 'Nearest data center',
      icon: 'ai ai-edge-nodes',
      active: true
    },
    {
      key: 'primary',
      kind: 'item',
      eyebrow: 'Primary',
      title: 'Writes applied once',
      icon: 'pi pi-database'
    }
  ],
  layout: {
    gap: 'wide',
    row: [
      { node: 'user' },
      { node: 'function' },
      { node: 'sql' },
      { branches: [{ node: 'replica' }, { node: 'primary' }] }
    ]
  },
  edges: [
    ...path('user', 'function', 'sql'),
    ...fan('sql', ['replica', 'reads', true], ['primary', 'writes'])
  ]
}

const KV_STORE = {
  nodes: [
    user('Request'),
    {
      key: 'function',
      kind: 'card',
      eyebrow: 'Functions',
      title: 'session-check',
      icon: 'ai ai-edge-functions',
      active: true
    },
    {
      key: 'kv',
      kind: 'card',
      eyebrow: 'KV Store',
      title: 'sessions namespace',
      icon: 'ai ai-edge-kv',
      status: ok('Low latency'),
      active: true,
      lit: true
    },
    {
      key: 'get',
      kind: 'item',
      eyebrow: 'get',
      title: 'Value from the edge',
      icon: 'pi pi-bolt',
      active: true
    },
    {
      key: 'put',
      kind: 'item',
      eyebrow: 'put',
      title: 'Replicated everywhere',
      icon: 'pi pi-globe'
    }
  ],
  layout: {
    gap: 'wide',
    row: [
      { node: 'user' },
      { node: 'function' },
      { node: 'kv' },
      { branches: [{ node: 'get' }, { node: 'put' }] }
    ]
  },
  edges: [...path('user', 'function', 'kv'), ...fan('kv', ['get', 'read', true], ['put', 'write'])]
}

const firewall = (title = 'Rules in order') => ({
  key: 'firewall',
  kind: 'card',
  eyebrow: 'Firewall',
  title,
  icon: 'ai ai-edge-firewall',
  active: true
})

const WAF = {
  nodes: [
    user('Request'),
    firewall('Rule: run the WAF'),
    {
      key: 'waf',
      kind: 'card',
      eyebrow: 'WAF',
      title: 'SQLi, XSS, RCE scored',
      icon: 'ai ai-waf-rules',
      status: ok('Blocking'),
      active: true,
      lit: true
    },
    {
      key: 'application',
      kind: 'item',
      eyebrow: 'Application',
      title: 'Clean traffic goes on',
      icon: 'ai ai-edge-application',
      active: true
    },
    {
      key: 'blocked',
      kind: 'item',
      eyebrow: 'Block',
      title: '403 to the attacker',
      icon: 'pi pi-ban'
    }
  ],
  layout: {
    gap: 'wide',
    row: [
      { node: 'user' },
      { node: 'firewall' },
      { node: 'waf' },
      { branches: [{ node: 'application' }, { node: 'blocked' }] }
    ]
  },
  edges: [
    ...path('user', 'firewall', 'waf'),
    ...fan('waf', ['application', 'allowed', true], ['blocked', 'threat'])
  ]
}

const BOT_MANAGEMENT = {
  nodes: [
    user('Request'),
    firewall('Rule: run Bot Management'),
    {
      key: 'bots',
      kind: 'card',
      eyebrow: 'Bot Management',
      title: 'Score, then classify',
      icon: 'ai ai-bot-manager',
      status: info('Score 12'),
      active: true,
      lit: true
    },
    {
      key: 'human',
      kind: 'item',
      eyebrow: 'Human',
      title: 'Request allowed',
      icon: 'pi pi-user',
      active: true
    },
    {
      key: 'bot',
      kind: 'item',
      eyebrow: 'Bad bot',
      title: 'Deny, drop or delay',
      icon: 'pi pi-ban'
    }
  ],
  layout: {
    gap: 'wide',
    row: [
      { node: 'user' },
      { node: 'firewall' },
      { node: 'bots' },
      { branches: [{ node: 'human' }, { node: 'bot' }] }
    ]
  },
  edges: [
    ...path('user', 'firewall', 'bots'),
    ...fan('bots', ['human', 'human', true], ['bot', 'bot'])
  ]
}

const FIREWALL = {
  nodes: [
    user('Request'),
    { ...firewall('Rules in order, before any code'), lit: true },
    {
      key: 'lists',
      kind: 'item',
      eyebrow: 'Network lists',
      title: 'IP, ASN and country',
      icon: 'ai ai-network-lists',
      active: true
    },
    {
      key: 'waf',
      kind: 'item',
      eyebrow: 'WAF',
      title: 'Payload inspection',
      icon: 'ai ai-waf-rules',
      active: true
    },
    {
      key: 'limit',
      kind: 'item',
      eyebrow: 'Rate limit',
      title: 'Requests per second',
      icon: 'pi pi-clock',
      active: true
    },
    {
      key: 'application',
      kind: 'card',
      eyebrow: 'Application',
      title: 'storefront',
      icon: 'ai ai-edge-application',
      active: true
    }
  ],
  layout: {
    gap: 'wide',
    row: [
      { node: 'user' },
      { node: 'firewall' },
      { branches: [{ node: 'lists' }, { node: 'waf' }, { node: 'limit' }] },
      { node: 'application' }
    ]
  },
  edges: [
    ...path('user', 'firewall'),
    ...fan('firewall', ['lists', '', true], ['waf', '', true], ['limit', '', true]),
    ...path('lists', 'application'),
    ...path('waf', 'application'),
    ...path('limit', 'application')
  ]
}

const NETWORK_SHIELD = {
  nodes: [
    user('Traffic', 'pi pi-globe'),
    {
      key: 'shield',
      kind: 'card',
      eyebrow: 'Network Shield',
      title: 'Network lists at the border',
      icon: 'ai ai-network-lists',
      status: ok('L3 and L4'),
      active: true,
      lit: true
    },
    {
      key: 'allowed',
      kind: 'item',
      eyebrow: 'Allowed',
      title: 'Reaches the Firewall',
      icon: 'ai ai-edge-firewall',
      active: true
    },
    {
      key: 'dropped',
      kind: 'item',
      eyebrow: 'Dropped',
      title: 'Listed ASN, country or IP',
      icon: 'pi pi-ban'
    }
  ],
  layout: {
    gap: 'wide',
    row: [
      { node: 'user' },
      { node: 'shield' },
      { branches: [{ node: 'allowed' }, { node: 'dropped' }] }
    ]
  },
  edges: [
    ...path('user', 'shield'),
    ...fan('shield', ['allowed', 'clean', true], ['dropped', 'listed'])
  ]
}

const DDOS_PROTECTION = {
  nodes: [
    user('Users and attackers', 'pi pi-exclamation-triangle'),
    {
      key: 'ddos',
      kind: 'card',
      eyebrow: 'DDoS Protection',
      title: 'Always-on mitigation',
      icon: 'pi pi-shield',
      status: ok('Mitigated'),
      active: true,
      lit: true
    },
    { ...workload(), kind: 'item' },
    {
      key: 'absorbed',
      kind: 'item',
      eyebrow: 'Flood',
      title: 'Absorbed at the edge',
      icon: 'pi pi-ban'
    }
  ],
  layout: {
    gap: 'wide',
    row: [
      { node: 'user' },
      { node: 'ddos' },
      { branches: [{ node: 'workload' }, { node: 'absorbed' }] }
    ]
  },
  edges: [
    ...path('user', 'ddos'),
    ...fan('ddos', ['workload', 'clean', true], ['absorbed', 'attack'])
  ]
}

const DATA_STREAM = {
  nodes: [
    user('Requests'),
    workload(),
    {
      key: 'stream',
      kind: 'card',
      eyebrow: 'Data Stream',
      title: 'HTTP, firewall and function logs',
      icon: 'ai ai-data-stream',
      status: ok('Near real time'),
      active: true,
      lit: true
    },
    {
      key: 'siem',
      kind: 'item',
      eyebrow: 'SIEM',
      title: 'Splunk, Datadog',
      icon: 'pi pi-chart-bar',
      active: true
    },
    {
      key: 'lake',
      kind: 'item',
      eyebrow: 'Data lake',
      title: 'S3, Kafka, Elasticsearch',
      icon: 'pi pi-database'
    }
  ],
  layout: {
    gap: 'wide',
    row: [
      { node: 'user' },
      { node: 'workload' },
      { node: 'stream' },
      { branches: [{ node: 'siem' }, { node: 'lake' }] }
    ]
  },
  edges: [
    ...path('user', 'workload', 'stream'),
    ...fan('stream', ['siem', 'connector', true], ['lake', 'connector'])
  ]
}

const REAL_TIME_EVENTS = {
  nodes: [
    user('Requests'),
    workload(),
    {
      key: 'events',
      kind: 'card',
      eyebrow: 'Real-Time Events',
      title: 'Every request, queryable',
      icon: 'ai ai-real-time-events',
      status: ok('Seconds'),
      active: true,
      lit: true
    },
    {
      key: 'console',
      kind: 'item',
      eyebrow: 'Console',
      title: 'Filter, inspect, trace',
      icon: 'pi pi-desktop',
      active: true
    },
    {
      key: 'graphql',
      kind: 'item',
      eyebrow: 'GraphQL API',
      title: 'Query from your tools',
      icon: 'ai ai-graphql'
    }
  ],
  layout: {
    gap: 'wide',
    row: [
      { node: 'user' },
      { node: 'workload' },
      { node: 'events' },
      { branches: [{ node: 'console' }, { node: 'graphql' }] }
    ]
  },
  edges: [
    ...path('user', 'workload', 'events'),
    ...fan('events', ['console', 'inspect', true], ['graphql', 'query'])
  ]
}

const REAL_TIME_METRICS = {
  nodes: [
    user('Requests'),
    workload(),
    {
      key: 'metrics',
      kind: 'card',
      eyebrow: 'Real-Time Metrics',
      title: 'Traffic, errors and latency',
      icon: 'ai ai-real-time-metrics',
      status: ok('Live'),
      active: true,
      lit: true
    },
    {
      key: 'dashboards',
      kind: 'item',
      eyebrow: 'Dashboards',
      title: 'Per product, per workload',
      icon: 'pi pi-chart-line',
      active: true
    },
    {
      key: 'graphql',
      kind: 'item',
      eyebrow: 'GraphQL API',
      title: 'Metrics in your tools',
      icon: 'ai ai-graphql'
    }
  ],
  layout: {
    gap: 'wide',
    row: [
      { node: 'user' },
      { node: 'workload' },
      { node: 'metrics' },
      { branches: [{ node: 'dashboards' }, { node: 'graphql' }] }
    ]
  },
  edges: [
    ...path('user', 'workload', 'metrics'),
    ...fan('metrics', ['dashboards', 'watch', true], ['graphql', 'pull'])
  ]
}

export const PRODUCT_ARCHITECTURES = [
  {
    key: 'workloads',
    group: 'build',
    title: 'Workloads',
    summary:
      'Routing sends each request to the nearest data center, where the workload answers it.',
    ariaLabel:
      'A user reaches routing, which sends the request to the shop.example.com workload; a hit is served from cache and a miss goes to the origin',
    spec: WORKLOAD_REQUEST_PATH
  },
  {
    key: 'applications',
    group: 'build',
    title: 'Applications',
    summary:
      'Rules walk every request in order and decide where it goes: cache, a function or the origin.',
    ariaLabel:
      'A user reaches the application; its rules send static assets to cache, /account to the auth-handler function and /api to the origin',
    spec: APPLICATIONS
  },
  {
    key: 'functions',
    group: 'build',
    title: 'Functions',
    summary:
      'A rule runs your code on the routes that need it, with no cold start, before the origin is reached.',
    ariaLabel:
      'A request matches an application rule that runs the auth-handler function; it is answered at the edge or forwarded to the origin API',
    spec: FUNCTIONS
  },
  {
    key: 'application-accelerator',
    group: 'deliver',
    title: 'Application Accelerator',
    summary:
      'Dynamic routes take a tuned path to the origin while static assets never leave the cache.',
    ariaLabel:
      'A user reaches the application; dynamic routes go through Application Accelerator to api.example.com and static assets are served from cache',
    spec: APPLICATION_ACCELERATOR
  },
  {
    key: 'cache',
    group: 'deliver',
    title: 'Cache',
    summary:
      'A hit is answered in the nearest data center; a miss crosses Tiered Cache before the origin.',
    ariaLabel:
      'A user reaches the application, whose cache policy serves a hit from the edge cache; a miss goes to Tiered Cache and then to the origin',
    spec: CACHE
  },
  {
    key: 'image-processor',
    group: 'deliver',
    title: 'Image Processor',
    summary:
      'One source image, every variant derived on demand and cached like any other response.',
    ariaLabel:
      'A browser asks for an image; the application runs Image Processor, which resizes and converts it, caches the variant and reads the source image from the origin once',
    spec: IMAGE_PROCESSOR
  },
  {
    key: 'load-balancer',
    group: 'deliver',
    title: 'Load Balancer',
    summary: 'Traffic is weighted across origins, and an unhealthy one drops out of the pool.',
    ariaLabel:
      'A user reaches the application; Load Balancer sends 60% of traffic to origin-a, 40% to origin-b and nothing to the unhealthy origin-c',
    spec: LOAD_BALANCER
  },
  {
    key: 'edge-dns',
    group: 'deliver',
    title: 'DNS',
    summary: 'An authoritative zone answered from the nearest DNS node, with DNSSEC on.',
    ariaLabel:
      'A resolver asks the shop.example.com zone; the A record points at the workload, the MX record at the mail provider and a TXT record carries domain verification',
    spec: DNS
  },
  {
    key: 'ai-inference',
    group: 'ai',
    title: 'AI Inference',
    summary:
      'A model runs close to the user, with vector search for context and your own LoRA adapter.',
    ariaLabel:
      'An app reaches the application, which runs Mistral 3 Small on AI Inference in under 30 ms, pulling context from vector search on SQL Database and a fine-tuned LoRA adapter',
    spec: AI_INFERENCE
  },
  {
    key: 'ai-gateway',
    group: 'ai',
    title: 'AI Gateway',
    summary:
      'Every model call crosses Firewall and one function that checks the key, routes and logs it.',
    ariaLabel:
      'An AI app calls the gateway; Firewall filters the request, the AI Gateway function checks the key, and the call goes to a model on AI Inference, with third-party providers as the fallback',
    spec: GATEWAY_REQUEST_PATH
  },
  {
    key: 'object-storage',
    group: 'store',
    title: 'Object Storage',
    summary:
      'A bucket is the origin: objects are cached at the edge and uploaded with any S3 client.',
    ariaLabel:
      'A user reaches the application, whose origin is the assets bucket on Object Storage; the object is cached at the edge and uploads come from any S3-compatible client',
    spec: OBJECT_STORAGE
  },
  {
    key: 'sql-database',
    group: 'store',
    title: 'SQL Database',
    summary: 'Reads come from the nearest replica; writes are applied once on the primary.',
    ariaLabel:
      'A request reaches the orders-api function, which queries the replicated orders database; reads hit the nearest replica and writes go to the primary',
    spec: SQL_DATABASE
  },
  {
    key: 'kv-store',
    group: 'store',
    title: 'KV Store',
    summary: 'A key is read from the edge in the same data center and written everywhere.',
    ariaLabel:
      'A request reaches the session-check function, which reads a value from the sessions namespace on KV Store at the edge and replicates writes everywhere',
    spec: KV_STORE
  },
  {
    key: 'web-application-firewall',
    group: 'secure',
    title: 'WAF',
    summary: 'Payloads are scored for injection and scripting attacks, and threats get a 403.',
    ariaLabel:
      'A request crosses Firewall, which runs the WAF; clean traffic goes on to the application and a threat is answered with a 403',
    spec: WAF
  },
  {
    key: 'bot-manager',
    group: 'secure',
    title: 'Bot Management',
    summary:
      'Each request is scored and classified; humans go on, bad bots are denied, dropped or delayed.',
    ariaLabel:
      'A request crosses Firewall, which runs Bot Management; a human is allowed through and a bad bot is denied, dropped or delayed',
    spec: BOT_MANAGEMENT
  },
  {
    key: 'firewall',
    group: 'secure',
    title: 'Firewall',
    summary: 'Network lists, the WAF and rate limits run in order before any application code.',
    ariaLabel:
      'A request reaches Firewall, whose rules apply network lists, the WAF and a rate limit in order before the storefront application runs',
    spec: FIREWALL
  },
  {
    key: 'network-shield',
    group: 'secure',
    title: 'Network Shield',
    summary:
      'Network lists drop listed ASNs, countries and IPs at the border, before the Firewall.',
    ariaLabel:
      'Traffic reaches Network Shield at the border; clean traffic goes on to the Firewall and listed ASNs, countries and IPs are dropped',
    spec: NETWORK_SHIELD
  },
  {
    key: 'ddos-protection',
    group: 'secure',
    title: 'DDoS Protection',
    summary:
      'A flood is absorbed at the edge while legitimate traffic keeps reaching the workload.',
    ariaLabel:
      'Users and attackers reach DDoS Protection; clean traffic is served by the workload and the flood is absorbed at the edge',
    spec: DDOS_PROTECTION
  },
  {
    key: 'data-stream',
    group: 'observe',
    title: 'Data Stream',
    summary: 'Logs from every product leave through a connector to your SIEM or data lake.',
    ariaLabel:
      'Requests reach the workload; Data Stream collects HTTP, firewall and function logs and sends them through connectors to a SIEM or a data lake',
    spec: DATA_STREAM
  },
  {
    key: 'real-time-events',
    group: 'observe',
    title: 'Real-Time Events',
    summary:
      'Every request becomes a queryable event within seconds, in the Console or over GraphQL.',
    ariaLabel:
      'Requests reach the workload; Real-Time Events makes each one queryable in seconds, from the Console or the GraphQL API',
    spec: REAL_TIME_EVENTS
  },
  {
    key: 'real-time-metrics',
    group: 'observe',
    title: 'Real-Time Metrics',
    summary:
      'Traffic, errors and latency on live dashboards, or pulled into your tools over GraphQL.',
    ariaLabel:
      'Requests reach the workload; Real-Time Metrics reports traffic, errors and latency on dashboards and through the GraphQL API',
    spec: REAL_TIME_METRICS
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

export const PLATFORM_ARCHITECTURE_DIAGRAMS = PLATFORM_TABS.map(({ value, architecture }) => {
  const { spec, ariaLabel } = architectureByKey(architecture)
  return { value, spec, ariaLabel }
})

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
