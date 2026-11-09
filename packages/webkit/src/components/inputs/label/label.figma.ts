// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=562-6660
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/inputs/label/label.vue
// component=Label
import figma from 'figma'

const instance = figma.selectedInstance

const required = instance.getEnum('required', {
  false: false,
  true: true
})
const labelText = instance.findText('label')
const label = labelText.type === 'TEXT' ? labelText.textContent.trim() : ''

export default {
  example: figma.code`<Label label="${label}"${required ? figma.code` required` : ''} />`,
  imports: ["import Label from '@aziontech/webkit/label'"],
  id: 'label',
  metadata: { nestable: true }
}
