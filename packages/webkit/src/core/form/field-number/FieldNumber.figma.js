// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Components---Global-Tokens?node-id=602-599
// source=packages/webkit/src/core/form/field-number/field-number.vue
// component=FieldNumber
const figma = require('figma')
const instance = figma.selectedInstance

const disabled = instance.getBoolean('isDisabled', {
  True: true,
  False: false,
})

export default {
  example: figma.code`
<FieldNumber
  name="fieldName"
  label="Label"
  placeholder="0"
  description="Helper text"
  ${disabled ? ':disabled="true"' : ''}
/>
`,
  imports: ['import FieldNumber from "@aziontech/webkit/field-number"'],
  id: 'field-number',
  metadata: { nestable: false },
}
