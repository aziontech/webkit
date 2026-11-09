import type { DiagramSpec } from '../../components/marketing/diagram/types'

const spec: DiagramSpec = {
  ariaLabel:
    'A user request reaches the workload over TLS, passes the bound firewall, and only then reaches the application',
  nodes: [
    {
      key: 'user',
      kind: 'pill',
      title: 'User',
      icon: 'pi pi-user',
      active: true
    },
    {
      key: 'workload',
      kind: 'card',
      eyebrow: 'Workload',
      title: 'shop.example.com',
      icon: 'ai ai-domains',
      status: {
        label: 'TLS on',
        severity: 'success'
      },
      active: true,
      lit: true
    },
    {
      key: 'firewall',
      kind: 'item',
      eyebrow: 'Firewall',
      title: 'WAF, rate limits, network lists',
      icon: 'ai ai-edge-firewall',
      active: true
    },
    {
      key: 'application',
      kind: 'item',
      eyebrow: 'Application',
      title: 'storefront',
      icon: 'ai ai-edge-application',
      active: true
    }
  ],
  layout: {
    gap: 'wide',
    row: [
      {
        node: 'user'
      },
      {
        node: 'workload'
      },
      {
        node: 'firewall'
      },
      {
        node: 'application'
      }
    ]
  },
  edges: [
    {
      from: 'user',
      to: 'workload',
      active: true
    },
    {
      from: 'workload',
      to: 'firewall',
      active: true
    },
    {
      from: 'firewall',
      to: 'application',
      label: 'allowed',
      active: true
    }
  ]
}

export default spec
