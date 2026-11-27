import type { DiagramSpec } from '../../components/marketing/diagram/types'

const spec: DiagramSpec = {
  ariaLabel:
    'A resolver asks the shop.example.com zone; the A record points at the workload, the MX record at the mail provider and a TXT record carries domain verification',
  nodes: [
    {
      key: 'user',
      type: 'pill',
      title: 'Resolver',
      icon: 'az az-globe',
      active: true
    },
    {
      key: 'dns',
      type: 'card',
      eyebrow: 'DNS',
      title: 'shop.example.com zone',
      icon: 'az az-edge-dns',
      status: {
        label: 'DNSSEC',
        severity: 'success'
      },
      active: true,
      lit: true
    },
    {
      key: 'apex',
      type: 'item',
      eyebrow: 'A record',
      title: 'Points at the workload',
      icon: 'az az-workloads',
      active: true
    },
    {
      key: 'mail',
      type: 'item',
      eyebrow: 'MX record',
      title: 'Mail provider',
      icon: 'az az-mail'
    },
    {
      key: 'txt',
      type: 'item',
      eyebrow: 'TXT record',
      title: 'Domain verification',
      icon: 'az az-key'
    }
  ],
  layout: {
    gap: 'wide',
    row: [
      {
        node: 'user'
      },
      {
        node: 'dns'
      },
      {
        branches: [
          {
            node: 'apex'
          },
          {
            node: 'mail'
          },
          {
            node: 'txt'
          }
        ]
      }
    ]
  },
  edges: [
    {
      from: 'user',
      to: 'dns',
      active: true
    },
    {
      from: 'dns',
      to: 'apex',
      label: 'apex',
      active: true
    },
    {
      from: 'dns',
      to: 'mail',
      label: 'mail'
    },
    {
      from: 'dns',
      to: 'txt',
      label: '_verify'
    }
  ]
}

export default spec
