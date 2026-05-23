import { computed, type ComputedRef, type Ref, ref, unref } from 'vue'

export interface UseControllableOptions<T> {
  /** Controlled value from props (`undefined` when uncontrolled). */
  prop: Ref<T | undefined>
  /** Initial value when uncontrolled. */
  defaultProp: T
  /** Called when the value changes (controlled and uncontrolled). */
  onChange: (value: T) => void
}

export type ControllableRef<T> = ComputedRef<T> & {
  set: (value: T) => void
}

/**
 * Controlled / uncontrolled state (shadcn pattern).
 * When `prop` is `undefined`, internal state is used.
 */
export function useControllable<T>({
  prop,
  defaultProp,
  onChange
}: UseControllableOptions<T>): ControllableRef<T> {
  const internal = ref(defaultProp) as Ref<T>

  const set = (next: T) => {
    if (unref(prop) === undefined) {
      internal.value = next
    }
    onChange(next)
  }

  const value = computed(() => (unref(prop) !== undefined ? unref(prop)! : internal.value))

  return Object.assign(value, { set })
}
