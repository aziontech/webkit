import { nextTick, onMounted, type Ref, ref, watch } from 'vue'

import type { DrawerMotionState } from '../presets/transitions'

export type { DrawerMotionState }

/**
 * Drives `data-state` for CSS transitions: paints `closed` first, then flips to `open` on the next frame.
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

  watch(
    isOpen,
    (open) => {
      if (!open) {
        motionState.value = 'closed'
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
