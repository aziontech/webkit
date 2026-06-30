import type { ComputedRef, InjectionKey } from 'vue'

export type PickListItems = unknown[]
export type PickListValue = [PickListItems, PickListItems]
export type PickListSide = 'source' | 'target'
export type MoveDirection = 'to-target' | 'to-source'

export interface PickListContext {
  /** Item field that uniquely identifies a record; enables stable keys. */
  dataKey: ComputedRef<string>
  /** Whether the whole control is disabled. */
  disabled: ComputedRef<boolean>
  /** True while either list is loading (locks the move controls). */
  anyLoading: ComputedRef<boolean>
  /** Current items of a list. */
  items: (side: PickListSide) => PickListItems
  /** Number of items in a list. */
  count: (side: PickListSide) => number
  /** Stable key for an item at an index. */
  itemKey: (item: unknown, index: number) => string | number
  /** Whether the option at `index` in `side` is selected. */
  isSelected: (side: PickListSide, index: number) => boolean
  /** Toggles the selection of the option at `index` in `side`. */
  toggleSelection: (side: PickListSide, index: number) => void
  /** Whether `side` has at least one selected option. */
  hasSelection: (side: PickListSide) => boolean
  /** Moves the current selection of the originating list across. */
  move: (direction: MoveDirection) => void
  /** Moves every item of the originating list across. */
  moveAll: (direction: MoveDirection) => void
  /** Handles a double-click on the option at `index` in `side`: emits `item-double-click` and, unless cancelled, moves that item to the opposite list. */
  itemDoubleClick: (side: PickListSide, index: number) => void
  /** Reads the loading flag a list reported. */
  isLoading: (side: PickListSide) => boolean
  /** A list reports its own loading flag so the controls can lock. */
  setLoading: (side: PickListSide, value: boolean) => void
}

export const pickListContextKey: InjectionKey<PickListContext> = Symbol('PickListContext')
