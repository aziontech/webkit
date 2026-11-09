import type { DiagramSpec } from '../../components/marketing/diagram/types'

const spec: DiagramSpec = {
  ariaLabel:
    'An AI app checks for a cached response; a match is served from the Cache API with no tokens spent, and anything else goes to a model call',
  nodes: [
    {
      key: 'app',
      kind: 'app',
      title: 'App'
    },
    {
      key: 'hit',
      kind: 'pill',
      title: 'Cached response?',
      active: true
    },
    {
      key: 'cache',
      kind: 'item',
      eyebrow: 'Cache API',
      title: 'Stored response',
      icon: 'ai ai-tiered-cache',
      status: {
        label: 'No tokens spent',
        severity: 'success'
      },
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
    row: [
      {
        node: 'app'
      },
      {
        node: 'hit'
      },
      {
        branches: [
          {
            node: 'cache'
          },
          {
            node: 'model'
          }
        ]
      }
    ]
  },
  edges: [
    {
      from: 'app',
      to: 'hit',
      active: true
    },
    {
      from: 'hit',
      to: 'cache',
      label: 'true',
      active: true
    },
    {
      from: 'hit',
      to: 'model',
      label: 'false'
    }
  ]
}

export default spec
