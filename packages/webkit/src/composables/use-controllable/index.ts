import { computed, type ComputedRef, type Ref, ref } from 'vue'

export interface UseControllableOptions<T> {
  /** Controlled value from props (`undefined` when uncontrolled). */
  prop: Ref<T | undefined>
  /** Initial value when uncontrolled. */
  defaultProp: T
  /** Called when the value changes (controlled and uncontrolled). */
  onChange: (value: T) => void
}

/**
 * Controlled / uncontrolled state (shadcn pattern).
 * When `prop` is `undefined`, internal state is used.
 */
export function useControllable<T>({
  prop,
  defaultProp,
  onChange
}: UseControllableOptions<T>): ComputedRef<T> & { set: (value: T) => void } {
  const internal = ref(defaultProp) as Ref<T>

  const value = computed({
    get: () => (prop.value !== undefined ? prop.value : internal.value),
    set: (next: T) => {
      if (prop.value === undefined) {
        internal.value = next
      }
      onChange(next)
    }
  }) as ComputedRef<T> & { set: (value: T) => void }

  value.set = (next: T) => {
    value.value = next
  }

  return value
}
