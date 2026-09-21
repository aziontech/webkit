import type { ComputedRef, InjectionKey } from 'vue'

/**
 * Deliberately no "last" flag: a count that grows while the parent is still
 * rendering reads wrong at each step's own setup, so the connector and trailing
 * space are suppressed by a last-child CSS variant instead.
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
