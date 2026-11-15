import type { DiagramSpec } from '../../components/marketing/diagram/types'
import claudeMark from '../logos/agents/claude-symbol-color.svg'
import googleMark from '../logos/frameworks/google-symbol-color.svg'
import openaiMark from '../logos/frameworks/openai-symbol-mono.svg'

const spec: DiagramSpec = {
  ariaLabel:
    'An AI app routes paid users to OpenAI GPT-5.5 with a fallback to Claude Opus 4.7, and everyone else to Kimi K2.6 or Gemma 4 depending on load',
  nodes: [
    {
      key: 'app',
      type: 'app',
      title: 'App'
    },
    {
      key: 'paid',
      type: 'pill',
      title: 'Paid user?',
      active: true
    },
    {
      key: 'gpt',
      type: 'item',
      eyebrow: 'OpenAI',
      title: 'GPT-5.5',
      mark: openaiMark,
      status: {
        label: 'Primary',
        severity: 'success'
      },
      active: true,
      lit: true
    },
    {
      key: 'fallback',
      type: 'pill',
      title: 'Fallback',
      active: true
    },
    {
      key: 'claude',
      type: 'item',
      eyebrow: 'Anthropic',
      title: 'Claude Opus 4.7',
      logo: claudeMark,
      active: true
    },
    {
      key: 'rps',
      type: 'pill',
      title: 'RPS > 1.5?'
    },
    {
      key: 'kimi',
      type: 'item',
      eyebrow: 'Moonshot AI',
      title: 'Kimi K2.6',
      icon: 'ai ai-moon'
    },
    {
      key: 'gemma',
      type: 'item',
      eyebrow: 'Google',
      title: 'Gemma 4 26B',
      logo: googleMark
    }
  ],
  layout: {
    align: 'start',
    gap: 'wide',
    row: [
      {
        node: 'app'
      },
      {
        node: 'paid'
      },
      {
        branches: [
          {
            row: [
              {
                node: 'gpt'
              },
              {
                node: 'fallback'
              },
              {
                node: 'claude'
              }
            ]
          },
          {
            gap: 'wide',
            row: [
              {
                node: 'rps'
              },
              {
                branches: [
                  {
                    node: 'kimi'
                  },
                  {
                    node: 'gemma'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  edges: [
    {
      from: 'app',
      to: 'paid',
      active: true
    },
    {
      from: 'paid',
      to: 'gpt',
      label: 'true',
      active: true
    },
    {
      from: 'gpt',
      to: 'fallback',
      active: true
    },
    {
      from: 'fallback',
      to: 'claude',
      active: true
    },
    {
      from: 'paid',
      to: 'rps',
      label: 'false'
    },
    {
      from: 'rps',
      to: 'kimi',
      label: 'true'
    },
    {
      from: 'rps',
      to: 'gemma',
      label: 'false'
    }
  ]
}

export default spec
