import type { DiagramSpec } from '../../components/marketing/diagram/types'

const spec: DiagramSpec = {
  ariaLabel:
    'A request crosses Firewall, which runs the WAF; clean traffic goes on to the application and a threat is answered with a 403',
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
      title: 'Rule: run the WAF',
      icon: 'az az-firewall',
      active: true
    },
    {
      key: 'waf',
      type: 'card',
      eyebrow: 'WAF',
      title: 'SQLi, XSS, RCE scored',
      icon: 'az az-waf',
      status: {
        label: 'Blocking',
        severity: 'success'
      },
      active: true,
      lit: true
    },
    {
      key: 'application',
      type: 'item',
      eyebrow: 'Application',
      title: 'Clean traffic goes on',
      icon: 'az az-applications',
      active: true
    },
    {
      key: 'blocked',
      type: 'item',
      eyebrow: 'Block',
      title: '403 to the attacker',
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
        node: 'firewall'
      },
      {
        node: 'waf'
      },
      {
        branches: [
          {
            node: 'application'
          },
          {
            node: 'blocked'
          }
        ]
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
      to: 'waf',
      active: true
    },
    {
      from: 'waf',
      to: 'application',
      label: 'allowed',
      active: true
    },
    {
      from: 'waf',
      to: 'blocked',
      label: 'threat'
    }
  ]
}

export default spec
