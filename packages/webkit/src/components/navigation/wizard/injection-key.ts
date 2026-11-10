import type { ComputedRef, InjectionKey } from 'vue'

export interface WizardStepMeta {
  /** Reads the step's current title. */
  title: () => string
  /** Reads whether the step is marked optional. */
  optional: () => boolean
}

export interface WizardStepRecord {
  /** Registration identity of the step. */
  id: symbol
  /** What the step decides, shown in the rail. */
  title: string
  /** Whether the step is marked optional. */
  optional: boolean
}

export interface WizardStepHandle {
  /** Zero-based position in document order. */
  index: ComputedRef<number>
  /** True while this step is the one on screen. */
  active: ComputedRef<boolean>
}

export interface WizardContext {
  /** The registered steps, ordered by document position. */
  steps: ComputedRef<readonly WizardStepRecord[]>
  /** Zero-based index of the step on screen, clamped to the registered range. */
  activeStep: ComputedRef<number>
  /** How many steps are registered. */
  total: ComputedRef<number>
  /** Mirrors the root's loading prop. */
  loading: ComputedRef<boolean>
  /** Registers a step and returns its reactive handle. */
  register: (id: symbol, meta: WizardStepMeta) => WizardStepHandle
  /** Hands the step's root element over once mounted, so order is read from the DOM. */
  attach: (id: symbol, el: globalThis.HTMLElement | null) => void
  /** Removes a previously registered step; called by the step on unmount. */
  unregister: (id: symbol) => void
}

export const WizardInjectionKey: InjectionKey<WizardContext> = Symbol('Wizard')
