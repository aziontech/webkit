import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { computed, inject, toValue } from 'vue'

import type { IllustrationSize } from '../injection-key'
import { IllustrationInjectionKey } from '../injection-key'

export interface IllustrationPartState {
  /** Resolved scale for this part. */
  size: ComputedRef<IllustrationSize>
  /** Resolved emphasis for this part. */
  active: ComputedRef<boolean>
}

/**
 * Resolve a part's scale and emphasis. The part's own prop wins, the scene context is
 * the default, and the fallbacks apply when the part is rendered on its own.
 *
 * Unlike most context composables this one does NOT throw outside its provider: every
 * part is exported standalone for tree-shaking, so a part must render correctly with
 * no root above it.
 */
export function useIllustrationContext(
  size: MaybeRefOrGetter<IllustrationSize | undefined>,
  active: MaybeRefOrGetter<boolean | undefined>,
  fallbackSize: IllustrationSize = 'medium'
): IllustrationPartState {
  const context = inject(IllustrationInjectionKey, null)

  return {
    size: computed(() => toValue(size) ?? context?.size.value ?? fallbackSize),
    active: computed(() => toValue(active) ?? context?.active.value ?? false)
  }
}
