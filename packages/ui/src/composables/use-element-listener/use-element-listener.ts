import { getCurrentScope, type MaybeRefOrGetter, onScopeDispose, toValue, watch } from 'vue'

export type UseElementListenerTarget = MaybeRefOrGetter<Element | null | undefined>

export type UseElementListenerReturn = () => void

export function useElementListener<K extends keyof globalThis.HTMLElementEventMap>(
  target: UseElementListenerTarget,
  type: K,
  handler: (event: globalThis.HTMLElementEventMap[K]) => void,
  options?: boolean | globalThis.AddEventListenerOptions
): UseElementListenerReturn {
  let attached: Element | null = null
  const listener = (event: Event) => handler(event as globalThis.HTMLElementEventMap[K])

  const detach = () => {
    attached?.removeEventListener(type, listener, options)
    attached = null
  }

  const stopWatch = watch(
    () => toValue(target) ?? null,
    (element) => {
      if (element === attached) return
      detach()
      element?.addEventListener(type, listener, options)
      attached = element
    },
    { flush: 'sync', immediate: true }
  )

  const stop = () => {
    stopWatch()
    detach()
  }

  if (getCurrentScope()) onScopeDispose(stop)

  return stop
}
