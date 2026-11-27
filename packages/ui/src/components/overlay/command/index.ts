import CommandRoot from './command.vue'
import CommandEmpty from './command-empty/command-empty.vue'
import CommandGroup from './command-group/command-group.vue'
import CommandInput from './command-input/command-input.vue'
import CommandItem from './command-item/command-item.vue'
import CommandList from './command-list/command-list.vue'
import CommandPage from './command-page/command-page.vue'
import CommandSeparator from './command-separator/command-separator.vue'

interface CommandStatic {
  Input: typeof CommandInput
  List: typeof CommandList
  Group: typeof CommandGroup
  Item: typeof CommandItem
  Empty: typeof CommandEmpty
  Separator: typeof CommandSeparator
  Page: typeof CommandPage
}

const Command = CommandRoot as typeof CommandRoot & CommandStatic
Command.Input = CommandInput
Command.List = CommandList
Command.Group = CommandGroup
Command.Item = CommandItem
Command.Empty = CommandEmpty
Command.Separator = CommandSeparator
Command.Page = CommandPage

export default Command
export {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPage,
  CommandSeparator
}
export type { CommandProps } from './command.vue'
export type { CommandGroupProps } from './command-group/command-group.vue'
export type { CommandInputProps } from './command-input/command-input.vue'
export type { CommandItemProps } from './command-item/command-item.vue'
export type { CommandPageProps } from './command-page/command-page.vue'
export type { CommandItemValue } from './injection-key'
