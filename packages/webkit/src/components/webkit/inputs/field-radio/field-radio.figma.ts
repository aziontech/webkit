import figma from '@figma/code-connect/html'

import FieldRadio from './field-radio.vue'

/**
 * Figma Webkit FieldRadio (2027:7554) — inline radio with label, description, and trailing control.
 */
figma.connect(
  FieldRadio,
  'https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2027-7554',
  {
    props: {
      disabled: figma.boolean('isDisabled'),
      label: figma.string('Label'),
      description: figma.string('Description')
    },
    example: ({ disabled, label, description }) => {
      const disabledAttr = disabled ? ' disabled' : ''
      return `<FieldRadio v-model="selected" name="radio-group" value="option-a" label="${label}" description="${description}"${disabledAttr} />`
    }
  }
)
