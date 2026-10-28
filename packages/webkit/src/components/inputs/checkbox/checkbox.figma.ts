// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2027-7311
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/inputs/checkbox/checkbox.vue
// component=Checkbox
import figma from 'figma'

const instance = figma.selectedInstance

const disabled = instance.getEnum('disabled', {
  false: false,
  true: true
})

export default {
  example: figma.code`<Checkbox v-model="checked" binary${disabled ? figma.code` disabled` : ''} />`,
  imports: ["import Checkbox from '@aziontech/webkit/checkbox'"],
  id: 'checkbox',
  metadata: { nestable: true }
}
