import DropdownMenuRoot from './dropdown-menu.vue'
import DropdownMenuContent from './dropdown-menu-content.vue'
import DropdownMenuFromModel from './dropdown-menu-from-model.vue'
import DropdownMenuGroup from './dropdown-menu-group.vue'
import DropdownMenuItem from './dropdown-menu-item.vue'
import DropdownMenuPortal from './dropdown-menu-portal.vue'
import DropdownMenuSeparator from './dropdown-menu-separator.vue'
import DropdownMenuTrigger from './dropdown-menu-trigger.vue'

const DropdownMenu = DropdownMenuRoot

DropdownMenu.Trigger = DropdownMenuTrigger
DropdownMenu.Portal = DropdownMenuPortal
DropdownMenu.Content = DropdownMenuContent
DropdownMenu.Group = DropdownMenuGroup
DropdownMenu.Item = DropdownMenuItem
DropdownMenu.Separator = DropdownMenuSeparator
DropdownMenu.FromModel = DropdownMenuFromModel

export default DropdownMenu
export {
  DropdownMenuContent,
  DropdownMenuFromModel,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger
}
