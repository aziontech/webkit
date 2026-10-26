import type { DiagramSpec } from '../../components/marketing/diagram/types'
import openaiMark from '../logos/frameworks/openai-symbol-mono.svg'

const spec: DiagramSpec = {
  ariaLabel:
    'An AI app sends real-time tasks to Mistral 3 Small on AI Inference, under 30 ms, and other tasks to OpenAI GPT-5.5',
  nodes: [
    {
      key: 'app',
      kind: 'app',
      title: 'App'
    },
    {
      key: 'realtime',
      kind: 'pill',
      title: 'Real-time task?',
      active: true
    },
    {
      key: 'inference',
      kind: 'item',
      eyebrow: 'AI Inference',
      title: 'Mistral 3 Small',
      icon: 'ai ai-edge-ai',
      status: {
        label: 'Under 30 ms',
        severity: 'success'
      },
      active: true,
      lit: true
    },
    {
      key: 'gpt',
      kind: 'item',
      eyebrow: 'OpenAI',
      title: 'GPT-5.5',
      mark: openaiMark
    }
  ],
  layout: {
    gap: 'wide',
    row: [
      {
        node: 'app'
      },
      {
        node: 'realtime'
      },
      {
        branches: [
          {
            node: 'inference'
          },
          {
            node: 'gpt'
          }
        ]
      }
    ]
  },
  edges: [
    {
      from: 'app',
      to: 'realtime',
      active: true
    },
    {
      from: 'realtime',
      to: 'inference',
      label: 'true',
      active: true
    },
    {
      from: 'realtime',
      to: 'gpt',
      label: 'false'
    }
  ]
}

export default spec
