import type { DiagramSpec } from '../../components/marketing/diagram/types'

const spec: DiagramSpec = {
  ariaLabel:
    'Requests reach the workload; Real-Time Events makes each one queryable in seconds, from the Console or the GraphQL API',
  nodes: [
    {
      key: 'user',
      kind: 'pill',
      title: 'Requests',
      icon: 'pi pi-user',
      active: true
    },
    {
      key: 'workload',
      kind: 'card',
      eyebrow: 'Workload',
      title: 'shop.example.com',
      icon: 'ai ai-workloads',
      active: true
    },
    {
      key: 'events',
      kind: 'card',
      eyebrow: 'Real-Time Events',
      title: 'Every request, queryable',
      icon: 'ai ai-real-time-events',
      status: {
        label: 'Seconds',
        severity: 'success'
      },
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
      {
        node: 'user'
      },
      {
        node: 'workload'
      },
      {
        node: 'events'
      },
      {
        branches: [
          {
            node: 'console'
          },
          {
            node: 'graphql'
          }
        ]
      }
    ]
  },
  edges: [
    {
      from: 'user',
      to: 'workload',
      active: true
    },
    {
      from: 'workload',
      to: 'events',
      active: true
    },
    {
      from: 'events',
      to: 'console',
      label: 'inspect',
      active: true
    },
    {
      from: 'events',
      to: 'graphql',
      label: 'query'
    }
  ]
}

export default spec
