import type { ComputedRef, InjectionKey } from 'vue'

export interface ProductWidgetContext {
  /** Whether the widget draws the named collaborator cursor that acts its beat. */
  cursor: ComputedRef<boolean>
}

export const ProductWidgetInjectionKey: InjectionKey<ProductWidgetContext> = Symbol('ProductWidget')
