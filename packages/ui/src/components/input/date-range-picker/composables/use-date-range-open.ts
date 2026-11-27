import { computed, type ComputedRef, nextTick, type Ref, watch } from 'vue'

export interface UseDateRangeOpenReturn {
  isOpen: ComputedRef<boolean>
  triggerEl: ComputedRef<HTMLElement | null>
  setOpen: (open: boolean) => void
  close: () => void
  onPopoverClose: (event: Event | null) => void
}

export function useDateRangeOpen(
  openModel: Ref<boolean | undefined>,
  props: { defaultOpen: boolean },
  disabled: ComputedRef<boolean>,
  controlEl: Ref<{ $el?: HTMLElement } | null>,
  onOpen: () => void
): UseDateRangeOpenReturn {
  const isOpen = computed<boolean>(() => openModel.value ?? props.defaultOpen)
  const triggerEl = computed<HTMLElement | null>(() => controlEl.value?.$el ?? null)
  const setOpen = (open: boolean): void => {
    if (open && disabled.value) return
    if (open === isOpen.value) return
    openModel.value = open
  }
  const close = (): void => {
    setOpen(false)
    nextTick(() =>
      triggerEl.value
        ?.querySelector<HTMLElement>('[data-slot="date-range-picker-trigger"]')
        ?.focus()
    )
  }

  watch(
    isOpen,
    (open) => {
      if (open) onOpen()
    },
    { immediate: true, flush: 'sync' }
  )
  watch(
    () => disabled.value,
    (off) => {
      if (off) setOpen(false)
    }
  )

  return {
    isOpen,
    triggerEl,
    setOpen,
    close,
    onPopoverClose: (event) => {
      if (event?.type === 'keydown') close()
      else setOpen(false)
    }
  }
}
