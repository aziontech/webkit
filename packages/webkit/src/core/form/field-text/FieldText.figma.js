// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Components---Global-Tokens?node-id=536-22
// source=packages/webkit/src/core/form/field-text/field-text.vue
// component=FieldText
const figma = require('figma')
const instance = figma.selectedInstance

const disabled = instance.getBoolean('isDisabled', {
  True: true,
  False: false,
})

export default {
  example: figma.code`
<FieldText
  name="fieldName"
  label="Label"
  placeholder="Enter value..."
  description="Helper text"
  ${disabled ? ':disabled="true"' : ''}
/>
`,
  imports: ['import FieldText from "@aziontech/webkit/field-text"'],
  id: 'field-text',
  metadata: { nestable: false },
}
