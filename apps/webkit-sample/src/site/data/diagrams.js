import claudeMark from '@aziontech/webkit/assets/claude-symbol-color.svg'
import openaiMark from '@aziontech/webkit/assets/openai-symbol-mono.svg'

import googleMark from '../ui/marks/google-symbol-color.svg'

export const MODEL_ROUTING = {
  nodes: [
    { key: 'app', kind: 'app', title: 'Your AI app' },
    { key: 'paid', kind: 'pill', title: 'Paid user?', active: true },
    {
      key: 'gpt',
      kind: 'card',
      title: 'OpenAI GPT-5.5',
      subtitle: 'openai/gpt-5.5',
      mark: openaiMark,
      active: true
    },
    { key: 'fallback', kind: 'pill', title: 'Fallback', active: true },
    {
      key: 'claude',
      kind: 'card',
      title: 'Claude Opus 4.7',
      subtitle: 'anthropic/claude-opus-4.7',
      logo: claudeMark,
      active: true
    },
    { key: 'rps', kind: 'pill', title: 'RPS > 1.5?' },
    {
      key: 'kimi',
      kind: 'card',
      title: 'Kimi K2.6',
      subtitle: 'moonshotai/kimi-k2.6',
      icon: 'pi pi-moon'
    },
    {
      key: 'gemma',
      kind: 'card',
      title: 'Gemma 4 26B',
      subtitle: 'google/gemma-4-26b-a4b-it',
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
          { gap: 'wide', row: [{ node: 'rps' }, { branches: [{ node: 'kimi' }, { node: 'gemma' }] }] }
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
    { key: 'routing', kind: 'card', title: 'Routing', icon: 'pi pi-directions', active: true },
    { key: 'firewall', kind: 'tile', title: 'Firewall', icon: 'ai ai-edge-firewall' },
    { key: 'applications', kind: 'tile', title: 'Applications', icon: 'ai ai-edge-application' },
    { key: 'cache', kind: 'tile', title: 'Cache', icon: 'ai ai-tiered-cache' },
    {
      key: 'accelerator',
      kind: 'tile',
      title: 'Application Accelerator',
      icon: 'ai ai-app-accelerator'
    },
    { key: 'functions', kind: 'tile', title: 'Functions', icon: 'ai ai-edge-functions' },
    { key: 'image', kind: 'tile', title: 'Image Processor', icon: 'ai ai-image-processor' },
    {
      key: 'delivery',
      kind: 'card',
      title: 'Tiered Cache and Load Balancer',
      icon: 'ai ai-load-balancer',
      active: true
    },
    { key: 'origin', kind: 'card', title: 'Origin', icon: 'pi pi-database', active: true }
  ],
  layout: {
    row: [
      { node: 'user' },
      { node: 'routing' },
      {
        group: 'platform',
        label: 'Azion Platform',
        content: {
          row: [
            {
              group: 'data-center',
              label: 'Data center',
              kind: 'dashed',
              content: {
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
