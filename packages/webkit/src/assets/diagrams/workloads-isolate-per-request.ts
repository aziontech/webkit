import type { DiagramSpec } from '../../components/marketing/diagram/types'

const spec: DiagramSpec = {
  ariaLabel:
    'Requests reach Azion Runtime, which starts a separate isolate for each one, with no cold start',
  nodes: [
    {
      key: 'requests',
      kind: 'pill',
      title: 'Requests',
      icon: 'pi pi-user',
      active: true
    },
    {
      key: 'runtime',
      kind: 'card',
      eyebrow: 'Azion Runtime',
      title: 'Isolate per request',
      icon: 'ai ai-edge-functions',
      status: {
        label: 'No cold start',
        severity: 'success'
      },
      active: true,
      lit: true
    },
    {
      key: 'first',
      kind: 'item',
      eyebrow: 'Isolate',
      title: 'Request 1',
      active: true
    },
    {
      key: 'second',
      kind: 'item',
      eyebrow: 'Isolate',
      title: 'Request 2',
      active: true
    },
    {
      key: 'third',
      kind: 'item',
      eyebrow: 'Isolate',
      title: 'Request 3',
      active: true
    }
  ],
  layout: {
    gap: 'wide',
    row: [
      {
        node: 'requests'
      },
      {
        node: 'runtime'
      },
      {
        branches: [
          {
            node: 'first'
          },
          {
            node: 'second'
          },
          {
            node: 'third'
          }
        ]
      }
    ]
  },
  edges: [
    {
      from: 'requests',
      to: 'runtime',
      active: true
    },
    {
      from: 'runtime',
      to: 'first',
      active: true
    },
    {
      from: 'runtime',
      to: 'second',
      active: true
    },
    {
      from: 'runtime',
      to: 'third',
      active: true
    }
  ]
}

export default spec
