// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=602-814
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/inputs/field-select/field-select.vue
// component=FieldSelect
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

const helperLayer = instance.findInstance('HelperText')
const helperText = helperLayer.type === 'INSTANCE' ? helperLayer.findText('label') : undefined
const helper =
  showHelper && helperText && helperText.type === 'TEXT' ? helperText.textContent.trim() : ''

const select = instance.findInstance('Select')
const placeholder = select.type === 'INSTANCE' ? select.getString('placeholder') : ''
const size =
  select.type === 'INSTANCE'
    ? select.getEnum('size', {
        small: 'small',
        medium: 'medium',
        large: 'large'
      })
    : 'medium'

export default {
  example: figma.code`<FieldSelect
  v-model="value"
  :options="options"${
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
    size && size !== 'medium'
      ? figma.code`
  size="${size}"`
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
  imports: ["import FieldSelect from '@aziontech/webkit/field-select'"],
  id: 'field-select',
  metadata: { nestable: true }
}
