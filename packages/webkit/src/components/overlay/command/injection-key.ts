import { inject, type InjectionKey, type Ref } from 'vue'

/** Identifier a Command Menu item carries and emits on activation. */
export type CommandItemValue = string | number

/** Shape a `<Command.Item>` registers with the root so it can be filtered and navigated. */
export interface CommandRegisteredItem {
  /** The item's identifier, emitted on `select`. */
  value: CommandItemValue
  /** The group this item belongs to, or `null` when ungrouped. */
  groupId: string | null
  /** Whether the item is disabled (skipped by roving navigation). */
  disabled: Ref<boolean>
  /** Whether the item currently passes the substring filter. */
  isVisible: Ref<boolean>
  /** The item's root element, so the root can rove in DOM order rather than registration
   *  order (a group mounted after the palette opened registers last but renders where the
   *  consumer put it). `null` only in the tick before it mounts. */
  el: Ref<HTMLElement | null>
  /** Activates the item, emitting the root `select` event. */
  activate: (event: globalThis.MouseEvent | globalThis.KeyboardEvent) => void
}

export interface CommandContext {
  /** Stable test-id prefix derived from the root component. */
  testId: string
  /** Current search query, exposed reactively to sub-components. */
  query: Ref<string>
  /** Updates the search query. */
  setQuery: (value: string) => void
  /** Current open state, exposed reactively to sub-components. */
  isOpen: Ref<boolean>
  /** Stable id wiring the input's `aria-controls` to the list's `id`. */
  listId: string
  /** Closes the palette. */
  close: () => void
  /** Activates a value — emits the root `select` event and closes the palette. */
  select: (event: globalThis.MouseEvent | globalThis.KeyboardEvent, value: CommandItemValue) => void
  /** Registers an item with the root; returns an unregister function. */
  registerItem: (item: CommandRegisteredItem) => () => void
  /** The value of the currently active (roving-highlighted) item, or `null`. */
  activeValue: Ref<CommandItemValue | null>
  /** Sets the active item value. */
  setActive: (value: CommandItemValue | null) => void
  /** Whether the given value is the active item. */
  isActive: (value: CommandItemValue) => boolean
  /** Whether any registered item currently passes the filter. */
  hasVisibleItems: Ref<boolean>
  /** Whether the given group has at least one visible item. */
  groupHasVisibleItems: (groupId: string) => boolean
  /** Keyboard handler for the input — Arrow/Home/End roving nav + Enter activation. */
  onInputKeydown: (event: globalThis.KeyboardEvent) => void
}

export const CommandInjectionKey: InjectionKey<CommandContext> = Symbol('CommandContext')

export const CommandGroupIdKey: InjectionKey<string | null> = Symbol('CommandGroupId')

export function useCommandMenuContext(): CommandContext {
  const ctx = inject(CommandInjectionKey)
  if (!ctx) {
    throw new Error('Command.* sub-components must be used inside <Command>.')
  }
  return ctx
}
