import DropdownMenuRoot from './dropdown-menu.vue'
import DropdownMenuGroup from './dropdown-menu-group/dropdown-menu-group.vue'
import DropdownMenuOption from './dropdown-menu-option/dropdown-menu-option.vue'
import DropdownMenuTrigger from './dropdown-menu-trigger/dropdown-menu-trigger.vue'

interface DropdownMenuStatic {
  Trigger: typeof DropdownMenuTrigger
  Group: typeof DropdownMenuGroup
  Item: typeof DropdownMenuOption
  /** @deprecated since 6.0 — use DropdownMenu.Item. Removed in 7.0. */
  Option: typeof DropdownMenuOption
}

const DropdownMenu = DropdownMenuRoot as typeof DropdownMenuRoot & DropdownMenuStatic
DropdownMenu.Trigger = DropdownMenuTrigger
DropdownMenu.Group = DropdownMenuGroup
DropdownMenu.Item = DropdownMenuOption
DropdownMenu.Option = DropdownMenuOption

export default DropdownMenu
export {
  DropdownMenuGroup,
  DropdownMenuOption as DropdownMenuItem,
  DropdownMenuOption,
  DropdownMenuTrigger
}
export type {
  DropdownMenuOptionValue,
  DropdownMenuPlacement,
  DropdownMenuPlacementInput
} from './dropdown-menu.vue'
