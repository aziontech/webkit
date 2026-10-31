// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=476-948
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/inputs/chip/chip.vue
// component=Chip
import figma from 'figma'

const instance = figma.selectedInstance

const label = instance.getString('label')
const size = instance.getEnum('size', {
  medium: 'medium',
  small: 'small'
})
const removable = instance.getEnum('removable', {
  false: false,
  true: true
})
const clickable = instance.getEnum('clickable', {
  false: false,
  true: true
})

export default {
  example: figma.code`<Chip label="${label}"${size === 'medium' ? '' : figma.code` size="${size}"`}${removable ? figma.code` removable` : ''}${clickable ? figma.code` clickable` : ''} />`,
  imports: ["import Chip from '@aziontech/webkit/chip'"],
  id: 'chip',
  metadata: { nestable: true }
}
