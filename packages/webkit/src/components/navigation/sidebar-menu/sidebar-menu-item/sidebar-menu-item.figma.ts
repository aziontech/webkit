// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3601-2693
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/navigation/sidebar-menu/sidebar-menu-item/sidebar-menu-item.vue
// component=SidebarMenuItem
import figma from 'figma'

const instance = figma.selectedInstance

const kind = instance.getEnum('kind', {
  option: 'option',
  group: 'group'
})
const selected = instance.getEnum('selected', {
  false: false,
  true: true
})
const showIcon = instance.getBoolean('showIcon')
const showTag = instance.getBoolean('showTag')

const labelLayer = instance.findText(kind === 'group' ? 'Label Group' : 'Option 1')
const label = labelLayer.type === 'TEXT' ? labelLayer.textContent : ''

const tag = showTag ? instance.findInstance('Tag') : null
const tagValue = tag && tag.type === 'INSTANCE' ? tag.getString('label') : ''

export default {
  example:
    kind === 'group'
      ? figma.code`<SidebarMenu.Group label="${label}" />`
      : figma.code`<SidebarMenu.Item${label === 'Option 1' ? '' : figma.code` label="${label}"`}${showIcon ? '' : ' icon=""'}${selected ? ' selected' : ''}${tagValue ? figma.code` tag-value="${tagValue}"` : ''} />`,
  imports: ["import SidebarMenu from '@aziontech/webkit/sidebar-menu'"],
  id: 'sidebar-menu-item',
  metadata: { nestable: true }
}
