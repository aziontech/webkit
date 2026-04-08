// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Components---Global-Tokens?node-id=2042-5598
// source=packages/webkit/src/core/form/field-multi-select/field-multi-select.vue
// component=FieldMultiSelect
const figma = require('figma')
const instance = figma.selectedInstance

const disabled = instance.getBoolean('isDisabled', {
  True: true,
  False: false,
})

export default {
  example: figma.code`
<FieldMultiSelect
  name="fieldName"
  label="Label"
  placeholder="Select options..."
  description="Helper text"
  :options="[
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
  ]"
  optionLabel="label"
  optionValue="value"
  ${disabled ? ':disabled="true"' : ''}
/>
`,
  imports: ['import FieldMultiSelect from "@aziontech/webkit/field-multi-select"'],
  id: 'field-multi-select',
  metadata: { nestable: false },
}
