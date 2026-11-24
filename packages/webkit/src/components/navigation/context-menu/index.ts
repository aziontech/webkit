import DropdownMenuGroup from '../dropdown-menu/dropdown-menu-group/dropdown-menu-group.vue'
import DropdownMenuItem from '../dropdown-menu/dropdown-menu-item/dropdown-menu-item.vue'
import DropdownMenuSub from '../dropdown-menu/dropdown-menu-sub/dropdown-menu-sub.vue'
import DropdownMenuSubContent from '../dropdown-menu/dropdown-menu-sub-content/dropdown-menu-sub-content.vue'
import DropdownMenuSubTrigger from '../dropdown-menu/dropdown-menu-sub-trigger/dropdown-menu-sub-trigger.vue'
import ContextMenuRoot from './context-menu.vue'
import ContextMenuTrigger from './context-menu-trigger/context-menu-trigger.vue'

interface ContextMenuStatic {
  Trigger: typeof ContextMenuTrigger
  Group: typeof DropdownMenuGroup
  Item: typeof DropdownMenuItem
  Sub: typeof DropdownMenuSub
  SubTrigger: typeof DropdownMenuSubTrigger
  SubContent: typeof DropdownMenuSubContent
}

const ContextMenu = ContextMenuRoot as typeof ContextMenuRoot & ContextMenuStatic
ContextMenu.Trigger = ContextMenuTrigger
ContextMenu.Group = DropdownMenuGroup
ContextMenu.Item = DropdownMenuItem
ContextMenu.Sub = DropdownMenuSub
ContextMenu.SubTrigger = DropdownMenuSubTrigger
ContextMenu.SubContent = DropdownMenuSubContent

export default ContextMenu
export { ContextMenuTrigger }
export type {
  DropdownMenuItemSeverity,
  DropdownMenuItemType,
  DropdownMenuItemValue
} from './context-menu.vue'
export type { ContextMenuProps } from './context-menu.vue'
