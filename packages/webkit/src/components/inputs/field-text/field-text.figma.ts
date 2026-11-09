// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=536-22
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/inputs/field-text/field-text.vue
// component=FieldText
import figma from 'figma'

const instance = figma.selectedInstance

const state = instance.getEnum('state', {
  default: 'default',
  error: 'invalid',
  required: 'required'
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

const input = instance.findInstance('InputText')
const placeholder = input.type === 'INSTANCE' ? input.getString('placeholder') : ''
const iconLeft = input.type === 'INSTANCE' ? input.getBoolean('hasIconLeft') : false
const iconRight = input.type === 'INSTANCE' ? input.getBoolean('hasIconRight') : false

const attrs = figma.code`v-model="value"${
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
  disabled
    ? figma.code`
  disabled`
    : ''
}`

export default {
  example:
    iconLeft || iconRight
      ? figma.code`<FieldText
  ${attrs}
>${
          iconLeft
            ? figma.code`
  <template #iconLeft>
    <i class="pi pi-globe" />
  </template>`
            : ''
        }${
          iconRight
            ? figma.code`
  <template #iconRight>
    <i class="pi pi-search" />
  </template>`
            : ''
        }
</FieldText>`
      : figma.code`<FieldText
  ${attrs}
/>`,
  imports: ["import FieldText from '@aziontech/webkit/field-text'"],
  id: 'field-text',
  metadata: { nestable: true }
}
