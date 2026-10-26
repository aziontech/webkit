import type { DiagramSpec } from '../../components/marketing/diagram/types'

const spec: DiagramSpec = {
  ariaLabel:
    'A user reaches the application; dynamic routes go through Application Accelerator to api.example.com and static assets are served from cache',
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
      title: 'Rule: dynamic routes',
      icon: 'ai ai-rules-engine',
      active: true
    },
    {
      key: 'accelerator',
      kind: 'card',
      eyebrow: 'Application Accelerator',
      title: 'Tuned route, fewer round trips',
      icon: 'ai ai-app-accelerator',
      active: true,
      lit: true
    },
    {
      key: 'origin',
      kind: 'item',
      eyebrow: 'Origin',
      title: 'api.example.com',
      icon: 'pi pi-database',
      active: true
    },
    {
      key: 'cache',
      kind: 'item',
      eyebrow: 'Cache',
      title: 'Static assets, no origin call',
      icon: 'ai ai-tiered-cache'
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
