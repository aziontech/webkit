// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=602-890
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/inputs/field-textarea/field-textarea.vue
// component=FieldTextarea
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

const labelLayer = instance.findInstance('InputLabel')
const labelText = labelLayer.type === 'INSTANCE' ? labelLayer.findText('label') : undefined
const label = labelText && labelText.type === 'TEXT' ? labelText.textContent.trim() : ''

const helperLayer = instance.findInstance('HelperText')
const helperText = helperLayer.type === 'INSTANCE' ? helperLayer.findText('label') : undefined
const helper = helperText && helperText.type === 'TEXT' ? helperText.textContent.trim() : ''

const input = instance.findInstance('InputTextArea')
const placeholder = input.type === 'INSTANCE' ? input.getString('placeholder') : ''

export default {
  example: figma.code`<FieldTextarea
  v-model="value"${
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
  imports: ["import FieldTextarea from '@aziontech/webkit/field-textarea'"],
  id: 'field-textarea',
  metadata: { nestable: true }
}
