import type { ComputedRef, InjectionKey } from 'vue'

/** Layout axis of a RadioGroup. */
export type RadioGroupOrientation = 'vertical' | 'horizontal'

/** What RadioGroup hands to every RadioGroup.Item. */
export interface RadioGroupContext {
  /** Name shared by every radio of the group. */
  name: ComputedRef<string>
  /** The selected value. */
  value: ComputedRef<string | undefined>
  /** Whether the whole group is disabled. */
  disabled: ComputedRef<boolean>
  /** Root test id; items derive theirs from it. */
  testId: ComputedRef<string>
  /** Writes a value to the group. */
  select: (value: string) => void
}

export const RadioGroupInjectionKey: InjectionKey<RadioGroupContext> = Symbol('RadioGroup')
