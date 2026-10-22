import claudeMark from '@aziontech/webkit/assets/claude-symbol-color.svg'
import openaiMark from '@aziontech/webkit/assets/openai-symbol-mono.svg'

import googleMark from './marks/google-symbol-color.svg'

export const MODEL_ROUTING = {
  nodes: [
    { key: 'app', kind: 'app', title: 'App' },
    { key: 'paid', kind: 'pill', title: 'Paid user?', active: true },
    {
      key: 'gpt',
      kind: 'item',
      eyebrow: 'OpenAI',
      title: 'GPT-5.5',
      mark: openaiMark,
      status: { label: 'Primary', severity: 'success' },
      active: true,
      lit: true
    },
    { key: 'fallback', kind: 'pill', title: 'Fallback', active: true },
    {
      key: 'claude',
      kind: 'item',
      eyebrow: 'Anthropic',
      title: 'Claude Opus 4.7',
      logo: claudeMark,
      active: true
    },
    { key: 'rps', kind: 'pill', title: 'RPS > 1.5?' },
    {
      key: 'kimi',
      kind: 'item',
      eyebrow: 'Moonshot AI',
      title: 'Kimi K2.6',
      icon: 'pi pi-moon'
    },
    {
      key: 'gemma',
      kind: 'item',
      eyebrow: 'Google',
      title: 'Gemma 4 26B',
      logo: googleMark
    }
  ],
  layout: {
    align: 'start',
    gap: 'wide',
    row: [
      { node: 'app' },
      { node: 'paid' },
      {
        branches: [
          { row: [{ node: 'gpt' }, { node: 'fallback' }, { node: 'claude' }] },
          {
            gap: 'wide',
            row: [{ node: 'rps' }, { branches: [{ node: 'kimi' }, { node: 'gemma' }] }]
          }
        ]
      }
    ]
  },
  edges: [
    { from: 'app', to: 'paid', active: true },
    { from: 'paid', to: 'gpt', label: 'true', active: true },
    { from: 'gpt', to: 'fallback', active: true },
    { from: 'fallback', to: 'claude', active: true },
    { from: 'paid', to: 'rps', label: 'false' },
    { from: 'rps', to: 'kimi', label: 'true' },
    { from: 'rps', to: 'gemma', label: 'false' }
  ]
}
export const WORKLOAD_REQUEST_PATH = {
  nodes: [
    { key: 'user', kind: 'pill', title: 'User', icon: 'pi pi-user', active: true },
    {
      key: 'routing',
      kind: 'card',
      eyebrow: 'Routing',
      title: 'Nearest data center',
      icon: 'pi pi-directions',
      active: true
    },
    {
      key: 'workload',
      kind: 'card',
      eyebrow: 'Workload',
      title: 'shop.example.com',
      icon: 'ai ai-workloads',
      status: { label: 'Live', severity: 'success' },
      active: true,
      lit: true
    },
    {
      key: 'cache',
      kind: 'item',
      eyebrow: 'Cache',
      title: 'Served from cache',
      icon: 'ai ai-tiered-cache',
      active: true
    },
    {
      key: 'origin',
      kind: 'item',
      eyebrow: 'Origin',
      title: 'origin.example.com',
      icon: 'pi pi-database'
    }
  ],
  layout: {
    gap: 'wide',
    row: [
      { node: 'user' },
      { node: 'routing' },
      { node: 'workload' },
      { branches: [{ node: 'cache' }, { node: 'origin' }] }
    ]
  },
  edges: [
    { from: 'user', to: 'routing', active: true },
    { from: 'routing', to: 'workload', active: true },
    { from: 'workload', to: 'cache', label: 'hit', active: true },
    { from: 'workload', to: 'origin', label: 'miss' }
  ]
}
export const PROVIDER_FAILOVER = {
  nodes: [
    { key: 'app', kind: 'app', title: 'App' },
    { key: 'degraded', kind: 'pill', title: 'Provider degraded?', active: true },
    {
      key: 'anthropic',
      kind: 'item',
      eyebrow: 'Anthropic',
      title: 'Claude Haiku 5.5',
      logo: claudeMark,
      status: { label: 'Degraded', severity: 'warning' }
    },
    {
      key: 'bedrock',
      kind: 'item',
      eyebrow: 'Amazon Bedrock',
      title: 'Claude Haiku 5.5',
      icon: 'pi pi-amazon',
      active: true,
      lit: true
    }
  ],
  layout: {
    gap: 'wide',
    row: [
      { node: 'app' },
      { node: 'degraded' },
      { branches: [{ node: 'anthropic' }, { node: 'bedrock' }] }
    ]
  },
  edges: [
    { from: 'app', to: 'degraded', active: true },
    { from: 'degraded', to: 'anthropic', label: 'primary' },
    { from: 'degraded', to: 'bedrock', label: 'fallback', active: true }
  ]
}
export const LATENCY_ROUTING = {
  nodes: [
    { key: 'app', kind: 'app', title: 'App' },
    { key: 'realtime', kind: 'pill', title: 'Real-time task?', active: true },
    {
      key: 'inference',
      kind: 'item',
      eyebrow: 'AI Inference',
      title: 'Mistral 3 Small',
      icon: 'ai ai-edge-ai',
      status: { label: 'Under 30 ms', severity: 'success' },
      active: true,
      lit: true
    },
    {
      key: 'gpt',
      kind: 'item',
      eyebrow: 'OpenAI',
      title: 'GPT-5.5',
      mark: openaiMark
    }
  ],
  layout: {
    gap: 'wide',
    row: [
      { node: 'app' },
      { node: 'realtime' },
      { branches: [{ node: 'inference' }, { node: 'gpt' }] }
    ]
  },
  edges: [
    { from: 'app', to: 'realtime', active: true },
    { from: 'realtime', to: 'inference', label: 'true', active: true },
    { from: 'realtime', to: 'gpt', label: 'false' }
  ]
}
export const GATEWAY_REQUEST_PATH = {
  nodes: [
    { key: 'app', kind: 'app', title: 'App' },
    {
      key: 'firewall',
      kind: 'card',
      eyebrow: 'Firewall',
      title: 'WAF, rate limits, DDoS',
      icon: 'ai ai-edge-firewall',
      active: true
    },
    {
      key: 'gateway',
      kind: 'card',
      eyebrow: 'Functions',
      title: 'AI Gateway',
      icon: 'ai ai-edge-functions',
      status: { label: 'Key valid', severity: 'success' },
      active: true,
      lit: true
    },
    {
      key: 'inference',
      kind: 'item',
      eyebrow: 'AI Inference',
      title: 'Models on Azion',
      icon: 'ai ai-edge-ai',
      active: true
    },
    {
      key: 'providers',
      kind: 'item',
      eyebrow: 'Connectors',
      title: 'Third-party providers',
      icon: 'ai ai-edge-connectors'
    }
  ],
  layout: {
    gap: 'wide',
    row: [
      { node: 'app' },
      { node: 'firewall' },
      { node: 'gateway' },
      { branches: [{ node: 'inference' }, { node: 'providers' }] }
    ]
  },
  edges: [
    { from: 'app', to: 'firewall', active: true },
    { from: 'firewall', to: 'gateway', active: true },
    { from: 'gateway', to: 'inference', label: 'primary', active: true },
    { from: 'gateway', to: 'providers', label: 'fallback' }
  ]
}
export const RESPONSE_CACHE = {
  nodes: [
    { key: 'app', kind: 'app', title: 'App' },
    { key: 'hit', kind: 'pill', title: 'Cached response?', active: true },
    {
      key: 'cache',
      kind: 'item',
      eyebrow: 'Cache API',
      title: 'Stored response',
      icon: 'ai ai-tiered-cache',
      status: { label: 'No tokens spent', severity: 'success' },
      active: true,
      lit: true
    },
    {
      key: 'model',
      kind: 'item',
      eyebrow: 'AI Inference',
      title: 'Model call',
      icon: 'ai ai-edge-ai'
    }
  ],
  layout: {
    gap: 'wide',
    row: [{ node: 'app' }, { node: 'hit' }, { branches: [{ node: 'cache' }, { node: 'model' }] }]
  },
  edges: [
    { from: 'app', to: 'hit', active: true },
    { from: 'hit', to: 'cache', label: 'true', active: true },
    { from: 'hit', to: 'model', label: 'false' }
  ]
}
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

const firewall = (title = 'Rules in order') => ({
  key: 'firewall',
  kind: 'card',
  eyebrow: 'Firewall',
  title,
  icon: 'ai ai-edge-firewall',
  active: true
})

const path = (...keys) =>
  keys.slice(1).map((key, index) => ({ from: keys[index], to: key, active: true }))

const fan = (from, ...targets) =>
  targets.map(([to, label, active]) => ({ from, to, label, ...(active ? { active: true } : {}) }))

const ok = (label) => ({ label, severity: 'success' })

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
export const PLATFORM_ARCHITECTURE_TABS = [
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

export const PLATFORM_ARCHITECTURE_DIAGRAMS = [
  {
    value: 'request-path',
    spec: WORKLOAD_REQUEST_PATH,
    ariaLabel:
      'A user reaches routing, which sends the request to the shop.example.com workload; a hit is served from cache and a miss goes to the origin'
  },
  {
    value: 'security',
    spec: FIREWALL,
    ariaLabel:
      'A request reaches Firewall, whose rules apply network lists, the WAF and a rate limit in order before the storefront application runs'
  },
  {
    value: 'compute',
    spec: FUNCTIONS,
    ariaLabel:
      'A request matches an application rule that runs the auth-handler function; it is answered at the edge or forwarded to the origin API'
  },
  {
    value: 'data',
    spec: SQL_DATABASE,
    ariaLabel:
      'A request reaches the orders-api function, which queries the replicated orders database; reads hit the nearest replica and writes go to the primary'
  },
  {
    value: 'observe',
    spec: REAL_TIME_EVENTS,
    ariaLabel:
      'Requests reach the workload; Real-Time Events makes each one queryable in seconds, from the Console or the GraphQL API'
  }
]
