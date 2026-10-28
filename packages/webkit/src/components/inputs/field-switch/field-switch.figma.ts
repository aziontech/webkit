// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=542-105
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/inputs/field-switch/field-switch.vue
// component=FieldSwitch
import figma from 'figma'

const instance = figma.selectedInstance

const disabled = instance.getEnum('disabled', {
  false: false,
  true: true
})
const hasDescription = instance.getBoolean('hasDescription')

const labelText = instance.findText('Switch label')
const label = labelText.type === 'TEXT' ? labelText.textContent.trim() : ''
const descriptionText = instance.findText('Switch description')
const description =
  hasDescription && descriptionText.type === 'TEXT' ? descriptionText.textContent.trim() : ''

const helperLayer = disabled ? instance.findInstance('HelperText') : undefined
const helperText =
  helperLayer && helperLayer.type === 'INSTANCE' ? helperLayer.findText('label') : undefined
const helper = helperText && helperText.type === 'TEXT' ? helperText.textContent.trim() : ''

export default {
  example: figma.code`<FieldSwitch
  v-model="checked"${
    label
      ? figma.code`
  label="${label}"`
      : ''
  }${
    description
      ? figma.code`
  description="${description}"`
      : ''
  }${
    helper
      ? figma.code`
  helper-text="${helper}"`
      : ''
  }${
    disabled
      ? figma.code`
  disabled`
      : ''
  }
/>`,
  imports: ["import FieldSwitch from '@aziontech/webkit/field-switch'"],
  id: 'field-switch',
  metadata: { nestable: true }
}
