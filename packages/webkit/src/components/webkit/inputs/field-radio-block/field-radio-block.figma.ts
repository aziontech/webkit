import figma from '@figma/code-connect/html'

import FieldRadioBlock from './field-radio-block.vue'

/**
 * Figma Webkit FieldRadioBlock (2027:7582) — card-style radio option with selected emphasis.
 */
figma.connect(
  FieldRadioBlock,
  'https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2027-7582',
  {
    props: {
      disabled: figma.boolean('isDisabled'),
      label: figma.string('Label'),
      description: figma.string('Description')
    },
    example: ({ disabled, label, description }) => {
      const disabledAttr = disabled ? ' disabled' : ''
      return `<FieldRadioBlock v-model="selected" name="plan" value="starter" label="${label}" description="${description}"${disabledAttr} />`
    }
  }
)
