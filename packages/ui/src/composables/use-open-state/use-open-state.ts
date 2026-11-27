import { computed, type ComputedRef, type MaybeRefOrGetter, type Ref, toValue } from 'vue'

import { useControllable } from '../use-controllable'

export interface UseOpenStateOptions {
  defaultOpen: boolean
  disabled: MaybeRefOrGetter<boolean>
}

export interface UseOpenStateReturn {
  isOpen: ComputedRef<boolean>
  setOpen: (value: boolean) => void
}

export function useOpenState(
  model: Ref<boolean | undefined>,
  { defaultOpen, disabled }: UseOpenStateOptions
): UseOpenStateReturn {
  const state = useControllable<boolean>({
    prop: model,
    defaultProp: defaultOpen,
    onChange: (value) => {
      model.value = value
    }
  })

  const setOpen = (value: boolean) => {
    if (value && toValue(disabled)) return
    state.set(value)
  }

  return { isOpen: computed(() => state.value), setOpen }
}
