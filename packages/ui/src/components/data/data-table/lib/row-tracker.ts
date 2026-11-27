import type { ComponentPublicInstance } from 'vue'

export interface RowTracker {
  ids: WeakMap<Element, string>
  track: (instance: unknown, id: string, active: boolean) => void
  remeasure: () => void
  disconnect: () => void
}

export function createRowTracker(onResize: (entries: ResizeObserverEntry[]) => void): RowTracker {
  const rows = new Map<string, HTMLElement>()
  const ids = new WeakMap<Element, string>()
  let observer: ResizeObserver | null = null
  return {
    ids,
    track: (instance, id, active) => {
      const el = (instance as ComponentPublicInstance | null)?.$el as HTMLElement | undefined
      const previous = rows.get(id)
      if (previous && previous !== el) {
        observer?.unobserve(previous)
        rows.delete(id)
      }
      if (!el || !active || previous === el) return
      if (!observer) {
        if (typeof ResizeObserver === 'undefined') return
        observer = new ResizeObserver(onResize)
      }
      rows.set(id, el)
      ids.set(el, id)
      observer.observe(el)
    },
    remeasure: () => {
      for (const el of rows.values()) {
        observer?.unobserve(el)
        observer?.observe(el)
      }
    },
    disconnect: () => observer?.disconnect()
  }
}
