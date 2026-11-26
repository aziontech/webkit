import { type InjectionKey, type Ref } from 'vue'

/** Identifier a Command Menu item carries and emits on activation. */
export type CommandItemValue = string | number

/** Shape a `<Command.Item>` registers with the root so it can be filtered and navigated. */
export interface CommandRegisteredItem {
  /** The item's identifier, emitted on `select`. */
  value: CommandItemValue
  /** The item element's id, referenced by the input's `aria-activedescendant`. */
  id: string
  /** The group this item belongs to, or `null` when ungrouped. */
  groupId: string | null
  /** Whether the item is disabled (skipped by roving navigation). */
  disabled: Ref<boolean>
  /** Whether the item currently passes the substring filter. */
  isVisible: Ref<boolean>
  /** Whether the item matches the query on its page, before any hint-only cap. */
  matched: Ref<boolean>
  /** Whether the item matches the query only through its value or keywords, not its label. */
  hint: Ref<boolean>
  /** The item's root element, so the root can rove in DOM order rather than registration
   *  order (a group mounted after the palette opened registers last but renders where the
   *  consumer put it). `null` only in the tick before it mounts. */
  el: Ref<HTMLElement | null>
  /** Rank while the query is not empty: a CSS `order` value, lower ranks first (0 when not ranked). */
  order: Ref<number>
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
  /** The element id of the active item, for the input's `aria-activedescendant`. */
  activeId: Readonly<Ref<string | undefined>>
  /** Sets the active item value. */
  setActive: (value: CommandItemValue | null) => void
  /** Whether the given value is the active item. */
  isActive: (value: CommandItemValue) => boolean
  /** Whether any registered item currently passes the filter. */
  hasVisibleItems: Ref<boolean>
  /** Whether the given group has at least one visible item. */
  groupHasVisibleItems: (groupId: string) => boolean
  /** Whether a hint-only match is hidden because its group already shows enough of them. */
  isCapped: (itemId: string) => boolean
  /** Whether the query is not empty, so the list shows items in ranked order. */
  ranking: Ref<boolean>
  /** The CSS `order` of a group: the order of its best visible item. */
  groupOrder: (groupId: string) => number
  /** The group ranked first while searching, or `null`. */
  leadingGroupId: Ref<string | null>
  /** The current page name; `''` is the first page. */
  page: Ref<string>
  /** The heading of the current page, for the back control. */
  pageHeading: Ref<string>
  /** Opens a nested page, remembering the current one. */
  pushPage: (name: string) => void
  /** Returns to the previous page; `false` when already on the first page. */
  popPage: () => boolean
  /** Registers a page heading with the root; returns an unregister function. */
  registerPage: (name: string, heading: Ref<string>) => () => void
  /** Keyboard handler for the input — Arrow/Home/End roving nav + Enter activation. */
  onInputKeydown: (event: globalThis.KeyboardEvent) => void
}

export const CommandInjectionKey: InjectionKey<CommandContext> = Symbol('Command')

export const CommandGroupInjectionKey: InjectionKey<string | null> = Symbol('CommandGroup')

export const CommandPageInjectionKey: InjectionKey<string> = Symbol('CommandPage')
