import CommandMenuRoot from './command-menu.vue'
import CommandMenuEmpty from './command-menu-empty/command-menu-empty.vue'
import CommandMenuGroup from './command-menu-group/command-menu-group.vue'
import CommandMenuInput from './command-menu-input/command-menu-input.vue'
import CommandMenuItem from './command-menu-item/command-menu-item.vue'
import CommandMenuList from './command-menu-list/command-menu-list.vue'
import CommandMenuSeparator from './command-menu-separator/command-menu-separator.vue'

interface CommandMenuStatic {
  Input: typeof CommandMenuInput
  List: typeof CommandMenuList
  Group: typeof CommandMenuGroup
  Item: typeof CommandMenuItem
  Empty: typeof CommandMenuEmpty
  Separator: typeof CommandMenuSeparator
}

const CommandMenu = CommandMenuRoot as typeof CommandMenuRoot & CommandMenuStatic
CommandMenu.Input = CommandMenuInput
CommandMenu.List = CommandMenuList
CommandMenu.Group = CommandMenuGroup
CommandMenu.Item = CommandMenuItem
CommandMenu.Empty = CommandMenuEmpty
CommandMenu.Separator = CommandMenuSeparator

export default CommandMenu
export {
  CommandMenuEmpty,
  CommandMenuGroup,
  CommandMenuInput,
  CommandMenuItem,
  CommandMenuList,
  CommandMenuSeparator
}
