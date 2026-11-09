// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4722-6730
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/inputs/textarea/textarea.vue
// component=Textarea
import figma from 'figma'

const instance = figma.selectedInstance

const placeholder = instance.getString('placeholder')
const disabled = instance.getEnum('disabled', {
  false: false,
  true: true
})
const required = instance.getEnum('required', {
  false: false,
  true: true
})
const invalid = instance.getEnum('invalid', {
  false: false,
  true: true
})

export default {
  example: figma.code`<Textarea
  v-model="value"${
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
  }${
    disabled
      ? figma.code`
  disabled`
      : ''
  }
/>`,
  imports: ["import Textarea from '@aziontech/webkit/textarea'"],
  id: 'textarea',
  metadata: { nestable: true }
}
