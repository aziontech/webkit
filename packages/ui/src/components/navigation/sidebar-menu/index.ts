import SidebarMenuRoot from './sidebar-menu.vue'
import SidebarMenuBack from './sidebar-menu-back/sidebar-menu-back.vue'
import SidebarMenuGroup from './sidebar-menu-group/sidebar-menu-group.vue'
import SidebarMenuItem from './sidebar-menu-item/sidebar-menu-item.vue'
import SidebarMenuSub from './sidebar-menu-sub/sidebar-menu-sub.vue'
import SidebarMenuSubContent from './sidebar-menu-sub-content/sidebar-menu-sub-content.vue'
import SidebarMenuSubTrigger from './sidebar-menu-sub-trigger/sidebar-menu-sub-trigger.vue'

interface SidebarMenuStatic {
  Group: typeof SidebarMenuGroup
  Item: typeof SidebarMenuItem
  Sub: typeof SidebarMenuSub
  SubTrigger: typeof SidebarMenuSubTrigger
  SubContent: typeof SidebarMenuSubContent
  Back: typeof SidebarMenuBack
}

const SidebarMenu = SidebarMenuRoot as typeof SidebarMenuRoot & SidebarMenuStatic
SidebarMenu.Group = SidebarMenuGroup
SidebarMenu.Item = SidebarMenuItem
SidebarMenu.Sub = SidebarMenuSub
SidebarMenu.SubTrigger = SidebarMenuSubTrigger
SidebarMenu.SubContent = SidebarMenuSubContent
SidebarMenu.Back = SidebarMenuBack

export default SidebarMenu

export {
  SidebarMenuBack,
  SidebarMenuGroup,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubContent,
  SidebarMenuSubTrigger
}
export type {
  SidebarMenuGroupNode,
  SidebarMenuLevel,
  SidebarMenuNode,
  SidebarMenuSubType
} from './injection-key'
export type { SidebarMenuProps } from './sidebar-menu.vue'
export type { SidebarMenuBackProps } from './sidebar-menu-back/sidebar-menu-back.vue'
export type { SidebarMenuGroupProps } from './sidebar-menu-group/sidebar-menu-group.vue'
export type {
  SidebarMenuItemTagSeverity,
  SidebarMenuItemTagVariant
} from './sidebar-menu-item/sidebar-menu-item.vue'
export type { SidebarMenuItemProps } from './sidebar-menu-item/sidebar-menu-item.vue'
export type { SidebarMenuSubProps } from './sidebar-menu-sub/sidebar-menu-sub.vue'
export type { SidebarMenuSubTriggerProps } from './sidebar-menu-sub-trigger/sidebar-menu-sub-trigger.vue'
