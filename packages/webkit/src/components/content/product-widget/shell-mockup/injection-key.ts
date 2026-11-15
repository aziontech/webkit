import type { InjectionKey, Ref } from 'vue'

export interface ShellMockupContext {
  /** Whether the mockup's entrance has landed; parts travel in when it flips. */
  entered: Readonly<Ref<boolean>>
  /** Custom properties timing a part on the given beat: --part-duration and --part-delay. */
  beatStyle: (order: number) => Record<string, string>
}

export const SHELL_MOCKUP_KEY: InjectionKey<ShellMockupContext> = Symbol('ShellMockup')
