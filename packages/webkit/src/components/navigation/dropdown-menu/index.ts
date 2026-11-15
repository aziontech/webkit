import DropdownMenuRoot from './dropdown-menu.vue'
import DropdownMenuGroup from './dropdown-menu-group/dropdown-menu-group.vue'
import DropdownMenuOption from './dropdown-menu-option/dropdown-menu-option.vue'
import DropdownMenuSub from './dropdown-menu-sub/dropdown-menu-sub.vue'
import DropdownMenuSubContent from './dropdown-menu-sub-content/dropdown-menu-sub-content.vue'
import DropdownMenuSubTrigger from './dropdown-menu-sub-trigger/dropdown-menu-sub-trigger.vue'
import DropdownMenuTrigger from './dropdown-menu-trigger/dropdown-menu-trigger.vue'

interface DropdownMenuStatic {
  Trigger: typeof DropdownMenuTrigger
  Group: typeof DropdownMenuGroup
  Item: typeof DropdownMenuOption
  Sub: typeof DropdownMenuSub
  SubTrigger: typeof DropdownMenuSubTrigger
  SubContent: typeof DropdownMenuSubContent
}

const DropdownMenu = DropdownMenuRoot as typeof DropdownMenuRoot & DropdownMenuStatic
DropdownMenu.Trigger = DropdownMenuTrigger
DropdownMenu.Group = DropdownMenuGroup
DropdownMenu.Item = DropdownMenuOption
DropdownMenu.Sub = DropdownMenuSub
DropdownMenu.SubTrigger = DropdownMenuSubTrigger
DropdownMenu.SubContent = DropdownMenuSubContent

export default DropdownMenu
export {
  DropdownMenuGroup,
  DropdownMenuOption as DropdownMenuItem,
  DropdownMenuOption,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
}
export type {
  DropdownMenuOptionKind,
  DropdownMenuOptionValue,
  DropdownMenuPlacement,
  DropdownMenuPlacementSide
} from './dropdown-menu.vue'
export type { DropdownMenuProps } from './dropdown-menu.vue'
export type { DropdownMenuGroupProps } from './dropdown-menu-group/dropdown-menu-group.vue'
export type { DropdownMenuOptionProps } from './dropdown-menu-option/dropdown-menu-option.vue'
export type { DropdownMenuSubProps } from './dropdown-menu-sub/dropdown-menu-sub.vue'
export type { DropdownMenuSubTriggerProps } from './dropdown-menu-sub-trigger/dropdown-menu-sub-trigger.vue'
