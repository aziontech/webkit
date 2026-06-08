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

    globalThis.requestAnimationFrame(() => {
      if (isOpen.value) {
        motionState.value = 'open'
      }
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
