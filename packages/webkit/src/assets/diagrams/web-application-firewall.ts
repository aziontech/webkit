import type { DiagramSpec } from '../../components/marketing/diagram/types'

const spec: DiagramSpec = {
  ariaLabel:
    'A request crosses Firewall, which runs the WAF; clean traffic goes on to the application and a threat is answered with a 403',
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
      title: 'Rule: run the WAF',
      icon: 'ai ai-edge-firewall',
      active: true
    },
    {
      key: 'waf',
      kind: 'card',
      eyebrow: 'WAF',
      title: 'SQLi, XSS, RCE scored',
      icon: 'ai ai-waf-rules',
      status: {
        label: 'Blocking',
        severity: 'success'
      },
      active: true,
      lit: true
    },
    {
      key: 'application',
      kind: 'item',
      eyebrow: 'Application',
      title: 'Clean traffic goes on',
      icon: 'ai ai-edge-application',
      active: true
    },
    {
      key: 'blocked',
      kind: 'item',
      eyebrow: 'Block',
      title: '403 to the attacker',
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
