import type { DiagramSpec } from '../../components/marketing/diagram/types'

const spec: DiagramSpec = {
  ariaLabel:
    'Requests reach the workload; Real-Time Metrics reports traffic, errors and latency on dashboards and through the GraphQL API',
  nodes: [
    {
      key: 'user',
      type: 'pill',
      title: 'Requests',
      icon: 'ai ai-user',
      active: true
    },
    {
      key: 'workload',
      type: 'card',
      eyebrow: 'Workload',
      title: 'shop.example.com',
      icon: 'ai ai-workloads',
      active: true
    },
    {
      key: 'metrics',
      type: 'card',
      eyebrow: 'Real-Time Metrics',
      title: 'Traffic, errors and latency',
      icon: 'ai ai-real-time-metrics',
      status: {
        label: 'Live',
        severity: 'success'
      },
      active: true,
      lit: true
    },
    {
      key: 'dashboards',
      type: 'item',
      eyebrow: 'Dashboards',
      title: 'Per product, per workload',
      icon: 'ai ai-chart-line',
      active: true
    },
    {
      key: 'graphql',
      type: 'item',
      eyebrow: 'GraphQL API',
      title: 'Metrics in your tools',
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
        node: 'metrics'
      },
      {
        branches: [
          {
            node: 'dashboards'
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
      to: 'metrics',
      active: true
    },
    {
      from: 'metrics',
      to: 'dashboards',
      label: 'watch',
      active: true
    },
    {
      from: 'metrics',
      to: 'graphql',
      label: 'pull'
    }
  ]
}

export default spec
