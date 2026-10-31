// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2027-7582
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/inputs/field-radio-block/field-radio-block.vue
// component=FieldRadioBlock
import figma from 'figma'

const instance = figma.selectedInstance

const disabled = instance.getEnum('disabled', {
  false: false,
  true: true
})
const field = instance.findInstance('FieldRadio')
const hasDescription = field.type === 'INSTANCE' ? field.getBoolean('hasDescription') : false

const labelText = field.type === 'INSTANCE' ? field.findText('Switch label') : undefined
const label = labelText && labelText.type === 'TEXT' ? labelText.textContent.trim() : ''
const descriptionText =
  hasDescription && field.type === 'INSTANCE' ? field.findText('Switch description') : undefined
const description =
  descriptionText && descriptionText.type === 'TEXT' ? descriptionText.textContent.trim() : ''

const helperText = disabled && field.type === 'INSTANCE' ? field.findText('label') : undefined
const helper = helperText && helperText.type === 'TEXT' ? helperText.textContent.trim() : ''

export default {
  example: figma.code`<FieldRadioBlock
  v-model="selected"
  value="option"${
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
  imports: ["import FieldRadioBlock from '@aziontech/webkit/field-radio-block'"],
  id: 'field-radio-block',
  metadata: { nestable: true }
}
