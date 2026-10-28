// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3374-6288
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/navigation/breadcrumb-item/breadcrumb-item.vue
// component=BreadcrumbItem
import figma from 'figma'

const instance = figma.selectedInstance

const label = instance.getString('label')
const showIcon = instance.getBoolean('showIcon')
const current = instance.getEnum('current', {
  false: false,
  true: true
})

export default {
  example: figma.code`<BreadcrumbItem${label === 'Page Name' ? '' : figma.code` label="${label}"`}${current ? ' current' : ''}${showIcon ? ' show-icon' : ''} />`,
  imports: ["import BreadcrumbItem from '@aziontech/webkit/breadcrumb-item'"],
  id: 'breadcrumb-item',
  metadata: { nestable: true }
}
