// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2027-7554
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/inputs/field-radio/field-radio.vue
// component=FieldRadio
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

const helperText = disabled ? instance.findText('label') : undefined
const helper = helperText && helperText.type === 'TEXT' ? helperText.textContent.trim() : ''

export default {
  example: figma.code`<FieldRadio
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
  imports: ["import FieldRadio from '@aziontech/webkit/field-radio'"],
  id: 'field-radio',
  metadata: { nestable: true }
}
