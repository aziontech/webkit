import type { ComputedRef, InjectionKey } from 'vue'

/** Scale of an illustration and of every part inside it. */
export type IllustrationSize = 'small' | 'medium' | 'large'

export interface IllustrationContext {
  /** Scene-level scale; a part inherits it unless it sets its own `size`. */
  size: ComputedRef<IllustrationSize>
  /** Scene-level emphasis; a part inherits it unless it sets its own `active`. */
  active: ComputedRef<boolean>
}

export const IllustrationInjectionKey: InjectionKey<IllustrationContext> =
  Symbol('IllustrationContext')
