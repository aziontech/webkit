import {
  type ComputedRef,
  type MaybeRefOrGetter,
  readonly,
  type Ref,
  ref,
  toValue,
  useId,
  watch
} from 'vue'

import { useOpenState } from '../use-open-state'

export interface UseModalRootOptions {
  /** Initial open state while the model is unbound. */
  defaultOpen: boolean
  /** Escape and overlay click close the overlay only while this is true. */
  dismissible: MaybeRefOrGetter<boolean>
}

export interface UseModalRootReturn {
  isOpen: ComputedRef<boolean>
  open: () => void
  close: () => void
  dismiss: () => void
  titleId: string
  descriptionId: string
  hasDescription: Readonly<Ref<boolean>>
  registerDescription: () => void
  unregisterDescription: () => void
  triggerEl: Ref<HTMLElement | null>
  returnFocusEl: Ref<HTMLElement | null>
}

export function useModalRoot(
  model: Ref<boolean | undefined>,
  { defaultOpen, dismissible }: UseModalRootOptions
): UseModalRootReturn {
  const uid = useId()
  const triggerEl = ref<HTMLElement | null>(null)
  const returnFocusEl = ref<HTMLElement | null>(null)
  const hasDescription = ref(false)
  const { isOpen, setOpen } = useOpenState(model, { defaultOpen, disabled: false })

  watch(
    () => isOpen.value,
    (open) => {
      if (open && typeof document !== 'undefined') {
        returnFocusEl.value = document.activeElement as HTMLElement | null
      }
    },
    { flush: 'sync' }
  )

  return {
    isOpen,
    open: () => setOpen(true),
    close: () => setOpen(false),
    dismiss: () => {
      if (toValue(dismissible)) setOpen(false)
    },
    titleId: `${uid}-title`,
    descriptionId: `${uid}-description`,
    hasDescription: readonly(hasDescription),
    registerDescription: () => {
      hasDescription.value = true
    },
    unregisterDescription: () => {
      hasDescription.value = false
    },
    triggerEl,
    returnFocusEl
  }
}
