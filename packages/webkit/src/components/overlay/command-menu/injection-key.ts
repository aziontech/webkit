import { inject, type InjectionKey, type Ref } from 'vue'

/** Identifier a Command Menu item carries and emits on activation. */
export type CommandMenuItemValue = string | number

/** Shape a `<CommandMenu.Item>` registers with the root so it can be filtered and navigated. */
export interface CommandMenuRegisteredItem {
  /** The item's identifier, emitted on `select`. */
  value: CommandMenuItemValue
  /** The group this item belongs to, or `null` when ungrouped. */
  groupId: string | null
  /** Whether the item is disabled (skipped by roving navigation). */
  disabled: Ref<boolean>
  /** Whether the item currently passes the substring filter. */
  isVisible: Ref<boolean>
  /** Activates the item, emitting the root `select` event. */
  activate: (event: globalThis.MouseEvent | globalThis.KeyboardEvent) => void
}

export interface CommandMenuContext {
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
  select: (
    event: globalThis.MouseEvent | globalThis.KeyboardEvent,
    value: CommandMenuItemValue
  ) => void
  /** Registers an item with the root; returns an unregister function. */
  registerItem: (item: CommandMenuRegisteredItem) => () => void
  /** The value of the currently active (roving-highlighted) item, or `null`. */
  activeValue: Ref<CommandMenuItemValue | null>
  /** Sets the active item value. */
  setActive: (value: CommandMenuItemValue | null) => void
  /** Whether the given value is the active item. */
  isActive: (value: CommandMenuItemValue) => boolean
  /** Whether any registered item currently passes the filter. */
  hasVisibleItems: Ref<boolean>
  /** Whether the given group has at least one visible item. */
  groupHasVisibleItems: (groupId: string) => boolean
  /** Keyboard handler for the input — Arrow/Home/End roving nav + Enter activation. */
  onInputKeydown: (event: globalThis.KeyboardEvent) => void
}

export const CommandMenuInjectionKey: InjectionKey<CommandMenuContext> =
  Symbol('CommandMenuContext')

/** Group id provided to descendant items so they can report group membership. */
export const CommandMenuGroupIdKey: InjectionKey<string | null> = Symbol('CommandMenuGroupId')

/**
 * Consumes the Command Menu context, throwing when used outside `<CommandMenu>`.
 * Narrows the type to `CommandMenuContext` for the calling sub-component.
 */
export function useCommandMenuContext(): CommandMenuContext {
  const ctx = inject(CommandMenuInjectionKey)
  if (!ctx) {
    throw new Error('CommandMenu.* sub-components must be used inside <CommandMenu>.')
  }
  return ctx
}
