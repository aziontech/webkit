import type { DiagramSpec } from '../../components/marketing/diagram/types'

const spec: DiagramSpec = {
  ariaLabel:
    'A workload splits traffic between two deployments: 10% to the new one, which is being watched, and 90% to the one that was serving',
  nodes: [
    {
      key: 'workload',
      kind: 'card',
      eyebrow: 'Workload',
      title: 'shop-prod',
      icon: 'ai ai-workloads',
      status: {
        label: 'Live',
        severity: 'success'
      },
      active: true
    },
    {
      key: 'split',
      kind: 'pill',
      title: 'Traffic split',
      active: true
    },
    {
      key: 'next',
      kind: 'item',
      eyebrow: 'New deployment',
      title: 'storefront v2',
      icon: 'ai ai-edge-application',
      status: {
        label: 'Watching',
        severity: 'info'
      },
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
      {
        node: 'workload'
      },
      {
        node: 'split'
      },
      {
        branches: [
          {
            node: 'next'
          },
          {
            node: 'current'
          }
        ]
      }
    ]
  },
  edges: [
    {
      from: 'workload',
      to: 'split',
      active: true
    },
    {
      from: 'split',
      to: 'next',
      label: '10%',
      active: true
    },
    {
      from: 'split',
      to: 'current',
      label: '90%'
    }
  ]
}

export default spec
