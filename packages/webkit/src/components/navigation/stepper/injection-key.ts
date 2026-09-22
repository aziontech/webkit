import type { ComputedRef, InjectionKey } from 'vue'

export interface StepperStepHandle {
  /** 1-based position in document order. */
  index: ComputedRef<number>
  /** True while this step is the last one in document order; the last renders no connector. */
  isLast: ComputedRef<boolean>
}

export interface StepperContext {
  /** The value of the step the reader is on, mirroring the root's v-model. */
  current: ComputedRef<string>
  /** Registers a step and returns its reactive handle. */
  register: (id: symbol) => StepperStepHandle
  /** Hands the step's root element over once mounted, so order is read from the DOM. */
  attach: (id: symbol, el: HTMLElement | null) => void
  /** Removes a previously registered step; called by the step on unmount. */
  unregister: (id: symbol) => void
  /** Moves the reader to a step by writing that step's value back to the root's v-model. */
  select: (value: string) => void
}

export const StepperInjectionKey: InjectionKey<StepperContext> = Symbol('Stepper')
