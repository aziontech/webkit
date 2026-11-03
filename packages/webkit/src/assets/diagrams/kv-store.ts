import type { DiagramSpec } from '../../components/marketing/diagram/types'

const spec: DiagramSpec = {
  ariaLabel:
    'A request reaches the session-check function, which reads a value from the sessions namespace on KV Store at the edge and replicates writes everywhere',
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
      title: 'session-check',
      icon: 'ai ai-edge-functions',
      active: true
    },
    {
      key: 'kv',
      kind: 'card',
      eyebrow: 'KV Store',
      title: 'sessions namespace',
      icon: 'ai ai-edge-kv',
      status: {
        label: 'Low latency',
        severity: 'success'
      },
      active: true,
      lit: true
    },
    {
      key: 'get',
      kind: 'item',
      eyebrow: 'get',
      title: 'Value from the edge',
      icon: 'pi pi-bolt',
      active: true
    },
    {
      key: 'put',
      kind: 'item',
      eyebrow: 'put',
      title: 'Replicated everywhere',
      icon: 'pi pi-globe'
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
