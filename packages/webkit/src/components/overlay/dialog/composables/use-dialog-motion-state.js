import { nextTick, onMounted, ref, watch } from 'vue'
/**
 * Drives `data-state` for CSS transitions.
 * Enter: paints `closed` first, then `open` on the next frame.
 * Exit: keeps `open` for one frame, then `closed` so the browser can interpolate.
 */
export function useDialogMotionState(isOpen) {
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
