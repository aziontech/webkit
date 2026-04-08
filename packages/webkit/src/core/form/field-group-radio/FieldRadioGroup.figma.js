// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Components---Global-Tokens?node-id=2027-9165
// source=packages/webkit/src/core/form/field-group-radio/field-group-radio.vue
// component=FieldGroupRadio
const figma = require('figma')

export default {
  example: figma.code`
<FieldGroupRadio
  label="Select one option"
  helpText="Choose exactly one"
  :options="[
    { title: 'Option A', value: 'a', name: 'radioOpt' },
    { title: 'Option B', value: 'b', name: 'radioOpt' },
    { title: 'Option C', value: 'c', name: 'radioOpt' },
  ]"
/>
`,
  imports: ['import FieldGroupRadio from "@aziontech/webkit/field-group-radio"'],
  id: 'field-group-radio',
  metadata: { nestable: false },
}
