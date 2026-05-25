import type { InjectionKey } from 'vue'

export type ItemKind = 'default' | 'outline' | 'muted'
export type ItemSize = 'small' | 'medium'

export interface ItemContext {
  testId: string
  kind: ItemKind
  size: ItemSize
}

export const ItemInjectionKey: InjectionKey<ItemContext> = Symbol('ItemContext')
