import type { ComputedRef, InjectionKey } from 'vue'

/** How each pair is laid out: the label over the value, or the label at the start and the value at the end of one row. */
export type KeyValueListVariant = 'stacked' | 'split'

export interface KeyValueListContext {
  /** The root's resolved data-testid; parts derive their own from it. */
  testId: ComputedRef<string>
  /** True while the root is loading; Items render a skeleton in place of their value. */
  loading: ComputedRef<boolean>
  /** The root's layout of each pair. */
  variant: ComputedRef<KeyValueListVariant>
}

export const KeyValueListInjectionKey: InjectionKey<KeyValueListContext> = Symbol('KeyValueList')
