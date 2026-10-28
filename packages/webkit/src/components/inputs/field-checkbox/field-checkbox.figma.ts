// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2027-7337
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/inputs/field-checkbox/field-checkbox.vue
// component=FieldCheckbox
import figma from 'figma'

const instance = figma.selectedInstance

const disabled = instance.getEnum('disabled', {
  false: false,
  true: true
})
const hasDescription = instance.getBoolean('hasDescription')

const labelText = instance.findText('Switch label')
const label = labelText && labelText.type === 'TEXT' ? labelText.textContent.trim() : ''
const descriptionText = hasDescription ? instance.findText('Switch description') : undefined
const description =
  descriptionText && descriptionText.type === 'TEXT' ? descriptionText.textContent.trim() : ''

const helperLayer = disabled ? instance.findInstance('HelperText') : undefined
const helperText =
  helperLayer && helperLayer.type === 'INSTANCE' ? helperLayer.findText('label') : undefined
const helper = helperText && helperText.type === 'TEXT' ? helperText.textContent.trim() : ''

export default {
  example: figma.code`<FieldCheckbox
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
  imports: ["import FieldCheckbox from '@aziontech/webkit/field-checkbox'"],
  id: 'field-checkbox',
  metadata: { nestable: true }
}
