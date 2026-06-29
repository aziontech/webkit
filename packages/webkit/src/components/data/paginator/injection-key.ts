import type { InjectionKey } from 'vue'

export interface PaginatorContext {
  /** Root data-testid; sub-components derive BEM-suffixed ids from it. */
  testId: string
}

export const PaginatorInjectionKey: InjectionKey<PaginatorContext> = Symbol('PaginatorContext')
