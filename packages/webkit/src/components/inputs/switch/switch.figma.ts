// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2027-1247
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/inputs/switch/switch.vue
// component=Switch
import figma from 'figma'

const instance = figma.selectedInstance

const disabled = instance.getEnum('state', {
  default: false,
  hover: false,
  disabled: true
})
const kind = instance.getEnum('kind', {
  default: 'default',
  privacy: 'privacy'
})

export default {
  example: figma.code`<Switch v-model="enabled"${kind === 'default' ? '' : figma.code` kind="${kind}"`}${disabled ? figma.code` disabled` : ''} />`,
  imports: ["import Switch from '@aziontech/webkit/switch'"],
  id: 'switch',
  metadata: { nestable: true }
}
