import figma from '@figma/code-connect/html'

import Avatar from './avatar.vue'

/**
 * Figma Webkit Avatar (477:882) — Circle/Square × sm/md/lg × Text/Icon/Image.
 * Size xl (64px) is not mapped until the webkit size API supports a fourth preset.
 */
figma.connect(
  Avatar,
  'https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=477-882',
  {
    props: {
      kind: figma.enum('Shape', {
        Circle: 'circle',
        Square: 'square'
      }),
      size: figma.enum('Size', {
        sm: 'small',
        md: 'medium',
        lg: 'large'
      }),
      label: figma.string('Label'),
      src: figma.string('Image')
    },
    example: ({ kind, size, label, src }) => {
      if (src) {
        return `<Avatar kind="${kind}" size="${size}" src="${src}" alt="User avatar" />`
      }
      if (label) {
        return `<Avatar kind="${kind}" size="${size}" label="${label}" />`
      }
      return `<Avatar kind="${kind}" size="${size}" />`
    }
  }
)
