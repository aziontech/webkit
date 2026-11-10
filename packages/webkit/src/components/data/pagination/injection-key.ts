import type { InjectionKey } from 'vue'

export interface PaginationContext {
  /** Root data-testid; sub-components derive BEM-suffixed ids from it. */
  testId: string
}

export const PaginationInjectionKey: InjectionKey<PaginationContext> = Symbol('PaginationContext')
