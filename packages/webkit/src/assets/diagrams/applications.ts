import type { DiagramSpec } from '../../components/marketing/diagram/types'

const spec: DiagramSpec = {
  ariaLabel:
    'A user reaches the application; its rules send static assets to cache, /account to the auth-handler function and /api to the origin',
  nodes: [
    {
      key: 'user',
      type: 'pill',
      title: 'User',
      icon: 'ai ai-user',
      active: true
    },
    {
      key: 'application',
      type: 'card',
      eyebrow: 'Application',
      title: 'Rules in order, every request',
      icon: 'ai ai-rules-engine',
      active: true,
      status: {
        label: '2 phases',
        severity: 'success'
      }
    },
    {
      key: 'cache',
      type: 'item',
      eyebrow: 'Deliver',
      title: 'Static assets from cache',
      icon: 'ai ai-tiered-cache',
      active: true
    },
    {
      key: 'function',
      type: 'item',
      eyebrow: 'Run',
      title: 'auth-handler on /account',
      icon: 'ai ai-edge-functions'
    },
    {
      key: 'origin',
      type: 'item',
      eyebrow: 'Origin',
      title: 'Your API on /api',
      icon: 'ai ai-database'
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
            node: 'cache'
          },
          {
            node: 'function'
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
      label: 'assets',
      active: true
    },
    {
      from: 'application',
      to: 'function',
      label: '/account'
    },
    {
      from: 'application',
      to: 'origin',
      label: '/api'
    }
  ]
}

export default spec
