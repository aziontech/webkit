// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2027-3212
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/inputs/field-password/field-password.vue
// component=FieldPassword
import figma from 'figma'

const instance = figma.selectedInstance

const state = instance.getEnum('state', {
  default: 'default',
  error: 'invalid',
  required: 'required'
})
const showHelper = instance.getBoolean('showHelperText')
const showMeter = instance.getBoolean('requirements')

const labelLayer = instance.findInstance('InputLabel')
const labelText = labelLayer.type === 'INSTANCE' ? labelLayer.findText('label') : undefined
const label = labelText && labelText.type === 'TEXT' ? labelText.textContent.trim() : ''

const helperLayer = instance.findInstance('HelperText')
const helperText = helperLayer.type === 'INSTANCE' ? helperLayer.findText('label') : undefined
const helper =
  (showHelper || state === 'invalid') && helperText && helperText.type === 'TEXT'
    ? helperText.textContent.trim()
    : ''

const input = instance.findInstance('InputPassword')
const placeholder = input.type === 'INSTANCE' ? input.getString('placeholder') : ''

export default {
  example: figma.code`<FieldPassword
  v-model="password"${
    label
      ? figma.code`
  label="${label}"`
      : ''
  }${
    placeholder
      ? figma.code`
  placeholder="${placeholder}"`
      : ''
  }${
    helper
      ? figma.code`
  helper-text="${helper}"`
      : ''
  }${
    state === 'required'
      ? figma.code`
  required`
      : ''
  }${
    state === 'invalid'
      ? figma.code`
  invalid`
      : ''
  }${
    showMeter
      ? figma.code`
  requirements`
      : ''
  }
/>`,
  imports: ["import FieldPassword from '@aziontech/webkit/field-password'"],
  id: 'field-password',
  metadata: { nestable: true }
}
