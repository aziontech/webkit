import type { ComputedRef, InjectionKey } from 'vue'

/**
 * What a registered step reads back from its DocSteps provider.
 *
 * There is deliberately no "last" flag here. Whether a step is the final one is a
 * question about DOM order, and a count that grows while the parent is still
 * rendering answers it wrong: each step would read the count as it stood at its own
 * setup. The connector and the trailing space are suppressed by a last-child CSS
 * variant instead, which is correct by construction and needs no state.
 */
export interface DocStepHandle {
  /** 1-based position in document order; reactive to steps mounting and unmounting. */
  index: ComputedRef<number>
}

export interface DocStepsContext {
  /** Registers a step in document order and returns its reactive handle. */
  register: (id: symbol) => DocStepHandle
  /** Removes a previously registered step; called by the step on unmount. */
  unregister: (id: symbol) => void
}

export const DocStepsInjectionKey: InjectionKey<DocStepsContext> = Symbol('DocSteps')
