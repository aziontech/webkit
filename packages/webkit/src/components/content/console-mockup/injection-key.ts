import type { ComputedRef, InjectionKey } from 'vue'

export interface ConsoleMockupContext {
  /** Whether the widget draws the named collaborator cursor that acts its beat. */
  cursor: ComputedRef<boolean>
}

export const ConsoleMockupInjectionKey: InjectionKey<ConsoleMockupContext> = Symbol('ConsoleMockup')
