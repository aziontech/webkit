import { computed, type ComputedRef, type MaybeRefOrGetter, type Ref, ref, toValue } from 'vue'

export interface UseControllableOptions<T> {
  prop: MaybeRefOrGetter<T | undefined>
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
    if (toValue(prop) === undefined) {
      internal.value = next
    }
    onChange(next)
  }

  const value = computed(() =>
    toValue(prop) !== undefined ? (toValue(prop) as T) : internal.value
  )

  return Object.assign(value, { set })
}
