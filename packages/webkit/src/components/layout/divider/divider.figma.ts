// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=479-886
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/layout/divider/divider.vue
// component=Divider
import figma from 'figma'

const instance = figma.selectedInstance

const orientation = instance.getEnum('orientation', {
  horizontal: 'horizontal',
  vertical: 'vertical'
})
const showContent = instance.getBoolean('showContent')
const label = instance.getString('label')

export default {
  example: figma.code`<Divider${orientation === 'horizontal' ? '' : figma.code` orientation="${orientation}"`}${showContent ? figma.code` label="${label}"` : ''} />`,
  imports: ["import Divider from '@aziontech/webkit/divider'"],
  id: 'divider',
  metadata: { nestable: true }
}
