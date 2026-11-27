import type { DiagramSpec } from '../../components/marketing/diagram/types'
import claudeMark from '../logos/agents/claude-symbol-color.svg'

const spec: DiagramSpec = {
  ariaLabel:
    'An AI app checks whether its provider is degraded; Claude Haiku 5.5 on Anthropic is degraded, so the call falls back to Claude Haiku 5.5 on Amazon Bedrock',
  nodes: [
    {
      key: 'app',
      type: 'app',
      title: 'App'
    },
    {
      key: 'degraded',
      type: 'pill',
      title: 'Provider degraded?',
      active: true
    },
    {
      key: 'anthropic',
      type: 'item',
      eyebrow: 'Anthropic',
      title: 'Claude Haiku 5.5',
      logo: claudeMark,
      status: {
        label: 'Degraded',
        severity: 'warning'
      }
    },
    {
      key: 'bedrock',
      type: 'item',
      eyebrow: 'Amazon Bedrock',
      title: 'Claude Haiku 5.5',
      icon: 'az az-cloud',
      active: true,
      lit: true
    }
  ],
  layout: {
    gap: 'wide',
    row: [
      {
        node: 'app'
      },
      {
        node: 'degraded'
      },
      {
        branches: [
          {
            node: 'anthropic'
          },
          {
            node: 'bedrock'
          }
        ]
      }
    ]
  },
  edges: [
    {
      from: 'app',
      to: 'degraded',
      active: true
    },
    {
      from: 'degraded',
      to: 'anthropic',
      label: 'primary'
    },
    {
      from: 'degraded',
      to: 'bedrock',
      label: 'fallback',
      active: true
    }
  ]
}

export default spec
