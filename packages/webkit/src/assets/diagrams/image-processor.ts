import type { DiagramSpec } from '../../components/marketing/diagram/types'

const spec: DiagramSpec = {
  ariaLabel:
    'A browser asks for an image; the application runs Image Processor, which resizes and converts it, caches the variant and reads the source image from the origin once',
  nodes: [
    {
      key: 'user',
      type: 'pill',
      title: 'Browser',
      icon: 'az az-globe',
      active: true
    },
    {
      key: 'application',
      type: 'card',
      eyebrow: 'Application',
      title: 'Rule: optimize images',
      icon: 'az az-rules-engine',
      active: true
    },
    {
      key: 'processor',
      type: 'card',
      eyebrow: 'Image Processor',
      title: 'fit-in/400x400, WebP',
      icon: 'az az-image-processor',
      status: {
        label: 'Variant cached',
        severity: 'success'
      },
      active: true,
      lit: true
    },
    {
      key: 'cache',
      type: 'item',
      eyebrow: 'Cache',
      title: 'Same variant, no work',
      icon: 'az az-layers',
      active: true
    },
    {
      key: 'origin',
      type: 'item',
      eyebrow: 'Origin',
      title: 'One source image',
      icon: 'az az-image'
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
