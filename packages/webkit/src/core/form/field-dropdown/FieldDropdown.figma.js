// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Components---Global-Tokens?node-id=602-814
// source=packages/webkit/src/core/form/field-dropdown/field-dropdown.vue
// component=FieldDropdown
const figma = require('figma')
const instance = figma.selectedInstance

const disabled = instance.getBoolean('isDisabled', {
  True: true,
  False: false,
})

export default {
  example: figma.code`
<FieldDropdown
  name="fieldName"
  label="Label"
  placeholder="Select an option..."
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
  imports: ['import FieldDropdown from "@aziontech/webkit/field-dropdown"'],
  id: 'field-dropdown',
  metadata: { nestable: false },
}
