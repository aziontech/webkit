import figma from '@figma/code-connect/html'

import FieldCheckboxBlock from './field-checkbox-block.vue'

/**
 * Figma Webkit FieldCheckboxBlock (2027:7393) — card-style checkbox with label and description.
 */
figma.connect(
  FieldCheckboxBlock,
  'https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2027-7393',
  {
    props: {
      disabled: figma.boolean('isDisabled'),
      label: figma.string('Label'),
      description: figma.string('Description')
    },
    example: ({ disabled, label, description }) => {
      const disabledAttr = disabled ? ' disabled' : ''
      return `<FieldCheckboxBlock v-model="checked" label="${label}" description="${description}"${disabledAttr} />`
    }
  }
)
