import type { InjectionKey } from 'vue'

export type ItemVariant = 'default' | 'outline' | 'muted' | 'inline' | 'option'
export type ItemSize = 'small' | 'medium'

export interface ItemContext {
  testId: string
  variant: ItemVariant
  size: ItemSize
}

export const ItemInjectionKey: InjectionKey<ItemContext> = Symbol('Item')

/**
 * Provided by list containers (ItemGroup, ItemList) to force every descendant Item to a single
 * `variant`, avoiding a box-in-box effect. ItemGroup forces `inline` (borderless, no padding);
 * ItemList forces `default` (padded rows, transparent surface, no per-item border).
 */
export interface ItemContainerContext {
  forceVariant: ItemVariant
}

export const ItemContainerInjectionKey: InjectionKey<ItemContainerContext> = Symbol('ItemContainer')

export const ItemListMemberInjectionKey: InjectionKey<boolean> = Symbol('ItemListMember')
