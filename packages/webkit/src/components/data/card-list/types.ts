/** How many cards can be selected. */
export type CardListSelectionMode = 'none' | 'single' | 'multi'

/** Scope of the header and default slots, typed from the items prop. */
export type CardListItemSlotProps<TItem> = {
  /** The item this card renders. */
  item: TItem
  /** Position of the item in items. */
  index: number
  /** Whether the card is selected. */
  selected: boolean
}
