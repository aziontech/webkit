import type { DiagramSpec } from '../../components/marketing/diagram/types'

const spec: DiagramSpec = {
  ariaLabel:
    'A request reaches the orders-api function, which queries the replicated orders database; reads hit the nearest replica and writes go to the primary',
  nodes: [
    {
      key: 'user',
      type: 'pill',
      title: 'Request',
      icon: 'az az-user',
      active: true
    },
    {
      key: 'function',
      type: 'card',
      eyebrow: 'Functions',
      title: 'orders-api',
      icon: 'az az-functions',
      active: true
    },
    {
      key: 'sql',
      type: 'card',
      eyebrow: 'SQL Database',
      title: 'orders, replicated',
      icon: 'az az-sql-database',
      status: {
        label: 'SQLite dialect',
        severity: 'success'
      },
      active: true,
      lit: true
    },
    {
      key: 'replica',
      type: 'item',
      eyebrow: 'Read replica',
      title: 'Nearest data center',
      icon: 'az az-edge-nodes',
      active: true
    },
    {
      key: 'primary',
      type: 'item',
      eyebrow: 'Primary',
      title: 'Writes applied once',
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
        node: 'function'
      },
      {
        node: 'sql'
      },
      {
        branches: [
          {
            node: 'replica'
          },
          {
            node: 'primary'
          }
        ]
      }
    ]
  },
  edges: [
    {
      from: 'user',
      to: 'function',
      active: true
    },
    {
      from: 'function',
      to: 'sql',
      active: true
    },
    {
      from: 'sql',
      to: 'replica',
      label: 'reads',
      active: true
    },
    {
      from: 'sql',
      to: 'primary',
      label: 'writes'
    }
  ]
}

export default spec
