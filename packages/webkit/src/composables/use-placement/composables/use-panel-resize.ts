import { type MaybeRefOrGetter, onScopeDispose, toValue, watch } from 'vue'

export function usePanelResize(
  panelRef: MaybeRefOrGetter<globalThis.HTMLElement | null>,
  onResize: () => void
): void {
  let observer: globalThis.ResizeObserver | null = null

  function disconnect(): void {
    observer?.disconnect()
    observer = null
  }

  function observe(): void {
    disconnect()
    const panel = toValue(panelRef)
    if (typeof globalThis.ResizeObserver === 'undefined' || !panel) return
    observer = new globalThis.ResizeObserver(onResize)
    observer.observe(panel)
  }

  watch(() => toValue(panelRef), observe)

  onScopeDispose(disconnect)
}
