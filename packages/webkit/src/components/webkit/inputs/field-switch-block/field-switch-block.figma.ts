import figma from '@figma/code-connect/html'

import FieldSwitchBlock from './field-switch-block.vue'

/**
 * Figma Webkit FieldSwitchBlock (2027:7168) — card-style toggle with highlighted border state.
 */
figma.connect(
  FieldSwitchBlock,
  'https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2027-7168',
  {
    props: {
      disabled: figma.boolean('isDisabled'),
      label: figma.string('Label'),
      description: figma.string('Description')
    },
    example: ({ disabled, label, description }) => {
      const disabledAttr = disabled ? ' disabled' : ''
      return `<FieldSwitchBlock v-model="enabled" label="${label}" description="${description}"${disabledAttr} />`
    }
  }
)
