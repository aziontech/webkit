// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Components---Global-Tokens?node-id=2027-3395
// source=packages/webkit/src/core/form/field-input-group/field-input-group.vue
// component=FieldInputGroup
const figma = require('figma')
const instance = figma.selectedInstance

const disabled = instance.getBoolean('isDisabled', {
  True: true,
  False: false,
})

export default {
  example: figma.code`
<FieldInputGroup
  name="fieldName"
  label="Label"
  placeholder="Enter value..."
  description="Helper text"
  ${disabled ? ':disabled="true"' : ''}
>
  <template #addon>px</template>
</FieldInputGroup>
`,
  imports: ['import FieldInputGroup from "@aziontech/webkit/field-input-group"'],
  id: 'field-input-group',
  metadata: { nestable: false },
}
