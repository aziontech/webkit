import type { DiagramSpec } from '../../components/marketing/diagram/types'

const spec: DiagramSpec = {
  ariaLabel:
    'A user reaches the application, whose origin is the assets bucket on Object Storage; the object is cached at the edge and uploads come from any S3-compatible client',
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
      title: 'Rule: origin is a bucket',
      icon: 'ai ai-rules-engine',
      active: true
    },
    {
      key: 'storage',
      kind: 'card',
      eyebrow: 'Object Storage',
      title: 'assets bucket',
      icon: 'ai ai-edge-storage',
      status: {
        label: '$0 egress',
        severity: 'success'
      },
      active: true,
      lit: true
    },
    {
      key: 'cache',
      kind: 'item',
      eyebrow: 'Cache',
      title: 'Object cached at the edge',
      icon: 'ai ai-tiered-cache',
      active: true
    },
    {
      key: 's3',
      kind: 'item',
      eyebrow: 'S3 API',
      title: 'Any S3-compatible client',
      icon: 'pi pi-code'
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
        node: 'storage'
      },
      {
        branches: [
          {
            node: 'cache'
          },
          {
            node: 's3'
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
      to: 'storage',
      active: true
    },
    {
      from: 'storage',
      to: 'cache',
      label: 'next hit',
      active: true
    },
    {
      from: 'storage',
      to: 's3',
      label: 'uploads'
    }
  ]
}

export default spec
