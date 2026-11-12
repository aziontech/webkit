import CommandRoot from './command.vue'
import CommandEmpty from './command-empty/command-empty.vue'
import CommandGroup from './command-group/command-group.vue'
import CommandInput from './command-input/command-input.vue'
import CommandItem from './command-item/command-item.vue'
import CommandList from './command-list/command-list.vue'
import CommandSeparator from './command-separator/command-separator.vue'

interface CommandStatic {
  Input: typeof CommandInput
  List: typeof CommandList
  Group: typeof CommandGroup
  Item: typeof CommandItem
  Empty: typeof CommandEmpty
  Separator: typeof CommandSeparator
}

const Command = CommandRoot as typeof CommandRoot & CommandStatic
Command.Input = CommandInput
Command.List = CommandList
Command.Group = CommandGroup
Command.Item = CommandItem
Command.Empty = CommandEmpty
Command.Separator = CommandSeparator

export default Command
export { CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator }
export type { CommandItemValue } from './injection-key'
