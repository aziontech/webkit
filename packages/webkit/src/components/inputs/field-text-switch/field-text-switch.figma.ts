// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2027-3060
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/inputs/field-text-switch/field-text-switch.vue
// component=FieldTextSwitch
import figma from 'figma'

const instance = figma.selectedInstance

const invalid = instance.getEnum('invalid', {
  false: false,
  true: true
})
const disabled = instance.getEnum('disabled', {
  false: false,
  true: true
})
const showHelper = instance.getBoolean('showHelper')

const labelLayer = instance.findInstance('InputLabel')
const labelText = labelLayer.type === 'INSTANCE' ? labelLayer.findText('label') : undefined
const label = labelText && labelText.type === 'TEXT' ? labelText.textContent.trim() : ''
const required =
  labelLayer.type === 'INSTANCE'
    ? labelLayer.getEnum('required', { false: false, true: true })
    : false

const helperLayer = instance.findInstance('HelperText')
const helperText = helperLayer.type === 'INSTANCE' ? helperLayer.findText('label') : undefined
const helper =
  showHelper && helperText && helperText.type === 'TEXT' ? helperText.textContent.trim() : ''

const group = instance.findInstance('InputGroup')
const input = group.type === 'INSTANCE' ? group.findInstance('InputText') : undefined
const placeholder = input && input.type === 'INSTANCE' ? input.getString('placeholder') : ''

export default {
  example: figma.code`<FieldTextSwitch
  v-model="value"
  v-model:enabled="enabled"${
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
  imports: ["import FieldTextSwitch from '@aziontech/webkit/field-text-switch'"],
  id: 'field-text-switch',
  metadata: { nestable: true }
}
