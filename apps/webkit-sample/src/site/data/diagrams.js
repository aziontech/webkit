import claudeMark from '@aziontech/webkit/assets/claude-symbol-color.svg'
import openaiMark from '@aziontech/webkit/assets/openai-symbol-mono.svg'

import googleMark from '../ui/marks/google-symbol-color.svg'

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

export const ISOLATE_PER_REQUEST = {
  nodes: [
    { key: 'requests', kind: 'pill', title: 'Requests', icon: 'pi pi-user', active: true },
    {
      key: 'runtime',
      kind: 'card',
      eyebrow: 'Azion Runtime',
      title: 'Isolate per request',
      icon: 'ai ai-edge-functions',
      status: { label: 'No cold start', severity: 'success' },
      active: true,
      lit: true
    },
    { key: 'first', kind: 'item', eyebrow: 'Isolate', title: 'Request 1', active: true },
    { key: 'second', kind: 'item', eyebrow: 'Isolate', title: 'Request 2', active: true },
    { key: 'third', kind: 'item', eyebrow: 'Isolate', title: 'Request 3', active: true }
  ],
  layout: {
    gap: 'wide',
    row: [
      { node: 'requests' },
      { node: 'runtime' },
      { branches: [{ node: 'first' }, { node: 'second' }, { node: 'third' }] }
    ]
  },
  edges: [
    { from: 'requests', to: 'runtime', active: true },
    { from: 'runtime', to: 'first', active: true },
    { from: 'runtime', to: 'second', active: true },
    { from: 'runtime', to: 'third', active: true }
  ]
}

export const GRADUAL_ROLLOUT = {
  nodes: [
    {
      key: 'workload',
      kind: 'card',
      eyebrow: 'Workload',
      title: 'shop-prod',
      icon: 'ai ai-workloads',
      status: { label: 'Live', severity: 'success' },
      active: true
    },
    { key: 'split', kind: 'pill', title: 'Traffic split', active: true },
    {
      key: 'next',
      kind: 'item',
      eyebrow: 'New deployment',
      title: 'storefront v2',
      icon: 'ai ai-edge-application',
      status: { label: 'Watching', severity: 'info' },
      active: true,
      lit: true
    },
    {
      key: 'current',
      kind: 'item',
      eyebrow: 'Serving deployment',
      title: 'storefront v1',
      icon: 'ai ai-edge-application'
    }
  ],
  layout: {
    gap: 'wide',
    row: [
      { node: 'workload' },
      { node: 'split' },
      { branches: [{ node: 'next' }, { node: 'current' }] }
    ]
  },
  edges: [
    { from: 'workload', to: 'split', active: true },
    { from: 'split', to: 'next', label: '10%', active: true },
    { from: 'split', to: 'current', label: '90%' }
  ]
}

export const WORKLOAD_SECURITY = {
  nodes: [
    { key: 'user', kind: 'pill', title: 'User', icon: 'pi pi-user', active: true },
    {
      key: 'workload',
      kind: 'card',
      eyebrow: 'Workload',
      title: 'shop.example.com',
      icon: 'ai ai-domains',
      status: { label: 'TLS on', severity: 'success' },
      active: true,
      lit: true
    },
    {
      key: 'firewall',
      kind: 'item',
      eyebrow: 'Firewall',
      title: 'WAF, rate limits, network lists',
      icon: 'ai ai-edge-firewall',
      active: true
    },
    {
      key: 'application',
      kind: 'item',
      eyebrow: 'Application',
      title: 'storefront',
      icon: 'ai ai-edge-application',
      active: true
    }
  ],
  layout: {
    gap: 'wide',
    row: [{ node: 'user' }, { node: 'workload' }, { node: 'firewall' }, { node: 'application' }]
  },
  edges: [
    { from: 'user', to: 'workload', active: true },
    { from: 'workload', to: 'firewall', active: true },
    { from: 'firewall', to: 'application', label: 'allowed', active: true }
  ]
}
