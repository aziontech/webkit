import type { DiagramSpec } from '../../components/marketing/diagram/types'

const spec: DiagramSpec = {
  ariaLabel:
    'A user reaches the application; Load Balancer sends 60% of traffic to origin-a, 40% to origin-b and nothing to the unhealthy origin-c',
  nodes: [
    {
      key: 'user',
      type: 'pill',
      title: 'User',
      icon: 'az az-user',
      active: true
    },
    {
      key: 'application',
      type: 'card',
      eyebrow: 'Application',
      title: 'Rule: balance the origin pool',
      icon: 'az az-rules-engine',
      active: true
    },
    {
      key: 'balancer',
      type: 'card',
      eyebrow: 'Load Balancer',
      title: 'Weighted, with health checks',
      icon: 'az az-load-balancer',
      status: {
        label: '3 origins',
        severity: 'success'
      },
      active: true,
      lit: true
    },
    {
      key: 'east',
      type: 'item',
      eyebrow: 'Origin',
      title: 'origin-a · us-east',
      icon: 'az az-server',
      active: true
    },
    {
      key: 'west',
      type: 'item',
      eyebrow: 'Origin',
      title: 'origin-b · eu-west',
      icon: 'az az-server'
    },
    {
      key: 'south',
      type: 'item',
      eyebrow: 'Origin',
      title: 'origin-c · sa-east',
      icon: 'az az-server',
      status: {
        label: 'Unhealthy',
        severity: 'warning'
      }
    }
  ],
  layout: {
    gap: 'wide',
    row: [
      {
        node: 'user'
      },
      {
        node: 'application'
      },
      {
        node: 'balancer'
      },
      {
        branches: [
          {
            node: 'east'
          },
          {
            node: 'west'
          },
          {
            node: 'south'
          }
        ]
      }
    ]
  },
  edges: [
    {
      from: 'user',
      to: 'application',
      active: true
    },
    {
      from: 'application',
      to: 'balancer',
      active: true
    },
    {
      from: 'balancer',
      to: 'east',
      label: '60%',
      active: true
    },
    {
      from: 'balancer',
      to: 'west',
      label: '40%'
    },
    {
      from: 'balancer',
      to: 'south',
      label: 'out'
    }
  ]
}

export default spec
