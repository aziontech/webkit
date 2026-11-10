// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3714-10788
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/inputs/password-input/password-input.vue
// component=PasswordInput
import figma from 'figma'

const instance = figma.selectedInstance

const placeholder = instance.getString('placeholder')
const required = instance.getEnum('required', {
  false: false,
  true: true
})
const invalid = instance.getEnum('invalid', {
  false: false,
  true: true
})

export default {
  example: figma.code`<PasswordInput
  v-model="password"${
    placeholder
      ? figma.code`
  placeholder="${placeholder}"`
      : ''
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
  }
/>`,
  imports: ["import PasswordInput from '@aziontech/webkit/password-input'"],
  id: 'password-input',
  metadata: { nestable: true }
}
