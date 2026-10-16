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

export const PLATFORM_REQUEST_PATH = {
  nodes: [
    { key: 'user', kind: 'pill', title: 'User', icon: 'pi pi-user', active: true },
    {
      key: 'routing',
      kind: 'card',
      eyebrow: 'Routing',
      title: 'Nearest location',
      icon: 'pi pi-directions',
      active: true
    },
    { key: 'firewall', kind: 'tile', title: 'Firewall', icon: 'ai ai-edge-firewall' },
    { key: 'applications', kind: 'tile', title: 'Applications', icon: 'ai ai-edge-application' },
    { key: 'cache', kind: 'tile', title: 'Cache', icon: 'ai ai-tiered-cache' },
    {
      key: 'accelerator',
      kind: 'tile',
      title: 'Application Accelerator',
      icon: 'ai ai-app-accelerator'
    },
    { key: 'functions', kind: 'tile', title: 'Functions', icon: 'ai ai-edge-functions', lit: true },
    { key: 'image', kind: 'tile', title: 'Image Processor', icon: 'ai ai-image-processor' },
    {
      key: 'delivery',
      kind: 'card',
      eyebrow: 'Delivery',
      title: 'Tiered Cache and Load Balancer',
      icon: 'ai ai-load-balancer',
      active: true
    },
    {
      key: 'origin',
      kind: 'card',
      eyebrow: 'Origin',
      title: 'origin.example.com',
      icon: 'pi pi-database',
      status: { label: 'Healthy', severity: 'success' },
      active: true
    }
  ],
  layout: {
    row: [
      { node: 'user' },
      { node: 'routing' },
      {
        group: 'platform',
        label: 'Azion Platform',
        kind: 'dashed',
        fill: 'primary',
        content: {
          row: [
            {
              group: 'data-center',
              label: 'Data center',
              kind: 'dashed',
              fill: 'primary',
              content: {
                columns: 3,
                grid: [
                  { node: 'firewall' },
                  { node: 'applications' },
                  { node: 'cache' },
                  { node: 'accelerator' },
                  { node: 'functions' },
                  { node: 'image' }
                ]
              }
            },
            { node: 'delivery' }
          ]
        }
      },
      { node: 'origin' }
    ]
  },
  edges: [
    { from: 'user', to: 'routing', active: true },
    { from: 'routing', to: 'data-center', active: true },
    { from: 'data-center', to: 'delivery', active: true },
    { from: 'delivery', to: 'origin', active: true }
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
