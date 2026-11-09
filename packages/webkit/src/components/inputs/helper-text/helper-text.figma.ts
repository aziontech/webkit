// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=600-5603
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/inputs/helper-text/helper-text.vue
// component=HelperText
import figma from 'figma'

const instance = figma.selectedInstance

const kind = instance.getEnum('kind', {
  helper: 'helper',
  invalid: 'invalid',
  disabled: 'disabled',
  required: 'required'
})
const labelText = instance.findText('label')
const label = labelText.type === 'TEXT' ? labelText.textContent.trim() : ''

export default {
  example: figma.code`<HelperText label="${label}"${kind === 'helper' ? '' : figma.code` kind="${kind}"`} />`,
  imports: ["import HelperText from '@aziontech/webkit/helper-text'"],
  id: 'helper-text',
  metadata: { nestable: true }
}
