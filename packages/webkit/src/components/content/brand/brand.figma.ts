import { figma } from '@figma/code-connect'

import Brand from './brand.vue'

// The Figma "Brand" component exposes a `type` variant (Default | Min | Move to the Edge | Full).
// We surface the three lockups this component ships: Default → default, Min → reduced, and
// Full (the tagline lockup) → extended. The "Move to the Edge" Figma variant is not exposed.
// `size` has no Figma counterpart — it is a code-only prop, so it is not mapped here.
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
    example: (props) => /* html */ `
      <Brand kind="${props.kind}" size="medium" />
    `
  }
)
