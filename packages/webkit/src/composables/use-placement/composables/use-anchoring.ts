import {
  type MaybeRefOrGetter,
  nextTick,
  onScopeDispose,
  readonly,
  type Ref,
  ref,
  toValue,
  watch
} from 'vue'

function toggleViewportListeners(
  on: boolean,
  onResize: () => void,
  onScroll: (event?: globalThis.Event) => void
): void {
  if (on) {
    globalThis.window?.addEventListener('resize', onResize)
    globalThis.document?.addEventListener('scroll', onScroll, true)
  } else {
    globalThis.window?.removeEventListener('resize', onResize)
    globalThis.document?.removeEventListener('scroll', onScroll, true)
  }
}

function observePanel(
  panel: globalThis.HTMLElement | null,
  onResize: () => void
): globalThis.ResizeObserver | null {
  if (typeof globalThis.ResizeObserver === 'undefined' || !panel) return null
  const observer = new globalThis.ResizeObserver(onResize)
  observer.observe(panel)
  return observer
}

export function useAnchoring(
  isOpen: MaybeRefOrGetter<boolean>,
  panelRef: MaybeRefOrGetter<globalThis.HTMLElement | null>,
  update: () => void,
  onResize: () => void,
  onScroll: (event?: globalThis.Event) => void,
  onClose: () => void
): Readonly<Ref<boolean>> {
  const anchored = ref(false)
  let anchorFrame = 0
  let disposed = false
  let listening = false
  let panelObserver: globalThis.ResizeObserver | null = null

  const listen = (on: boolean) => {
    if (on === listening) return
    listening = on
    toggleViewportListeners(on, onResize, onScroll)
  }

  watch(
    () => toValue(isOpen),
    async (open) => {
      if (!disposed) listen(open)
      if (!open) {
        anchored.value = false
        onClose()
        return
      }
      await nextTick()
      if (disposed) return
      update()
      await nextTick()
      if (disposed) return
      update()
      if (anchorFrame) globalThis.cancelAnimationFrame?.(anchorFrame)
      anchorFrame =
        globalThis.requestAnimationFrame?.(() => {
          anchorFrame = 0
          if (!disposed && toValue(isOpen)) anchored.value = true
        }) ?? 0
    },
    { immediate: true }
  )

  watch(
    () => toValue(panelRef),
    (panel) => {
      panelObserver?.disconnect()
      panelObserver = observePanel(panel, onResize)
    }
  )

  onScopeDispose(() => {
    disposed = true
    if (anchorFrame) globalThis.cancelAnimationFrame?.(anchorFrame)
    anchorFrame = 0
    listen(false)
    panelObserver?.disconnect()
    panelObserver = null
  })

  return readonly(anchored)
}
