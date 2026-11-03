import { computed, type ComputedRef, type Ref, ref, unref } from 'vue'

export interface UseControllableOptions<T> {
  prop: Ref<T | undefined> | ComputedRef<T | undefined>
  defaultProp: T
  onChange: (next: T) => void
}

export type UseControllableReturn<T> = ComputedRef<T> & { set: (next: T) => void }

export function useControllable<T>({
  prop,
  defaultProp,
  onChange
}: UseControllableOptions<T>): UseControllableReturn<T> {
  const internal = ref(defaultProp) as Ref<T>

  const set = (next: T) => {
    if (unref(prop) === undefined) {
      internal.value = next
    }
    onChange(next)
  }

  const value = computed(() => (unref(prop) !== undefined ? (unref(prop) as T) : internal.value))

  return Object.assign(value, { set })
}
