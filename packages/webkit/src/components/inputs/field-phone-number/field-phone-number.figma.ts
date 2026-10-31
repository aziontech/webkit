// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2048-5713
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/inputs/field-phone-number/field-phone-number.vue
// component=FieldPhoneNumber
import figma from 'figma'

const instance = figma.selectedInstance

const labelLayer = instance.findInstance('InputLabel')
const labelText = labelLayer.type === 'INSTANCE' ? labelLayer.findText('label') : undefined
const label = labelText && labelText.type === 'TEXT' ? labelText.textContent.trim() : ''

const helperLayer = instance.findInstance('HelperText')
const helperText = helperLayer.type === 'INSTANCE' ? helperLayer.findText('label') : undefined
const helper = helperText && helperText.type === 'TEXT' ? helperText.textContent.trim() : ''

const group = instance.findInstance('InputGroup')
const input = group.type === 'INSTANCE' ? group.findInstance('InputText') : undefined
const placeholder = input && input.type === 'INSTANCE' ? input.getString('placeholder') : ''

export default {
  example: figma.code`<FieldPhoneNumber
  v-model="phone"${
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
  }
/>`,
  imports: ["import FieldPhoneNumber from '@aziontech/webkit/field-phone-number'"],
  id: 'field-phone-number',
  metadata: { nestable: true }
}
