import type { DiagramSpec } from '../../components/marketing/diagram/types'

const spec: DiagramSpec = {
  ariaLabel:
    'A user reaches the application; Load Balancer sends 60% of traffic to origin-a, 40% to origin-b and nothing to the unhealthy origin-c',
  nodes: [
    {
      key: 'user',
      kind: 'pill',
      title: 'User',
      icon: 'pi pi-user',
      active: true
    },
    {
      key: 'application',
      kind: 'card',
      eyebrow: 'Application',
      title: 'Rule: balance the origin pool',
      icon: 'ai ai-rules-engine',
      active: true
    },
    {
      key: 'balancer',
      kind: 'card',
      eyebrow: 'Load Balancer',
      title: 'Weighted, with health checks',
      icon: 'ai ai-load-balancer',
      status: {
        label: '3 origins',
        severity: 'success'
      },
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
