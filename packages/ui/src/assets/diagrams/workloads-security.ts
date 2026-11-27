import type { DiagramSpec } from '../../components/marketing/diagram/types'

const spec: DiagramSpec = {
  ariaLabel:
    'A user request reaches the workload over TLS, passes the bound firewall, and only then reaches the application',
  nodes: [
    {
      key: 'user',
      type: 'pill',
      title: 'User',
      icon: 'az az-user',
      active: true
    },
    {
      key: 'workload',
      type: 'card',
      eyebrow: 'Workload',
      title: 'shop.example.com',
      icon: 'az az-domains',
      status: {
        label: 'TLS on',
        severity: 'success'
      },
      active: true,
      lit: true
    },
    {
      key: 'firewall',
      type: 'item',
      eyebrow: 'Firewall',
      title: 'WAF, rate limits, network lists',
      icon: 'az az-firewall',
      active: true
    },
    {
      key: 'application',
      type: 'item',
      eyebrow: 'Application',
      title: 'storefront',
      icon: 'az az-applications',
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
