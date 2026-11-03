// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3548-578
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/navigation/link/link.vue
// component=Link
import figma from 'figma'

const instance = figma.selectedInstance

const label = instance.getString('label')
const size = instance.getEnum('size', {
  large: 'large',
  medium: 'medium'
})
const showIcon = instance.getBoolean('showIcon')

export default {
  example: figma.code`<Link
  label="${label}"${
    size === 'large'
      ? ''
      : figma.code`
  size="${size}"`
  }${
    showIcon
      ? ''
      : figma.code`
  :show-icon="false"`
  }
  href="#"
/>`,
  imports: ["import Link from '@aziontech/webkit/link'"],
  id: 'link',
  metadata: { nestable: true }
}
