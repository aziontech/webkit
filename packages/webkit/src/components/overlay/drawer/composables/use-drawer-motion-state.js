import { nextTick, onMounted, ref, watch } from 'vue'
/**
 * Drives `data-state` for CSS transitions: paints `closed` first, then flips to `open` on the next frame.
 */
export function useDrawerMotionState(isOpen) {
  const motionState = ref('closed')
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
