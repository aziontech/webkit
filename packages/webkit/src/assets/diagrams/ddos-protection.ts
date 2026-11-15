import type { DiagramSpec } from '../../components/marketing/diagram/types'

const spec: DiagramSpec = {
  ariaLabel:
    'Users and attackers reach DDoS Protection; clean traffic is served by the workload and the flood is absorbed at the edge',
  nodes: [
    {
      key: 'user',
      type: 'pill',
      title: 'Users and attackers',
      icon: 'ai ai-triangle-alert',
      active: true
    },
    {
      key: 'ddos',
      type: 'card',
      eyebrow: 'DDoS Protection',
      title: 'Always-on mitigation',
      icon: 'ai ai-shield',
      status: {
        label: 'Mitigated',
        severity: 'success'
      },
      active: true,
      lit: true
    },
    {
      key: 'workload',
      type: 'item',
      eyebrow: 'Workload',
      title: 'shop.example.com',
      icon: 'ai ai-workloads',
      active: true
    },
    {
      key: 'absorbed',
      type: 'item',
      eyebrow: 'Flood',
      title: 'Absorbed at the edge',
      icon: 'ai ai-ban'
    }
  ],
  layout: {
    gap: 'wide',
    row: [
      {
        node: 'user'
      },
      {
        node: 'ddos'
      },
      {
        branches: [
          {
            node: 'workload'
          },
          {
            node: 'absorbed'
          }
        ]
      }
    ]
  },
  edges: [
    {
      from: 'user',
      to: 'ddos',
      active: true
    },
    {
      from: 'ddos',
      to: 'workload',
      label: 'clean',
      active: true
    },
    {
      from: 'ddos',
      to: 'absorbed',
      label: 'attack'
    }
  ]
}

export default spec
