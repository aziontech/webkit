// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Components---Global-Tokens?node-id=2027-8985
// source=packages/webkit/src/core/form/field-group-checkbox/field-group-checkbox.vue
// component=FieldGroupCheckbox
const figma = require('figma')

export default {
  example: figma.code`
<FieldGroupCheckbox
  label="Select options"
  helpText="Choose one or more"
  :options="[
    { title: 'Option A', value: 'a', name: 'optA' },
    { title: 'Option B', value: 'b', name: 'optB' },
    { title: 'Option C', value: 'c', name: 'optC' },
  ]"
/>
`,
  imports: ['import FieldGroupCheckbox from "@aziontech/webkit/field-group-checkbox"'],
  id: 'field-group-checkbox',
  metadata: { nestable: false },
}
