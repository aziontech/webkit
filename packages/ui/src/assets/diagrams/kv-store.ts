import type { DiagramSpec } from '../../components/marketing/diagram/types'

const spec: DiagramSpec = {
  ariaLabel:
    'A request reaches the session-check function, which reads a value from the sessions namespace on KV Store at the edge and replicates writes everywhere',
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
      title: 'session-check',
      icon: 'az az-functions',
      active: true
    },
    {
      key: 'kv',
      type: 'card',
      eyebrow: 'KV Store',
      title: 'sessions namespace',
      icon: 'az az-kv-store',
      status: {
        label: 'Low latency',
        severity: 'success'
      },
      active: true,
      lit: true
    },
    {
      key: 'get',
      type: 'item',
      eyebrow: 'get',
      title: 'Value from the edge',
      icon: 'az az-bolt',
      active: true
    },
    {
      key: 'put',
      type: 'item',
      eyebrow: 'put',
      title: 'Replicated everywhere',
      icon: 'az az-globe'
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
        node: 'kv'
      },
      {
        branches: [
          {
            node: 'get'
          },
          {
            node: 'put'
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
      to: 'kv',
      active: true
    },
    {
      from: 'kv',
      to: 'get',
      label: 'read',
      active: true
    },
    {
      from: 'kv',
      to: 'put',
      label: 'write'
    }
  ]
}

export default spec
