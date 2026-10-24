import type { DiagramSpec } from '../../components/marketing/diagram/types'

const spec: DiagramSpec = {
  ariaLabel:
    'A user reaches the application, whose cache policy serves a hit from the edge cache; a miss goes to Tiered Cache and then to the origin',
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
      title: 'Cache policy: hold for 60 s',
      icon: 'ai ai-rules-engine',
      active: true
    },
    {
      key: 'cache',
      kind: 'card',
      eyebrow: 'Cache',
      title: 'Edge cache in the nearest data center',
      icon: 'ai ai-tiered-cache',
      status: {
        label: 'Hit',
        severity: 'success'
      },
      active: true,
      lit: true
    },
    {
      key: 'tiered',
      kind: 'item',
      eyebrow: 'Tiered Cache',
      title: 'Second layer before the origin',
      icon: 'ai ai-origin-shield'
    },
    {
      key: 'origin',
      kind: 'item',
      eyebrow: 'Origin',
      title: 'origin.example.com',
      icon: 'pi pi-database'
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
        node: 'cache'
      },
      {
        branches: [
          {
            node: 'tiered'
          },
          {
            node: 'origin'
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
      to: 'cache',
      active: true
    },
    {
      from: 'cache',
      to: 'tiered',
      label: 'miss'
    },
    {
      from: 'tiered',
      to: 'origin',
      label: 'miss'
    }
  ]
}

export default spec
