// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2027-3395
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/inputs/field-input-group/field-input-group.vue
// component=FieldInputGroup
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

const group = instance.findInstance('InputGroup')
const showLeft = group.type === 'INSTANCE' ? group.getBoolean('showSlotLeft') : false
const showRight = group.type === 'INSTANCE' ? group.getBoolean('showSlotRight') : false
const left = group.type === 'INSTANCE' && showLeft ? group.getSlot('slotLeft') : undefined
const right = group.type === 'INSTANCE' && showRight ? group.getSlot('slotRight') : undefined
const input = group.type === 'INSTANCE' ? group.findInstance('InputText') : undefined
const placeholder = input && input.type === 'INSTANCE' ? input.getString('placeholder') : ''

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
  invalid
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
    showLeft || showRight
      ? figma.code`<FieldInputGroup
  ${attrs}
>${
          showLeft
            ? figma.code`
  <template #left>${left || ''}</template>`
            : ''
        }${
          showRight
            ? figma.code`
  <template #right>${right || ''}</template>`
            : ''
        }
</FieldInputGroup>`
      : figma.code`<FieldInputGroup
  ${attrs}
/>`,
  imports: ["import FieldInputGroup from '@aziontech/webkit/field-input-group'"],
  id: 'field-input-group',
  metadata: { nestable: true }
}
