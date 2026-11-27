import { computed, type ComputedRef, onBeforeUnmount, type Ref } from 'vue'

/** The part of a dialog-like overlay's context that its trigger reads. */
export interface DialogTriggerContext {
  isOpen: Readonly<Ref<boolean>>
  open: () => void
  triggerEl: Ref<HTMLElement | null>
}

/** What `useDialogTrigger` returns. */
export interface UseDialogTriggerReturn {
  /** ARIA attributes of the control that opens the overlay. */
  aria: ComputedRef<Record<string, string>>
  /** Opens the overlay. */
  activate: () => void
  /** Opens the overlay on Enter or Space pressed on the control itself. */
  onKeydown: (event: globalThis.KeyboardEvent) => void
  /** Records the control, so focus returns to it when the overlay closes. */
  onControl: (el: globalThis.HTMLElement | null) => void
}

export function useDialogTrigger(
  overlay: DialogTriggerContext | undefined
): UseDialogTriggerReturn {
  const aria = computed(() => ({
    'aria-haspopup': 'dialog',
    'aria-expanded': String(Boolean(overlay?.isOpen.value))
  }))

  const activate = () => {
    overlay?.open()
  }

  function onKeydown(event: globalThis.KeyboardEvent) {
    if (event.target !== event.currentTarget) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      activate()
    }
  }

  function onControl(el: globalThis.HTMLElement | null) {
    if (overlay) overlay.triggerEl.value = el
  }

  onBeforeUnmount(() => {
    if (overlay) overlay.triggerEl.value = null
  })

  return { aria, activate, onKeydown, onControl }
}
