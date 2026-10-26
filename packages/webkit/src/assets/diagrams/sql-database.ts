import type { DiagramSpec } from '../../components/marketing/diagram/types'

const spec: DiagramSpec = {
  ariaLabel:
    'A request reaches the orders-api function, which queries the replicated orders database; reads hit the nearest replica and writes go to the primary',
  nodes: [
    {
      key: 'user',
      kind: 'pill',
      title: 'Request',
      icon: 'pi pi-user',
      active: true
    },
    {
      key: 'function',
      kind: 'card',
      eyebrow: 'Functions',
      title: 'orders-api',
      icon: 'ai ai-edge-functions',
      active: true
    },
    {
      key: 'sql',
      kind: 'card',
      eyebrow: 'SQL Database',
      title: 'orders, replicated',
      icon: 'ai ai-edge-sql',
      status: {
        label: 'SQLite dialect',
        severity: 'success'
      },
      active: true,
      lit: true
    },
    {
      key: 'replica',
      kind: 'item',
      eyebrow: 'Read replica',
      title: 'Nearest data center',
      icon: 'ai ai-edge-nodes',
      active: true
    },
    {
      key: 'primary',
      kind: 'item',
      eyebrow: 'Primary',
      title: 'Writes applied once',
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
