import type { DiagramSpec } from '../../components/marketing/diagram/types'

const spec: DiagramSpec = {
  ariaLabel:
    'A user reaches the application, whose cache policy serves a hit from the edge cache; a miss goes to Tiered Cache and then to the origin',
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
      title: 'Cache policy: hold for 60 s',
      icon: 'az az-rules-engine',
      active: true
    },
    {
      key: 'cache',
      type: 'card',
      eyebrow: 'Cache',
      title: 'Edge cache in the nearest data center',
      icon: 'az az-tiered-cache',
      status: {
        label: 'Hit',
        severity: 'success'
      },
      active: true,
      lit: true
    },
    {
      key: 'tiered',
      type: 'item',
      eyebrow: 'Tiered Cache',
      title: 'Second layer before the origin',
      icon: 'az az-origin-shield'
    },
    {
      key: 'origin',
      type: 'item',
      eyebrow: 'Origin',
      title: 'origin.example.com',
      icon: 'az az-database'
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
