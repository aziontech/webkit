// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=479-886
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/layout/separator/separator.vue
// component=Separator
import figma from 'figma'

const instance = figma.selectedInstance

const orientation = instance.getEnum('orientation', {
  horizontal: 'horizontal',
  vertical: 'vertical'
})
const showContent = instance.getBoolean('showContent')
const label = instance.getString('label')

export default {
  example: figma.code`<Separator${orientation === 'horizontal' ? '' : figma.code` orientation="${orientation}"`}${showContent ? figma.code` label="${label}"` : ''} />`,
  imports: ["import Separator from '@aziontech/webkit/separator'"],
  id: 'divider',
  metadata: { nestable: true }
}
