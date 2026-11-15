import type { ComputedRef, InjectionKey } from 'vue'

export type TransferListItems = unknown[]
export type TransferListValue = [TransferListItems, TransferListItems]
export type TransferListSide = 'source' | 'target'
export type MoveDirection = 'to-target' | 'to-source'

export interface TransferListContext {
  /** Item field that uniquely identifies a record (`trackBy`); enables stable keys. */
  trackBy: ComputedRef<string>
  /** Whether the whole control is disabled. */
  disabled: ComputedRef<boolean>
  /** True while either list is loading (locks the move controls). */
  anyLoading: ComputedRef<boolean>
  /** Current items of a list. */
  items: (side: TransferListSide) => TransferListItems
  /** Number of items in a list. */
  count: (side: TransferListSide) => number
  /** Stable key for an item at an index. */
  itemKey: (item: unknown, index: number) => string | number
  /** Whether the option at `index` in `side` is selected. */
  isSelected: (side: TransferListSide, index: number) => boolean
  /** Toggles the selection of the option at `index` in `side`. */
  toggleSelection: (side: TransferListSide, index: number) => void
  /** Selects or clears the option at `index` in `side`. */
  setSelected: (side: TransferListSide, index: number, value: boolean) => void
  /** Whether `side` has at least one selected option. */
  hasSelection: (side: TransferListSide) => boolean
  /** Moves the current selection of the originating list across. */
  move: (direction: MoveDirection) => void
  /** Moves every item of the originating list across. */
  moveAll: (direction: MoveDirection) => void
  /** Handles a double-click on the option at `index` in `side`: emits `item-double-click` and, unless cancelled, moves that item to the opposite list. */
  itemDoubleClick: (event: MouseEvent, side: TransferListSide, index: number) => void
  /** Reads the loading flag a list reported. */
  isLoading: (side: TransferListSide) => boolean
  /** A list reports its own loading flag so the controls can lock. */
  setLoading: (side: TransferListSide, value: boolean) => void
}

export const transferListContextKey: InjectionKey<TransferListContext> =
  Symbol('TransferListContext')
