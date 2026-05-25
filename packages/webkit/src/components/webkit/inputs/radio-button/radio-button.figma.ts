import figma from '@figma/code-connect/html'

import RadioButton from './radio-button.vue'

/**
 * Figma Webkit RadioButton control (2027:7554) — atomic circle input nested inside FieldRadio layouts.
 */
figma.connect(
  RadioButton,
  'https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2027-7554',
  {
    props: {
      disabled: figma.boolean('isDisabled')
    },
    example: ({ disabled }) => {
      const disabledAttr = disabled ? ' disabled' : ''
      return `<RadioButton v-model="selected" name="radio-group" value="option-a"${disabledAttr} />`
    }
  }
)
