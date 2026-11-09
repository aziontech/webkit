import type { DiagramSpec } from '../../components/marketing/diagram/types'

const spec: DiagramSpec = {
  ariaLabel:
    'A request crosses Firewall, which runs Bot Management; a human is allowed through and a bad bot is denied, dropped or delayed',
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
      title: 'Rule: run Bot Management',
      icon: 'ai ai-edge-firewall',
      active: true
    },
    {
      key: 'bots',
      kind: 'card',
      eyebrow: 'Bot Management',
      title: 'Score, then classify',
      icon: 'ai ai-bot-manager',
      status: {
        label: 'Score 12',
        severity: 'info'
      },
      active: true,
      lit: true
    },
    {
      key: 'human',
      kind: 'item',
      eyebrow: 'Human',
      title: 'Request allowed',
      icon: 'pi pi-user',
      active: true
    },
    {
      key: 'bot',
      kind: 'item',
      eyebrow: 'Bad bot',
      title: 'Deny, drop or delay',
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
        node: 'bots'
      },
      {
        branches: [
          {
            node: 'human'
          },
          {
            node: 'bot'
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
      to: 'bots',
      active: true
    },
    {
      from: 'bots',
      to: 'human',
      label: 'human',
      active: true
    },
    {
      from: 'bots',
      to: 'bot',
      label: 'bot'
    }
  ]
}

export default spec
