import type { DiagramSpec } from '../../components/marketing/diagram/types'

const spec: DiagramSpec = {
  ariaLabel:
    'A request matches an application rule that runs the auth-handler function; it is answered at the edge or forwarded to the origin API',
  nodes: [
    {
      key: 'user',
      kind: 'pill',
      title: 'Request',
      icon: 'pi pi-user',
      active: true
    },
    {
      key: 'application',
      kind: 'card',
      eyebrow: 'Application',
      title: 'Rule: run a function on /account',
      icon: 'ai ai-rules-engine',
      active: true
    },
    {
      key: 'function',
      kind: 'card',
      eyebrow: 'Functions',
      title: 'auth-handler',
      icon: 'ai ai-edge-functions',
      status: {
        label: 'No cold start',
        severity: 'success'
      },
      active: true,
      lit: true
    },
    {
      key: 'response',
      kind: 'item',
      eyebrow: 'Answered here',
      title: 'Response from the edge',
      icon: 'pi pi-check',
      active: true
    },
    {
      key: 'origin',
      kind: 'item',
      eyebrow: 'Origin',
      title: 'Your API',
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
