import type { ComputedRef, InjectionKey, Ref } from 'vue'

export interface ConsoleMockupContext {
  /** Whether the widget draws the named collaborator cursor that acts its beat. */
  cursor: ComputedRef<boolean>
}

export const ConsoleMockupInjectionKey: InjectionKey<ConsoleMockupContext> = Symbol('ConsoleMockup')

export interface ConsoleMockupShellContext {
  /** Whether the mockup's entrance has landed; parts travel in when it flips. */
  entered: Readonly<Ref<boolean>>
  /** Custom properties timing a part on the given beat: --console-mockup-shell-item-duration and --console-mockup-shell-item-delay. */
  beatStyle: (order: number) => Record<string, string>
}

export const ConsoleMockupShellInjectionKey: InjectionKey<ConsoleMockupShellContext> =
  Symbol('ConsoleMockupShell')
