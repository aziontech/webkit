// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3714-10789
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/inputs/number-input/number-input.vue
// component=NumberInput
import figma from 'figma'

const instance = figma.selectedInstance

const placeholder = instance.getString('placeholder')
const size = instance.getEnum('size', {
  large: 'large',
  medium: 'medium',
  small: 'small'
})
const disabled = instance.getEnum('disabled', {
  false: false,
  true: true
})
const required = instance.getEnum('required', {
  false: false,
  true: true
})
const invalid = instance.getEnum('invalid', {
  true: true,
  false: false
})

export default {
  example: figma.code`<NumberInput
  v-model="value"${
    placeholder
      ? figma.code`
  placeholder="${placeholder}"`
      : ''
  }${
    size === 'medium'
      ? ''
      : figma.code`
  size="${size}"`
  }${
    required
      ? figma.code`
  required`
      : ''
  }${
    invalid
      ? figma.code`
  invalid`
      : ''
  }${
    disabled
      ? figma.code`
  disabled`
      : ''
  }
/>`,
  imports: ["import NumberInput from '@aziontech/webkit/number-input'"],
  id: 'number-input',
  metadata: { nestable: true }
}
