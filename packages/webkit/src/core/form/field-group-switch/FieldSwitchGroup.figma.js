// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Components---Global-Tokens?node-id=2027-9166
// source=packages/webkit/src/core/form/field-group-switch/field-group-switch.vue
// component=FieldGroupSwitch
const figma = require('figma')

export default {
  example: figma.code`
<FieldGroupSwitch
  label="Settings"
  helpText="Toggle each option on or off"
  :options="[
    { title: 'Enable feature A', value: false, name: 'featureA' },
    { title: 'Enable feature B', value: false, name: 'featureB' },
    { title: 'Enable feature C', value: false, name: 'featureC' },
  ]"
/>
`,
  imports: ['import FieldGroupSwitch from "@aziontech/webkit/field-group-switch"'],
  id: 'field-group-switch',
  metadata: { nestable: false },
}
