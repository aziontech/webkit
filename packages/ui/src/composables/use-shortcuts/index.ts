export type { ShortcutCombination } from './lib/keys'
export { matchesShortcut, parseShortcutKeys, shortcutKeyList, toAriaKeyshortcuts } from './lib/keys'
export { isTypingTarget } from './lib/typing-target'
export type {
  Shortcut,
  ShortcutListGroup,
  ShortcutListItem,
  ShortcutRegistry,
  ShortcutRegistryEntry,
  UseShortcutListReturn,
  UseShortcutsReturn
} from './use-shortcuts'
export {
  createShortcutRegistry,
  provideShortcuts,
  ShortcutsInjectionKey,
  useShortcutList,
  useShortcuts
} from './use-shortcuts'
