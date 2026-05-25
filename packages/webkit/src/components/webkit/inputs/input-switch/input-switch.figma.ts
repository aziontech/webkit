import figma from '@figma/code-connect/html'

import InputSwitch from './input-switch.vue'

/**
 * Figma Webkit _Switch (2027:1247) — atomic toggle control (36×20 px), no label.
 */
figma.connect(
  InputSwitch,
  'https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2027-1247',
  {
    props: {
      disabled: figma.boolean('isDisabled')
    },
    example: ({ disabled }) => {
      const disabledAttr = disabled ? ' disabled' : ''
      return `<InputSwitch v-model="enabled"${disabledAttr} />`
    }
  }
)
