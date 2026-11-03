import type { DiagramSpec } from '../../components/marketing/diagram/types'

const spec: DiagramSpec = {
  ariaLabel:
    'Traffic reaches Network Shield at the border; clean traffic goes on to the Firewall and listed ASNs, countries and IPs are dropped',
  nodes: [
    {
      key: 'user',
      kind: 'pill',
      title: 'Traffic',
      icon: 'pi pi-globe',
      active: true
    },
    {
      key: 'shield',
      kind: 'card',
      eyebrow: 'Network Shield',
      title: 'Network lists at the border',
      icon: 'ai ai-network-lists',
      status: {
        label: 'L3 and L4',
        severity: 'success'
      },
      active: true,
      lit: true
    },
    {
      key: 'allowed',
      kind: 'item',
      eyebrow: 'Allowed',
      title: 'Reaches the Firewall',
      icon: 'ai ai-edge-firewall',
      active: true
    },
    {
      key: 'dropped',
      kind: 'item',
      eyebrow: 'Dropped',
      title: 'Listed ASN, country or IP',
      icon: 'pi pi-ban'
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
