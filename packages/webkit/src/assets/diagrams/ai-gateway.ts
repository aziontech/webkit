import type { DiagramSpec } from '../../components/marketing/diagram/types'

const spec: DiagramSpec = {
  ariaLabel:
    'An AI app calls the gateway; Firewall filters the request, the AI Gateway function checks the key, and the call goes to a model on AI Inference, with third-party providers as the fallback',
  nodes: [
    {
      key: 'app',
      type: 'app',
      title: 'App'
    },
    {
      key: 'firewall',
      type: 'card',
      eyebrow: 'Firewall',
      title: 'WAF, rate limits, DDoS',
      icon: 'az az-firewall',
      active: true
    },
    {
      key: 'gateway',
      type: 'card',
      eyebrow: 'Functions',
      title: 'AI Gateway',
      icon: 'az az-functions',
      status: {
        label: 'Key valid',
        severity: 'success'
      },
      active: true,
      lit: true
    },
    {
      key: 'inference',
      type: 'item',
      eyebrow: 'AI Inference',
      title: 'Models on Azion',
      icon: 'az az-ai-inference',
      active: true
    },
    {
      key: 'providers',
      type: 'item',
      eyebrow: 'Connectors',
      title: 'Third-party providers',
      icon: 'az az-connectors'
    }
  ],
  layout: {
    gap: 'wide',
    row: [
      {
        node: 'app'
      },
      {
        node: 'firewall'
      },
      {
        node: 'gateway'
      },
      {
        branches: [
          {
            node: 'inference'
          },
          {
            node: 'providers'
          }
        ]
      }
    ]
  },
  edges: [
    {
      from: 'app',
      to: 'firewall',
      active: true
    },
    {
      from: 'firewall',
      to: 'gateway',
      active: true
    },
    {
      from: 'gateway',
      to: 'inference',
      label: 'primary',
      active: true
    },
    {
      from: 'gateway',
      to: 'providers',
      label: 'fallback'
    }
  ]
}

export default spec
