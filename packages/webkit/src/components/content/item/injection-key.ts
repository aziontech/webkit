import type { InjectionKey } from 'vue'

export type ItemKind = 'default' | 'outline' | 'muted' | 'inline'
export type ItemSize = 'small' | 'medium'

export interface ItemContext {
  testId: string
  kind: ItemKind
  size: ItemSize
}

export const ItemInjectionKey: InjectionKey<ItemContext> = Symbol('ItemContext')

/**
 * Provided by list containers (ItemGroup, ItemList) to force every descendant Item to a single
 * `kind`, avoiding a box-in-box effect. ItemGroup forces `inline` (borderless, no padding);
 * ItemList forces `default` (padded rows, transparent surface, no per-item border).
 */
export interface ItemContainerContext {
  forceKind: ItemKind
}

export const ItemContainerInjectionKey: InjectionKey<ItemContainerContext> =
  Symbol('ItemContainerContext')
