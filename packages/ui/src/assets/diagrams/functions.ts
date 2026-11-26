import type { DiagramSpec } from '../../components/marketing/diagram/types'

const spec: DiagramSpec = {
  ariaLabel:
    'A request matches an application rule that runs the auth-handler function; it is answered at the edge or forwarded to the origin API',
  nodes: [
    {
      key: 'user',
      type: 'pill',
      title: 'Request',
      icon: 'az az-user',
      active: true
    },
    {
      key: 'application',
      type: 'card',
      eyebrow: 'Application',
      title: 'Rule: run a function on /account',
      icon: 'az az-rules-engine',
      active: true
    },
    {
      key: 'function',
      type: 'card',
      eyebrow: 'Functions',
      title: 'auth-handler',
      icon: 'az az-functions',
      status: {
        label: 'No cold start',
        severity: 'success'
      },
      active: true,
      lit: true
    },
    {
      key: 'response',
      type: 'item',
      eyebrow: 'Answered here',
      title: 'Response from the edge',
      icon: 'az az-check',
      active: true
    },
    {
      key: 'origin',
      type: 'item',
      eyebrow: 'Origin',
      title: 'Your API',
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
        node: 'function'
      },
      {
        branches: [
          {
            node: 'response'
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
      to: 'function',
      active: true
    },
    {
      from: 'function',
      to: 'response',
      label: 'handled',
      active: true
    },
    {
      from: 'function',
      to: 'origin',
      label: 'forwarded'
    }
  ]
}

export default spec
