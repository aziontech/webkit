// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Components---Global-Tokens?node-id=2027-3212
// source=packages/webkit/src/core/form/field-password/field-password.vue
// component=FieldPassword
const figma = require('figma')
const instance = figma.selectedInstance

const disabled = instance.getBoolean('isDisabled', {
  True: true,
  False: false,
})

export default {
  example: figma.code`
<FieldPassword
  name="password"
  label="Password"
  placeholder="Enter password..."
  description="Must be at least 8 characters"
  ${disabled ? ':disabled="true"' : ''}
/>
`,
  imports: ['import FieldPassword from "@aziontech/webkit/field-password"'],
  id: 'field-password',
  metadata: { nestable: false },
}
