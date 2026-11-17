import type { DiagramSpec } from '../../components/marketing/diagram/types'

const spec: DiagramSpec = {
  ariaLabel:
    'A user reaches the application; dynamic routes go through Application Accelerator to api.example.com and static assets are served from cache',
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
      title: 'Rule: dynamic routes',
      icon: 'az az-rules-engine',
      active: true
    },
    {
      key: 'accelerator',
      type: 'card',
      eyebrow: 'Application Accelerator',
      title: 'Tuned route, fewer round trips',
      icon: 'az az-application-accelerator',
      active: true,
      lit: true
    },
    {
      key: 'origin',
      type: 'item',
      eyebrow: 'Origin',
      title: 'api.example.com',
      icon: 'az az-database',
      active: true
    },
    {
      key: 'cache',
      type: 'item',
      eyebrow: 'Cache',
      title: 'Static assets, no origin call',
      icon: 'az az-tiered-cache'
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
        branches: [
          {
            row: [
              {
                node: 'accelerator'
              },
              {
                node: 'origin'
              }
            ]
          },
          {
            node: 'cache'
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
      to: 'accelerator',
      label: 'dynamic',
      active: true
    },
    {
      from: 'application',
      to: 'cache',
      label: 'static'
    },
    {
      from: 'accelerator',
      to: 'origin',
      active: true
    }
  ]
}

export default spec
