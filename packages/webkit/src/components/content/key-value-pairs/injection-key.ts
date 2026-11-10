import type { ComputedRef, InjectionKey } from 'vue'

export interface KeyValuePairsContext {
  /** The root's resolved data-testid; parts derive their own from it. */
  testId: ComputedRef<string>
  /** True while the root is loading; Items render a skeleton in place of their value. */
  loading: ComputedRef<boolean>
}

export const KeyValuePairsInjectionKey: InjectionKey<KeyValuePairsContext> = Symbol('KeyValuePairs')
