import { onScopeDispose } from 'vue'

export interface UseViewportListenersReturn {
  listen: (on: boolean) => void
}

export function useViewportListeners(
  onResize: () => void,
  onScroll: (event?: globalThis.Event) => void
): UseViewportListenersReturn {
  let listening = false

  function listen(on: boolean): void {
    if (on === listening) return
    listening = on
    if (on) {
      globalThis.window?.addEventListener('resize', onResize)
      globalThis.document?.addEventListener('scroll', onScroll, true)
    } else {
      globalThis.window?.removeEventListener('resize', onResize)
      globalThis.document?.removeEventListener('scroll', onScroll, true)
    }
  }

  onScopeDispose(() => listen(false))

  return { listen }
}
