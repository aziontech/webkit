import { figma } from '@figma/code-connect'

import Tooltip from './tooltip.vue'

figma.connect(
  Tooltip,
  'https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4281-4543',
  {
    props: {
      text: figma.string('label')
    },
    example: ({ text }) => /* html */ `
    <Tooltip text="${text}">
      <IconButton icon="pi pi-info-circle" aria-label="More information" />
    </Tooltip>
  `
  }
)
