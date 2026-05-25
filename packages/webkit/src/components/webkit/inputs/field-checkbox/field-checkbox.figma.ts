import figma from '@figma/code-connect/html'

import FieldCheckbox from './field-checkbox.vue'

/**
 * Figma Webkit FieldCheckbox (2027:7337) — inline checkbox with leading control, label, and description.
 */
figma.connect(
  FieldCheckbox,
  'https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2027-7337',
  {
    props: {
      disabled: figma.boolean('isDisabled'),
      label: figma.string('Label'),
      description: figma.string('Description')
    },
    example: ({ disabled, label, description }) => {
      const disabledAttr = disabled ? ' disabled' : ''
      return `<FieldCheckbox v-model="checked" label="${label}" description="${description}"${disabledAttr} />`
    }
  }
)
