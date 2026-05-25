import figma from '@figma/code-connect/html'

import FieldSwitch from './field-switch.vue'

/**
 * Figma Webkit FieldSwitch (542:105) — inline toggle with leading switch, label, and description.
 */
figma.connect(
  FieldSwitch,
  'https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=542-105',
  {
    props: {
      disabled: figma.boolean('isDisabled'),
      label: figma.string('Label'),
      description: figma.string('Description')
    },
    example: ({ disabled, label, description }) => {
      const disabledAttr = disabled ? ' disabled' : ''
      return `<FieldSwitch v-model="enabled" label="${label}" description="${description}"${disabledAttr} />`
    }
  }
)
