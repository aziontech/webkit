import type { DiagramSpec } from '../../components/marketing/diagram/types'

const spec: DiagramSpec = {
  ariaLabel:
    'A request reaches Firewall, whose rules apply network lists, the WAF and a rate limit in order before the storefront application runs',
  nodes: [
    {
      key: 'user',
      kind: 'pill',
      title: 'Request',
      icon: 'pi pi-user',
      active: true
    },
    {
      key: 'firewall',
      kind: 'card',
      eyebrow: 'Firewall',
      title: 'Rules in order, before any code',
      icon: 'ai ai-edge-firewall',
      active: true,
      lit: true
    },
    {
      key: 'lists',
      kind: 'item',
      eyebrow: 'Network lists',
      title: 'IP, ASN and country',
      icon: 'ai ai-network-lists',
      active: true
    },
    {
      key: 'waf',
      kind: 'item',
      eyebrow: 'WAF',
      title: 'Payload inspection',
      icon: 'ai ai-waf-rules',
      active: true
    },
    {
      key: 'limit',
      kind: 'item',
      eyebrow: 'Rate limit',
      title: 'Requests per second',
      icon: 'pi pi-clock',
      active: true
    },
    {
      key: 'application',
      kind: 'card',
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
