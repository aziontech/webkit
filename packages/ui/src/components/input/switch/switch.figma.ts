// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2027-1247
// source=https://github.com/aziontech/webkit/blob/main/packages/ui/src/components/input/switch/switch.vue
// component=Switch
import figma from 'figma'

const instance = figma.selectedInstance

const disabled = instance.getEnum('state', {
  default: false,
  hover: false,
  disabled: true
})
const variant = instance.getEnum('kind', {
  default: 'default',
  privacy: 'privacy'
})

export default {
  example: figma.code`<Switch v-model="enabled"${variant === 'default' ? '' : figma.code` variant="${variant}"`}${disabled ? figma.code` disabled` : ''} />`,
  imports: ["import Switch from '@aziontech/ui/switch'"],
  id: 'switch',
  metadata: { nestable: true }
}
