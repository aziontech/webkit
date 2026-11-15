import type { DiagramSpec } from '../../components/marketing/diagram/types'

const spec: DiagramSpec = {
  ariaLabel:
    'An app reaches the application, which runs Mistral 3 Small on AI Inference in under 30 ms, pulling context from vector search on SQL Database and a fine-tuned LoRA adapter',
  nodes: [
    {
      key: 'user',
      type: 'pill',
      title: 'App',
      icon: 'ai ai-comments',
      active: true
    },
    {
      key: 'application',
      type: 'card',
      eyebrow: 'Application',
      title: 'Rule: run the model',
      icon: 'ai ai-rules-engine',
      active: true
    },
    {
      key: 'inference',
      type: 'card',
      eyebrow: 'AI Inference',
      title: 'Mistral 3 Small on Azion',
      icon: 'ai ai-edge-ai',
      status: {
        label: 'Under 30 ms',
        severity: 'success'
      },
      active: true,
      lit: true
    },
    {
      key: 'vector',
      type: 'item',
      eyebrow: 'SQL Database',
      title: 'Vector search for context',
      icon: 'ai ai-edge-sql',
      active: true
    },
    {
      key: 'lora',
      type: 'item',
      eyebrow: 'LoRA',
      title: 'Your fine-tuned adapter',
      icon: 'ai ai-lora'
    }
  ],
  layout: {
    gap: 'wide',
    row: [
      {
        node: 'user'
      },
      {
        node: 'application'
      },
      {
        node: 'inference'
      },
      {
        branches: [
          {
            node: 'vector'
          },
          {
            node: 'lora'
          }
        ]
      }
    ]
  },
  edges: [
    {
      from: 'user',
      to: 'application',
      active: true
    },
    {
      from: 'application',
      to: 'inference',
      active: true
    },
    {
      from: 'inference',
      to: 'vector',
      label: 'RAG',
      active: true
    },
    {
      from: 'inference',
      to: 'lora',
      label: 'tuned'
    }
  ]
}

export default spec
