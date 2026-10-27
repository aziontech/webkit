import { figma } from '@figma/code-connect'

import Brand from './brand.vue'

figma.connect(
  Brand,
  'https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=587-3946',
  {
    props: {
      kind: figma.enum('type', {
        Default: 'default',
        Min: 'reduced',
        Full: 'extended'
      })
    },
    example: (props) => `
      <Brand kind="${props.kind}" size="medium" />
    `
  }
)
