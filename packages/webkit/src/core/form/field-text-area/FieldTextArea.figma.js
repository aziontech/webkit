// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Components---Global-Tokens?node-id=602-890
// source=packages/webkit/src/core/form/field-text-area/field-text-area.vue
// component=FieldTextArea
const figma = require('figma')
const instance = figma.selectedInstance

const disabled = instance.getBoolean('isDisabled', {
  True: true,
  False: false,
})

export default {
  example: figma.code`
<FieldTextArea
  name="fieldName"
  label="Label"
  placeholder="Enter text..."
  description="Helper text"
  ${disabled ? ':disabled="true"' : ''}
/>
`,
  imports: ['import FieldTextArea from "@aziontech/webkit/field-text-area"'],
  id: 'field-text-area',
  metadata: { nestable: false },
}
