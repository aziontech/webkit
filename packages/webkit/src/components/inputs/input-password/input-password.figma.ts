// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3714-10788
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/inputs/input-password/input-password.vue
// component=InputPassword
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
  example: figma.code`<InputPassword
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
  imports: ["import InputPassword from '@aziontech/webkit/input-password'"],
  id: 'input-password',
  metadata: { nestable: true }
}
