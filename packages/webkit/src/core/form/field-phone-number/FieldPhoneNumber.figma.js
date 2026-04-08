// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Components---Global-Tokens?node-id=2048-5713
// source=packages/webkit/src/core/form/field-phone-number/field-phone-number.vue
// component=FieldPhoneNumber
const figma = require('figma')
const instance = figma.selectedInstance

const disabled = instance.getBoolean('isDisabled', {
  True: true,
  False: false,
})

export default {
  example: figma.code`
<FieldPhoneNumber
  name="phone"
  label="Phone Number"
  placeholder="+1 (555) 000-0000"
  description="Enter your phone number with country code"
  ${disabled ? ':disabled="true"' : ''}
/>
`,
  imports: ['import FieldPhoneNumber from "@aziontech/webkit/field-phone-number"'],
  id: 'field-phone-number',
  metadata: { nestable: false },
}
