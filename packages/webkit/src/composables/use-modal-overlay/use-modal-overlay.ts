import { defaultDocument, useEventListener, useScrollLock } from '@vueuse/core'
import {
  computed,
  type ComputedRef,
  type MaybeRefOrGetter,
  nextTick,
  type Ref,
  toValue,
  watch
} from 'vue'

import { useFocusTrap } from '../use-focus-trap'
import { useOverlayLayer } from '../use-overlay-layer'
import { type OverlayMotionState, useOverlayPresence } from '../use-overlay-presence'

/** The part of a modal overlay's context that `useModalOverlay` reads. */
export interface ModalOverlayContext {
  isOpen: Readonly<Ref<boolean>>
  /** Escape and backdrop click close the overlay. */
  dismissible: boolean
  /** Light-dismiss path; closes only when dismissible. */
  dismiss: () => void
  triggerEl: Ref<HTMLElement | null>
  /** Element focused when the overlay opened; focus returns to it when there is no trigger. */
  returnFocusEl: Ref<HTMLElement | null>
}

/** Options of `useModalOverlay`. */
export interface UseModalOverlayOptions {
  /** How long the overlay stays mounted after it closes, in milliseconds. */
  exitMs: number
  /** Animation frames to wait before the open state is painted. */
  openFrames?: number
  /** Scroll lock and focus trap; false leaves the page usable. */
  modal?: MaybeRefOrGetter<boolean>
}

/** What `useModalOverlay` returns. */
export interface UseModalOverlayReturn {
  /** Whether the overlay is open; false with no context. */
  isOpen: ComputedRef<boolean>
  /** Whether the overlay is mounted; stays true while the exit transition runs. */
  isPresent: Readonly<Ref<boolean>>
  /** The state the overlay paints, for `data-state`. */
  motionState: Readonly<Ref<OverlayMotionState>>
  /** Click handler of the backdrop. */
  onBackdropClick: () => void
}

export function useModalOverlay(
  overlay: ModalOverlayContext | undefined,
  contentEl: MaybeRefOrGetter<HTMLElement | null | undefined>,
  options: UseModalOverlayOptions
): UseModalOverlayReturn {
  const isOpen = computed(() => overlay?.isOpen.value ?? false)
  const isModal = computed(() => toValue(options.modal) ?? true)
  const { isPresent, motionState } = useOverlayPresence(isOpen, options)
  const isScrollLocked = useScrollLock(defaultDocument?.body)
  const { isTop, isFocusTop } = useOverlayLayer(isOpen, { element: contentEl })

  watch(
    [isOpen, isModal],
    ([open, modal]) => {
      isScrollLocked.value = open && modal
    },
    { immediate: true }
  )

  useFocusTrap(contentEl, isOpen, () => isModal.value && isFocusTop.value, {
    initialFocus: 'field'
  })

  useEventListener(defaultDocument, 'keydown', (event: globalThis.KeyboardEvent) => {
    if (!isOpen.value || event.key !== 'Escape' || event.defaultPrevented) return
    if (!isTop.value) return
    if (!overlay?.dismissible) return
    event.preventDefault()
    overlay.dismiss()
  })

  watch(isOpen, async (open, wasOpen) => {
    if (open || !wasOpen || !overlay) return
    await nextTick()
    const target = overlay.triggerEl.value ?? overlay.returnFocusEl.value
    if (target?.isConnected) target.focus()
  })

  const onBackdropClick = () => {
    if (!overlay?.dismissible) return
    overlay.dismiss()
  }

  return { isOpen, isPresent, motionState, onBackdropClick }
}
