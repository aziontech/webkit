import type { ComputedRef, InjectionKey } from 'vue'

/** How each pair is laid out: the label over the value, or the label at the start and the value at the end of one row. */
export type KeyValuePairsKind = 'stacked' | 'split'

export interface KeyValuePairsContext {
  /** The root's resolved data-testid; parts derive their own from it. */
  testId: ComputedRef<string>
  /** True while the root is loading; Items render a skeleton in place of their value. */
  loading: ComputedRef<boolean>
  /** The root's layout of each pair. */
  kind: ComputedRef<KeyValuePairsKind>
}

export const KeyValuePairsInjectionKey: InjectionKey<KeyValuePairsContext> = Symbol('KeyValuePairs')
