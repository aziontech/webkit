import type { DiagramSpec } from '../../components/marketing/diagram/types'

const spec: DiagramSpec = {
  ariaLabel:
    'A browser asks for an image; the application runs Image Processor, which resizes and converts it, caches the variant and reads the source image from the origin once',
  nodes: [
    {
      key: 'user',
      kind: 'pill',
      title: 'Browser',
      icon: 'pi pi-globe',
      active: true
    },
    {
      key: 'application',
      kind: 'card',
      eyebrow: 'Application',
      title: 'Rule: optimize images',
      icon: 'ai ai-rules-engine',
      active: true
    },
    {
      key: 'processor',
      kind: 'card',
      eyebrow: 'Image Processor',
      title: 'fit-in/400x400, WebP',
      icon: 'ai ai-image-processor',
      status: {
        label: 'Variant cached',
        severity: 'success'
      },
      active: true,
      lit: true
    },
    {
      key: 'cache',
      kind: 'item',
      eyebrow: 'Cache',
      title: 'Same variant, no work',
      icon: 'ai ai-tiered-cache',
      active: true
    },
    {
      key: 'origin',
      kind: 'item',
      eyebrow: 'Origin',
      title: 'One source image',
      icon: 'pi pi-image'
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
        node: 'processor'
      },
      {
        branches: [
          {
            node: 'cache'
          },
          {
            node: 'origin'
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
      to: 'processor',
      active: true
    },
    {
      from: 'processor',
      to: 'cache',
      label: 'next hit',
      active: true
    },
    {
      from: 'processor',
      to: 'origin',
      label: 'first hit'
    }
  ]
}

export default spec
