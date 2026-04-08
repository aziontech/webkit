// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Components---Global-Tokens?node-id=2027-3060
// source=packages/webkit/src/core/form/field-text-privacy/field-text-privacy.vue
// component=FieldTextPrivacy
const figma = require('figma')
const instance = figma.selectedInstance

const disabled = instance.getBoolean('isDisabled', {
  True: true,
  False: false,
})

export default {
  example: figma.code`
<FieldTextPrivacy
  name="fieldName"
  label="Label"
  placeholder="Enter value..."
  description="Toggle to make this field public or private"
  :isPublic="false"
  ${disabled ? ':disabled="true"' : ''}
/>
`,
  imports: ['import FieldTextPrivacy from "@aziontech/webkit/field-text-privacy"'],
  id: 'field-text-privacy',
  metadata: { nestable: false },
}
