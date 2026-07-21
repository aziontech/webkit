import { nextTick, onMounted, type Ref, ref, watch } from 'vue'

import type { DrawerMotionState } from '../presets/transitions'

export type { DrawerMotionState }

/**
 * Drives `data-state` for CSS transitions.
 * Enter: paints `closed` first, then `open` on the next frame.
 * Exit: keeps `open` for one frame, then `closed` so the browser can interpolate.
 */
export function useDrawerMotionState(isOpen: Ref<boolean>) {
  const motionState = ref<DrawerMotionState>('closed')

  const paintOpen = async () => {
    motionState.value = 'closed'
    await nextTick()

    // Double rAF: the first frame lands after Vue commits the `closed` DOM
    // (transform: translate-x-full); the second fires after the browser has
    // painted it, so flipping to `open` triggers a real transition instead
    // of the browser collapsing mount + state-flip into one paint (the
    // `<Teleport>` first-mount case where the initial computed style is
    // never painted).
    globalThis.requestAnimationFrame(() => {
      globalThis.requestAnimationFrame(() => {
        if (isOpen.value) {
          motionState.value = 'open'
        }
      })
    })
  }

  const paintClose = async () => {
    await nextTick()

    globalThis.requestAnimationFrame(() => {
      if (!isOpen.value) {
        motionState.value = 'closed'
      }
    })
  }

  watch(
    isOpen,
    (open) => {
      if (!open) {
        void paintClose()
        return
      }

      void paintOpen()
    },
    { flush: 'sync' }
  )

  onMounted(() => {
    if (isOpen.value) {
      void paintOpen()
    }
  })

  return { motionState }
}
