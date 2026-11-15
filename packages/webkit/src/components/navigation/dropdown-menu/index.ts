import DropdownMenuRoot from './dropdown-menu.vue'
import DropdownMenuGroup from './dropdown-menu-group/dropdown-menu-group.vue'
import DropdownMenuItem from './dropdown-menu-item/dropdown-menu-item.vue'
import DropdownMenuSub from './dropdown-menu-sub/dropdown-menu-sub.vue'
import DropdownMenuSubContent from './dropdown-menu-sub-content/dropdown-menu-sub-content.vue'
import DropdownMenuSubTrigger from './dropdown-menu-sub-trigger/dropdown-menu-sub-trigger.vue'
import DropdownMenuTrigger from './dropdown-menu-trigger/dropdown-menu-trigger.vue'

interface DropdownMenuStatic {
  Trigger: typeof DropdownMenuTrigger
  Group: typeof DropdownMenuGroup
  Item: typeof DropdownMenuItem
  Sub: typeof DropdownMenuSub
  SubTrigger: typeof DropdownMenuSubTrigger
  SubContent: typeof DropdownMenuSubContent
}

const DropdownMenu = DropdownMenuRoot as typeof DropdownMenuRoot & DropdownMenuStatic
DropdownMenu.Trigger = DropdownMenuTrigger
DropdownMenu.Group = DropdownMenuGroup
DropdownMenu.Item = DropdownMenuItem
DropdownMenu.Sub = DropdownMenuSub
DropdownMenu.SubTrigger = DropdownMenuSubTrigger
DropdownMenu.SubContent = DropdownMenuSubContent

export default DropdownMenu
export {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
}
export type {
  DropdownMenuItemType,
  DropdownMenuItemValue,
  DropdownMenuPlacement
} from './dropdown-menu.vue'
export type { DropdownMenuPlacementSide, DropdownMenuProps } from './dropdown-menu.vue'
export type { DropdownMenuGroupProps } from './dropdown-menu-group/dropdown-menu-group.vue'
export type { DropdownMenuItemProps } from './dropdown-menu-item/dropdown-menu-item.vue'
export type { DropdownMenuSubProps } from './dropdown-menu-sub/dropdown-menu-sub.vue'
export type { DropdownMenuSubTriggerProps } from './dropdown-menu-sub-trigger/dropdown-menu-sub-trigger.vue'
