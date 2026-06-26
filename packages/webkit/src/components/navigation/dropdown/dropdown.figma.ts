import { figma } from '@figma/code-connect'

import Dropdown from './dropdown.vue'

figma.connect(
  Dropdown,
  'https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3775-16746&m=dev',
  {
    props: {
      placement: figma.enum('placement', {
        'bottom-start': 'bottom-start',
        'bottom-end': 'bottom-end',
        'top-start': 'top-start',
        'top-end': 'top-end'
      }),
      disabled: figma.boolean('disabled'),
      open: figma.boolean('open'),
      content: figma.children('*')
    },
    example: (props) => /* html */ `
      <Dropdown
        :placement="${props.placement}"
        :disabled="${props.disabled}"
        :open="${props.open}"
      >
        ${props.content}
      </Dropdown>
    `
  }
)
