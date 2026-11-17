import type { DiagramSpec } from '../../components/marketing/diagram/types'

const spec: DiagramSpec = {
  ariaLabel:
    'A request reaches Firewall, whose rules apply network lists, the WAF and a rate limit in order before the storefront application runs',
  nodes: [
    {
      key: 'user',
      type: 'pill',
      title: 'Request',
      icon: 'az az-user',
      active: true
    },
    {
      key: 'firewall',
      type: 'card',
      eyebrow: 'Firewall',
      title: 'Rules in order, before any code',
      icon: 'az az-firewall',
      active: true,
      lit: true
    },
    {
      key: 'lists',
      type: 'item',
      eyebrow: 'Network lists',
      title: 'IP, ASN and country',
      icon: 'az az-network-lists',
      active: true
    },
    {
      key: 'waf',
      type: 'item',
      eyebrow: 'WAF',
      title: 'Payload inspection',
      icon: 'az az-waf',
      active: true
    },
    {
      key: 'limit',
      type: 'item',
      eyebrow: 'Rate limit',
      title: 'Requests per second',
      icon: 'az az-clock',
      active: true
    },
    {
      key: 'application',
      type: 'card',
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
        node: 'firewall'
      },
      {
        branches: [
          {
            node: 'lists'
          },
          {
            node: 'waf'
          },
          {
            node: 'limit'
          }
        ]
      },
      {
        node: 'application'
      }
    ]
  },
  edges: [
    {
      from: 'user',
      to: 'firewall',
      active: true
    },
    {
      from: 'firewall',
      to: 'lists',
      label: '',
      active: true
    },
    {
      from: 'firewall',
      to: 'waf',
      label: '',
      active: true
    },
    {
      from: 'firewall',
      to: 'limit',
      label: '',
      active: true
    },
    {
      from: 'lists',
      to: 'application',
      active: true
    },
    {
      from: 'waf',
      to: 'application',
      active: true
    },
    {
      from: 'limit',
      to: 'application',
      active: true
    }
  ]
}

export default spec
