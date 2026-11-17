import type { DiagramSpec } from '../../components/marketing/diagram/types'

const spec: DiagramSpec = {
  ariaLabel:
    'Traffic reaches Network Shield at the border; clean traffic goes on to the Firewall and listed ASNs, countries and IPs are dropped',
  nodes: [
    {
      key: 'user',
      type: 'pill',
      title: 'Traffic',
      icon: 'az az-globe',
      active: true
    },
    {
      key: 'shield',
      type: 'card',
      eyebrow: 'Network Shield',
      title: 'Network lists at the border',
      icon: 'az az-network-lists',
      status: {
        label: 'L3 and L4',
        severity: 'success'
      },
      active: true,
      lit: true
    },
    {
      key: 'allowed',
      type: 'item',
      eyebrow: 'Allowed',
      title: 'Reaches the Firewall',
      icon: 'az az-firewall',
      active: true
    },
    {
      key: 'dropped',
      type: 'item',
      eyebrow: 'Dropped',
      title: 'Listed ASN, country or IP',
      icon: 'az az-ban'
    }
  ],
  layout: {
    gap: 'wide',
    row: [
      {
        node: 'user'
      },
      {
        node: 'shield'
      },
      {
        branches: [
          {
            node: 'allowed'
          },
          {
            node: 'dropped'
          }
        ]
      }
    ]
  },
  edges: [
    {
      from: 'user',
      to: 'shield',
      active: true
    },
    {
      from: 'shield',
      to: 'allowed',
      label: 'clean',
      active: true
    },
    {
      from: 'shield',
      to: 'dropped',
      label: 'listed'
    }
  ]
}

export default spec
